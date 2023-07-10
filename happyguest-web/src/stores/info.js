import { inject } from "vue";
import { defineStore } from "pinia";

export const useInfoStore = defineStore("info", () => {
    const axios = inject("axios");

    async function getHotel() {
        try {
            let response = await axios.get("hotels/1");
            return response.data.data;
        } catch (error) {
            return error;
        }
    }

    async function updateHotel(data) {
        try {
            const response = await axios.patch("hotels/1", data);
            return response;
        } catch (error) {
            return error;
        }
    }

    async function getRegion() {
        try {
            let response = await axios.get("regions/1");
            return response.data.data;
        } catch (error) {
            return error;
        }
    }

    async function updateRegion(data) {
        try {
            const response = await axios.patch("regions/1", data);
            return response;
        } catch (error) {
            return error;
        }
    }

    return {
        getHotel,
        updateHotel,
        getRegion,
        updateRegion,
    };
});
