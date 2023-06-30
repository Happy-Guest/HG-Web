import { inject, ref } from "vue";
import { defineStore } from "pinia";

export const useServiceStore = defineStore("service", () => {
    const axios = inject("axios");
    const items = ref([]);
    const lastPage = ref();
    const pagesItems = ref([]);

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
            return response;
        } catch (error) {
            return error;
        }
    }

    async function loadItemsService(idService, page) {
        let response;
        if (page == 0) {
            response = await axios.get("services/" + idService + "/items");
            lastPage.value = response.data.meta.last_page;
            if (response.data.meta.total == 0) {
                return false;
            }
            return true;
        } else {
            response = await axios.get("services/" + idService + "/items", {
                params: {
                    page: page,
                },
            });
            lastPage.value = response.data.meta.last_page;
            items.value.push(response.data.data);
            pagesItems.value.push(page);
            return items.value[pagesItems.value.indexOf(page)];
        }
    }

    async function getItemsService(idService, page) {
        if (pagesItems.value.includes(page)) {
            return items.value[pagesItems.value.indexOf(page)];
        }
        return await loadItemsService(idService, page);
    }

    function clearStore() {
        items.value = [];
        lastPage.value = null;
        pagesItems.value = [];
    }

    return {
        items,
        lastPage,
        pagesItems,
        getService,
        editService,
        getItemsService,
        clearStore,
    };
});
