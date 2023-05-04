import { inject, ref } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
    const axios = inject("axios");
    const users = ref([]);
    const lastPage = ref();
    const pagesUsers = ref([]);

    async function loadUserById(id) {
        try {
            const response = await axios.get("users/" + id);
            return response.data.data;
        } catch (error) {
            return error;
        }
    }

    async function loadUsers(page) {
        let response;
        if (page == 0) {
            response = await axios.get("users/");
            lastPage.value = response.data.meta.last_page;
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
            return users.value[pagesUsers.value.indexOf(page)];
        }
        return await loadUsers(page);
    }

    async function blockUnblockUser(user) {
        try {
            if (user.blocked == 1) {
                await axios.patch("users/" + user.id + "/unblock");
            } else {
                await axios.patch("users/" + user.id + "/block");
            }
            return true;
        } catch (error) {
            return error;
        }
    }


    return {
        users,
        lastPage,
        pagesUsers,
        loadUserById,
        loadUsers,
        getUsers,
        blockUnblockUser,
    };
});
