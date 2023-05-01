import { inject, ref, computed } from "vue";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
    const axios = inject("axios");
    const user = ref(null);
    const users = ref([]);
    const lastPage = ref();
    const pagesUsers = ref([]);

    const userId = computed(() => {
        return user.value?.id ?? -1;
    });

    async function loadUser() {
        try {
            const response = await axios.get("me");
            user.value = response.data;
        } catch (error) {
            clearUser();
            return error;
        }
    }

    async function loadUserById(id) {
        try {
            const response = await axios.get("users/" + id);
            return response.data.data;
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



    async function loadUsers(page) {
        let response;
        if (page == 0) {
            response = await axios.get("users/");
            lastPage.value = response.data.meta.last_page
            if (response.data.meta.total == 0) {
                return false;
            }
            return true;
        } else {
            response = await axios.get("users?page=" + (page - 1));
            users.value.push(response.data.data);
            pagesUsers.value.push(page);
            return users.value[pagesUsers.value.indexOf(page)];
        }
    }

    async function getUsers(page) {
            if (pagesUsers.value.includes(page)) {
                return users.value[
                    pagesUsers.value.indexOf(page)
                ];
            }
            return await loadUsers(page);
        
    }

    return {
        user,
        users,
        userId,
        lastPage,
        pagesUsers,
        getUsers,
        login,
        restoreToken,
        logout,
        loadUserById,
    };
});