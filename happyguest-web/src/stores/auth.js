import { inject, ref, computed } from "vue";
import { defineStore } from "pinia";
import router from "@/router";
import { useMainStore } from "@/stores/main.js";

export const useAuthStore = defineStore("auth", () => {
    const axios = inject("axios");
    const user = ref(null);

    const mainStore = useMainStore();

    const userId = computed(() => {
        return user.value?.id ?? -1;
    });

    const isLogged = computed(() => {
        return localStorage.getItem("token") != null;
    });

    async function loadUser() {
        try {
            const response = await axios.get("me");
            user.value = response.data;
            localStorage.setItem("user", JSON.stringify(response.data));
        } catch (error) {
            clearUser();
            return error;
        }
    }

    function clearUser() {
        delete axios.defaults.headers.common.Authorization;
        localStorage.removeItem("token");
        localStorage.removeItem("remember");
        localStorage.removeItem("user");
        localStorage.removeItem("showNotifs");
        user.value = null;
        router.push({ name: "login" });
    }

    async function login(credentials) {
        let response;
        try {
            response = await axios.post("login", credentials);
            axios.defaults.headers.common.Authorization =
                "Bearer " + response.data.access_token;
            localStorage.setItem("token", response.data.access_token);
            localStorage.setItem("remember", credentials.remember);
            mainStore.setNotifs(true);
            await loadUser();
            return true;
        } catch (error) {
            clearUser();
            if (error.response.status == 503) {
                error.response.data.message =
                    "Servico indisponivel no momento, tente novamente mais tarde.";
            }
            return error.response;
        }
    }

    async function register(credentials) {
        try {
            const response = await axios.post("register-team", credentials, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response;
        } catch (error) {
            if (error.response.status == 503) {
                error.response.data.message =
                    "Servico indisponivel no momento, tente novamente mais tarde.";
            }
            return error.response;
        }
    }

    async function restoreToken() {
        let storedToken = localStorage.getItem("token");
        let storedRemember = localStorage.getItem("remember");
        let storedUser = localStorage.getItem("user");
        mainStore.setNotifs(localStorage.getItem("showNotifs") == "true");

        if (storedRemember == "false" && storedToken) {
            axios.defaults.headers.common.Authorization =
                "Bearer " + storedToken;
            await logout();
        } else if (storedToken) {
            axios.defaults.headers.common.Authorization =
                "Bearer " + storedToken;
            if (storedUser) {
                user.value = JSON.parse(storedUser);
            }
            user.value = JSON.parse(storedUser);
            await loadUser();
            return true;
        }
        clearUser();
        return false;
    }

    async function logout() {
        let response;
        try {
            response = await axios.post("logout");
            clearUser();
            return true;
        } catch (error) {
            if (error.response.status == 401) {
                clearUser();
                return true;
            }
            return response.data;
        }
    }

    async function changePassword(data) {
        try {
            let response = await axios.post("change-password", data);
            return response;
        } catch (error) {
            return error.response;
        }
    }

    return {
        user,
        userId,
        isLogged,
        loadUser,
        login,
        register,
        restoreToken,
        logout,
        changePassword,
    };
});
