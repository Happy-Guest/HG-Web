import { inject, ref } from "vue";
import { defineStore } from "pinia";

export const useComplaintStore = defineStore("complaint", () => {
    const axios = inject("axios");
    const complaints = ref([]);

    const lastPage = ref();
    const pagesComplaints = ref([]);

    async function loadComplaints(page) {
        let response;
        if (page == 0) {
            response = await axios.get("complaints/");
            lastPage.value = response.data.meta.last_page;
            if (response.data.meta.total == 0) {
                return false;
            }
            return true;
        } else {
            response = await axios.get("complaints?page=" + page);
            complaints.value.push(response.data.data);
            pagesComplaints.value.push(page);
            return complaints.value[pagesComplaints.value.indexOf(page)];
        }
    }

    async function getComplaints(page) {
        if (pagesComplaints.value.includes(page)) {
            return complaints.value[pagesComplaints.value.indexOf(page)];
        }
        return await loadComplaints(page);
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
        try {
            const response = await axios.post("complaints/", data);
            if (response.status == 201) {
                complaints.value = [];
                pagesComplaints.value = [];
                loadComplaints(0);
            }
            return response;
        } catch (error) {
            return error;
        }
    }

    return {
        complaints,
        lastPage,
        pagesComplaints,
        getComplaints,
        getComplaint,
        responseComplaint,
        createComplaint,
    };
});
