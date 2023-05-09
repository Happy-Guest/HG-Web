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

    async function blockUnblockUser(userId, userBlocked) {
        try {
            let response;
            if (userBlocked == 1) {
                response = await axios.patch("users/" + userId + "/unblock");
            } else {
                response = await axios.patch("users/" + userId + "/block");
            }
            return response.status;
        } catch (error) {
            return error;
        }
    }

    async function updateUser(userId, data) {
        try {
            let response = await axios.patch("users/" + userId, data);
            return response;
        } catch (error) {
            return error.response;
        }
    }

    async function deleteUser(userId, data) {
        try {
            let response = await axios.delete("users/" + userId, {
                data: {
                    password: data,
                },
            });
            return response;
        } catch (error) {
            return error.response;
        }
    }

    async function changeStateUser(userId, blocked) {
        try {
            if (blocked == 1) {
                let response = await axios.patch(
                    "users/" + userId + "/unblock"
                );
                return response;
            } else {
                let response = await axios.patch("users/" + userId + "/block");
                return response;
            }
        } catch (error) {
            return error.response;
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
        updateUser,
        deleteUser,
        changeStateUser,
    };
});
