import { inject, ref } from "vue";
import { defineStore } from "pinia";

export const useItemStore = defineStore("item", () => {
    const axios = inject("axios");
    const items = ref([]);
    const lastPage = ref();
    const pagesItems = ref([]);

    async function getItem(id) {
        try {
            let response = await axios.get("items/" + id);
            return response.data.data;
        } catch (error) {
            return error;
        }
    }

    async function loadItems(page) {
        let response;
        if (page == 0) {
            response = await axios.get("items/");
            lastPage.value = response.data.meta.last_page;
            if (response.data.meta.total == 0) {
                return false;
            }
            return true;
        } else {
            response = await axios.get("items/", {
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

    async function getItems(page) {
        if (pagesItems.value.includes(page)) {
            return items.value[pagesItems.value.indexOf(page)];
        }
        return await loadItems(page);
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
        getItem,
        getItems,
        clearStore,
    };
});
