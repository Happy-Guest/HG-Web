import { inject, ref } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
    const axios = inject("axios");
    const users = ref([]);

    const lastPage = ref();
    const pagesUsers = ref([]);
    const updateTable = ref(false);
    const filterTable = ref(null);
    const orderTable = ref(null);

    async function loadUserById(id) {
        try {
            const response = await axios.get("users/" + id);
            return response.data.data;
        } catch (error) {
            return error;
        }
    }

    async function loadUsers(page, filter, order) {
        let response;
        if (page == 0) {
            response = await axios.get("users/", {
                params: {
                    filter: filter,
                },
            });
            lastPage.value = response.data.meta.last_page;
            if (response.data.meta.total == 0) {
                return false;
            }
            return true;
        } else {
            response = await axios.get("users/", {
                params: {
                    filter: filter,
                    order: order,
                    page: page,
                },
            });
            lastPage.value = response.data.meta.last_page;
            users.value.push(response.data.data);
            pagesUsers.value.push(page);
            return users.value[pagesUsers.value.indexOf(page)];
        }
    }

    async function getUsers(page, filter, order) {
        if (pagesUsers.value.includes(page)) {
            return users.value[pagesUsers.value.indexOf(page)];
        }
        return await loadUsers(page, filter, order);
    }

    async function updateUser(userId, data) {
        try {
            let response = await axios.post("users/" + userId, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
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

    async function getCodesByUser(id, checkOut) {
        try {
            if (checkOut) {
                let response = await axios.get(
                    "users/" + id + "/codes?filter=NC"
                );
                return response.data.data;
            }
            let response = await axios.get("users/" + id + "/codes?filter=V");
            return response.data.data;
        } catch (error) {
            return error;
        }
    }

    async function resetPassword(userId) {
        try {
            let response = await axios.post("change-password", {
                user_id: userId,
            });
            return response;
        } catch (error) {
            return error.response;
        }
    }

    function clearStore() {
        users.value = [];
        lastPage.value = null;
        pagesUsers.value = [];
        updateTable.value = false;
    }

    return {
        users,
        lastPage,
        pagesUsers,
        updateTable,
        filterTable,
        orderTable,
        loadUserById,
        loadUsers,
        getUsers,
        updateUser,
        deleteUser,
        changeStateUser,
        getCodesByUser,
        resetPassword,
        clearStore,
    };
});
