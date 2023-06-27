import { inject } from "vue";
import { defineStore } from "pinia";

export const useServiceStore = defineStore("service", () => {
    const axios = inject("axios");

    async function getService(id) {
        try {
            let response = await axios.get("services/" + id);
            return response.data.data;
        } catch (error) {
            return error;
        }
    }

    async function editService(id, data) {
        try {
            let response = await axios.patch("services/" + id, data);
            console.log(response);
            return response.data;
        } catch (error) {
            return error;
        }
    }

    return {
        getService,
        editService,
    };
});
