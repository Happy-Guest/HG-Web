import { inject, ref } from "vue";
import { defineStore } from "pinia";

export const useCheckoutStore = defineStore("checkout", () => {
    const axios = inject("axios");
    const checkouts = ref([]);

    const lastPage = ref();
    const pagesCheckouts = ref([]);
    const updateTable = ref(false);
    const filterTable = ref(null);
    const orderTable = ref(null);

    async function loadCheckouts(page, filter, order) {
        let response;
        if (page == 0) {
            response = await axios.get("checkouts/", {
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
            response = await axios.get("checkouts/", {
                params: {
                    filter: filter,
                    order: order,
                    page: page,
                },
            });
            lastPage.value = response.data.meta.last_page;
            checkouts.value.push(response.data.data);
            pagesCheckouts.value.push(page);
            return checkouts.value[pagesCheckouts.value.indexOf(page)];
        }
    }

    async function getCheckouts(page, filter, order) {
        if (pagesCheckouts.value.includes(page)) {
            return checkouts.value[pagesCheckouts.value.indexOf(page)];
        }
        return await loadCheckouts(page, filter, order);
    }

    async function getCheckout(id) {
        try {
            let response = await axios.get("checkouts/" + id);
            return response.data.data;
        } catch (error) {
            return error;
        }
    }

    async function validateCheckout(id) {
        try {
            let response = await axios.patch("checkouts/" + id + "/validate");
            console.log(response);
            return response.data.data;
        } catch (error) {
            return error;
        }
    }

    async function registerCheckout(checkout) {
        try {
            let response = await axios.post("checkouts", checkout);
            return response;
        } catch (error) {
            return error.response;
        }
    }

    async function deleteCheckout(checkoutId, data) {
        console.log(checkoutId);
        try {
            let response = await axios.delete("checkouts/" + checkoutId, {
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
        checkouts.value = [];
        lastPage.value = null;
        pagesCheckouts.value = [];
        updateTable.value = false;
    }

    return {
        checkouts,
        lastPage,
        pagesCheckouts,
        updateTable,
        filterTable,
        orderTable,
        validateCheckout,
        getCheckouts,
        getCheckout,
        registerCheckout,
        clearStore,
        deleteCheckout,
    };
});
