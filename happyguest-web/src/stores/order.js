import { inject, ref } from "vue";
import { defineStore } from "pinia";

export const useOrderStore = defineStore("order", () => {
    const axios = inject("axios");
    const orders = ref([]);
    const lastPage = ref();
    const pagesOrders = ref([]);
    const updateTable = ref(false);
    const filterTable = ref(null);
    const orderTable = ref(null);

    async function getOrder(id) {
        try {
            let response = await axios.get("orders/" + id);
            return response.data.data;
        } catch (error) {
            return error;
        }
    }

    async function loadOrders(page, filter, order) {
        let response;
        if (page == 0) {
            response = await axios.get("orders/", {
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
            response = await axios.get("orders/", {
                params: {
                    filter: filter,
                    order: order,
                    page: page,
                },
            });
            lastPage.value = response.data.meta.last_page;
            orders.value.push(response.data.data);
            pagesOrders.value.push(page);
            return orders.value[pagesOrders.value.indexOf(page)];
        }
    }

    async function getOrders(page, filter, order) {
        if (pagesOrders.value.includes(page)) {
            return orders.value[pagesOrders.value.indexOf(page)];
        }
        return await loadOrders(page, filter, order);
    }

    async function registerOrder(order) {
        try {
            let response = await axios.post("orders", order);
            return response;
        } catch (error) {
            return error.response;
        }
    }

    async function deleteOrder(id, data) {
        try {
            let response = await axios.delete("orders/" + id, {
                data: {
                    password: data,
                },
            });
            return response;
        } catch (error) {
            return error.response;
        }
    }

    async function updateStatus(id, data) {
        try {
            const response = await axios.patch("orders/" + id, data);
            return response;
        } catch (error) {
            return error.response;
        }
    }

    function clearStore() {
        orders.value = [];
        lastPage.value = null;
        pagesOrders.value = [];
        updateTable.value = false;
    }

    return {
        orders,
        lastPage,
        pagesOrders,
        updateTable,
        filterTable,
        orderTable,
        getOrder,
        getOrders,
        clearStore,
        registerOrder,
        deleteOrder,
        updateStatus,
    };
});
