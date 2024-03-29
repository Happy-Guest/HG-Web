import { inject, ref } from "vue";
import { defineStore } from "pinia";

export const useItemStore = defineStore("item", () => {
    const axios = inject("axios");
    const items = ref([]);
    const lastPage = ref();
    const pagesItems = ref([]);
    const updateTable = ref(false);
    const filterTable = ref(null);
    const orderTable = ref(null);

    async function getItem(id) {
        try {
            let response = await axios.get("items/" + id);
            return response.data.data;
        } catch (error) {
            return error;
        }
    }

    async function loadItems(page, filter, order, search) {
        let response;
        if (page == 0) {
            response = await axios.get("items/", {
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
            response = await axios.get("items/", {
                params: {
                    filter: filter,
                    order: order,
                    search: search,
                    page: page,
                },
            });
            lastPage.value = response.data.meta.last_page;
            items.value.push(response.data.data);
            pagesItems.value.push(page);
            return items.value[pagesItems.value.indexOf(page)];
        }
    }

    async function getItems(page, filter, order, search) {
        if (pagesItems.value.includes(page)) {
            return items.value[pagesItems.value.indexOf(page)];
        }
        return await loadItems(page, filter, order, search);
    }

    async function updateItem(id, data) {
        try {
            let response = await axios.patch("items/" + id, data);
            return response;
        } catch (error) {
            return error.response;
        }
    }

    async function deleteItem(itemId, data) {
        try {
            let response = await axios.delete("items/" + itemId, {
                data: {
                    password: data,
                },
            });
            return response;
        } catch (error) {
            return error.response;
        }
    }

    async function registerItem(item) {
        try {
            let response = await axios.post("items", item);
            return response;
        } catch (error) {
            return error.response;
        }
    }

    async function associateItem(itemId, serviceId, data) {
        try {
            let response;
            if (itemId == null) {
                response = await axios.post(
                    "items/0/service/" + serviceId + "/associate",
                    {
                        items: data,
                    }
                );
            } else {
                response = await axios.post(
                    "items/" + itemId + "/service/" + serviceId + "/associate"
                );
            }
            return response;
        } catch (error) {
            return error.response;
        }
    }

    async function dissociateItem(itemId, serviceId) {
        try {
            let response = await axios.delete(
                "items/" + itemId + "/service/" + serviceId + "/disassociate"
            );
            return response;
        } catch (error) {
            return error.response;
        }
    }

    function clearStore() {
        items.value = [];
        lastPage.value = null;
        pagesItems.value = [];
        updateTable.value = false;
    }

    return {
        items,
        lastPage,
        pagesItems,
        updateTable,
        filterTable,
        orderTable,
        getItem,
        getItems,
        updateItem,
        deleteItem,
        registerItem,
        associateItem,
        dissociateItem,
        clearStore,
    };
});
