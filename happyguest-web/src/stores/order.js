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
            let response = await axios.get("order/" + id);
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
    };
});