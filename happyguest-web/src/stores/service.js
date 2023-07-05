import { inject, ref } from "vue";
import { defineStore } from "pinia";

export const useServiceStore = defineStore("service", () => {
    const axios = inject("axios");
    const items = ref([]);
    const lastPage = ref();
    const pagesItems = ref([]);
    const updateTableItems = ref(false);
    const filterTableItems = ref(null);
    const orderTableItems = ref(null);

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
            let response = await axios.post("services/" + id, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response;
        } catch (error) {
            return error;
        }
    }

    async function loadItemsService(idService, page, filter, order) {
        let response;
        if (page == 0) {
            response = await axios.get("services/" + idService + "/items", {
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
            response = await axios.get("services/" + idService + "/items", {
                params: {
                    filter: filter,
                    order: order,
                    page: page,
                },
            });
            lastPage.value = response.data.meta.last_page;
            items.value.push(response.data.data);
            pagesItems.value.push(page);
            return items.value[pagesItems.value.indexOf(page)];
        }
    }

    async function getItemsService(idService, page, filter, order) {
        if (pagesItems.value.includes(page)) {
            return items.value[pagesItems.value.indexOf(page)];
        }
        return await loadItemsService(idService, page, filter, order);
    }

    function clearStore() {
        items.value = [];
        lastPage.value = null;
        pagesItems.value = [];
        updateTableItems.value = false;
    }

    return {
        items,
        lastPage,
        pagesItems,
        updateTableItems,
        filterTableItems,
        orderTableItems,
        getService,
        editService,
        getItemsService,
        clearStore,
    };
});
