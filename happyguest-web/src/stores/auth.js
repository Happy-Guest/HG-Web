import { inject, ref, computed } from "vue";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
    const axios = inject("axios");
    const user = ref(null);

    const userId = computed(() => {
        return user.value?.id ?? -1;
    });

    async function loadUser() {
        try {
            const response = await axios.get("me");
            user.value = response.data;
            console.log(user.value);
        } catch (error) {
            clearUser();
            return error;
        }
    }

    function clearUser() {
        delete axios.defaults.headers.common.Authorization;
        localStorage.removeItem("token");
        user.value = null;
    }

    async function login(credentials) {
        let response;
        try {
            response = await axios.post("login", credentials);
            console.log(response);
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

        if (storedRemember == "false" && storedToken) {
            axios.defaults.headers.common.Authorization =
                "Bearer " + storedToken;
            await logout();
        } else if (storedToken) {
            axios.defaults.headers.common.Authorization =
                "Bearer " + storedToken;
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
        } catch {
            return response.data;
        }
    }


    return {
        user,
        userId,
        login,
        restoreToken,
        logout,
    };
});