import { inject, ref } from "vue";
import { defineStore } from "pinia";

export const useReserveStore = defineStore("reserve", () => {
    const axios = inject("axios");
    const reserves = ref([]);
    const lastPage = ref();
    const pagesReserves = ref([]);
    const updateTable = ref(false);
    const filterTable = ref(null);
    const orderTable = ref(null);

    async function getReserve(id) {
        try {
            let response = await axios.get("reserves/" + id);
            return response.data.data;
        } catch (error) {
            return error;
        }
    }

    async function loadReserves(page, filter, order) {
        let response;
        if (page == 0) {
            response = await axios.get("reserves/", {
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
            response = await axios.get("reserves/", {
                params: {
                    filter: filter,
                    order: order,
                    page: page,
                },
            });
            lastPage.value = response.data.meta.last_page;
            reserves.value.push(response.data.data);
            pagesReserves.value.push(page);
            return reserves.value[pagesReserves.value.indexOf(page)];
        }
    }

    async function getReserves(page, filter, order) {
        if (pagesReserves.value.includes(page)) {
            return reserves.value[pagesReserves.value.indexOf(page)];
        }
        return await loadReserves(page, filter, order);
    }

    async function registerReserve(reserve) {
        try {
            let response = await axios.post("reserves", reserve);
            return response;
        } catch (error) {
            return error.response;
        }
    }

    async function updateStatus(id, data) {
        try {
            const response = await axios.patch("reserves/" + id, data);
            return response;
        } catch (error) {
            return error.response;
        }
    }

    async function deleteReserve(id, data) {
        try {
            let response = await axios.delete("reserves/" + id, {
                data: {
                    password: data,
                },
            });
            return response;
        } catch (error) {
            return error.response;
        }
    }

    function clearStore() {
        reserves.value = [];
        lastPage.value = null;
        pagesReserves.value = [];
        updateTable.value = false;
    }

    return {
        reserves,
        lastPage,
        pagesReserves,
        updateTable,
        filterTable,
        orderTable,
        getReserve,
        getReserves,
        clearStore,
        registerReserve,
        updateStatus,
        deleteReserve,
    };
});
