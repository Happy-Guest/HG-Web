import { inject, ref } from "vue";
import { defineStore } from "pinia";

export const useComplaintStore = defineStore("complaint", () => {
    const axios = inject("axios");
    const complaints = ref([]);

    const lastPage = ref();
    const pagesComplaints = ref([]);
    const updateTable = ref(false);
    const filterTable = ref(null);
    const orderTable = ref(null);

    async function loadComplaints(page, userId, filter, order) {
        let response;
        if (page == 0) {
            if (userId) {
                response = await axios.get("users/" + userId + "/complaints");
            } else {
                response = await axios.get("complaints/", {
                    params: {
                        filter: filter,
                    },
                });
            }
            lastPage.value = response.data.meta.last_page;
            if (response.data.meta.total == 0) {
                return false;
            }
            return true;
        } else {
            if (userId) {
                response = await axios.get(
                    "users/" + userId + "/complaints?page=" + page
                );
            } else {
                response = await axios.get("complaints/", {
                    params: {
                        filter: filter,
                        order: order,
                        page: page,
                    },
                });
            }
            lastPage.value = response.data.meta.last_page;
            complaints.value.push(response.data.data);
            pagesComplaints.value.push(page);
            return complaints.value[pagesComplaints.value.indexOf(page)];
        }
    }

    async function getComplaints(page, userId, filter, order) {
        if (pagesComplaints.value.includes(page)) {
            return complaints.value[pagesComplaints.value.indexOf(page)];
        }
        return await loadComplaints(page, userId, filter, order);
    }

    async function getComplaint(id) {
        try {
            const response = await axios.get("complaints/" + id);
            return response.data.data;
        } catch (error) {
            return error;
        }
    }

    async function responseComplaint(id, data) {
        try {
            const response = await axios.patch("complaints/" + id, data);
            return response;
        } catch (error) {
            return error;
        }
    }

    async function createComplaint(data) {
        let formData = new FormData();
        formData.append("title", data.title);
        formData.append("date", data.date);
        formData.append("comment", data.comment);
        formData.append("local", data.local);
        formData.append("response", data.response);
        formData.append("status", data.status);
        if (data.user_id) {
            formData.append("user_id", data.user_id);
        }
        if (data.files) {
            for (let i = 0; i < data.files.length; i++) {
                formData.append("files[]", data.files[i]);
            }
        }
        try {
            const response = await axios.post("complaints/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response;
        } catch (error) {
            return error;
        }
    }

    async function file(id, fileId) {
        try {
            const response = await axios.get(
                "complaints/" + id + "/file/" + fileId,
                {
                    responseType: "blob",
                }
            );
            return response;
        } catch (error) {
            return error;
        }
    }

    function clearStore() {
        complaints.value = [];
        lastPage.value = null;
        pagesComplaints.value = [];
        updateTable.value = false;
    }

    return {
        complaints,
        lastPage,
        pagesComplaints,
        updateTable,
        filterTable,
        orderTable,
        getComplaints,
        getComplaint,
        responseComplaint,
        createComplaint,
        file,
        clearStore,
    };
});
