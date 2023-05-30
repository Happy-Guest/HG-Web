import { inject } from "vue";
import { defineStore } from "pinia";

export const useMainStore = defineStore("main", () => {
    const axios = inject("axios");

    async function getHomeStatistics() {
        try {
            return await axios.get("stats/home");
        } catch (error) {
            return error;
        }
    }

    async function getHomeGraph() {
        try {
            return await axios.get("stats/graph");
        } catch (error) {
            return error;
        }
    }

    return {
        getHomeStatistics,
        getHomeGraph,
    };
});
