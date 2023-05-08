import { inject, ref, computed } from "vue";
import { defineStore } from "pinia";
import router from "@/router";

export const useAuthStore = defineStore("auth", () => {
    const axios = inject("axios");
    const user = ref(null);

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
            await loadUser();
            return true;
        } catch (error) {
            clearUser();
            return error.response;
        }
    }

    async function restoreToken() {
        let storedToken = localStorage.getItem("token");
        let storedRemember = localStorage.getItem("remember");
        let storedUser = localStorage.getItem("user");

        if (storedRemember == "false" && storedToken) {
            axios.defaults.headers.common.Authorization =
                "Bearer " + storedToken;
            await logout();
        } else if (storedToken) {
            axios.defaults.headers.common.Authorization =
                "Bearer " + storedToken;
            if (!storedUser) {
                await loadUser();
            } else {
                user.value = JSON.parse(storedUser);
            }
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
        login,
        restoreToken,
        logout,
        changePassword,
    };
});
