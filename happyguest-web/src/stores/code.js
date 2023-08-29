import { inject, ref } from "vue";
import { defineStore } from "pinia";

export const useCodeStore = defineStore("code", () => {
    const axios = inject("axios");
    const codes = ref([]);

    const lastPage = ref();
    const pagesCodes = ref([]);
    const updateTable = ref(false);
    const filterTable = ref(null);
    const orderTable = ref(null);

    async function loadCodes(page, filter, order, search) {
        let response;
        if (page == 0) {
            response = await axios.get("codes/", {
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
            response = await axios.get("codes/", {
                params: {
                    filter: filter,
                    order: order,
                    search: search,
                    page: page,
                },
            });
            lastPage.value = response.data.meta.last_page;
            codes.value.push(response.data.data);
            pagesCodes.value.push(page);
            return codes.value[pagesCodes.value.indexOf(page)];
        }
    }

    async function getCodes(page, filter, order, search) {
        if (pagesCodes.value.includes(page)) {
            return codes.value[pagesCodes.value.indexOf(page)];
        }
        return await loadCodes(page, filter, order, search);
    }

    async function getCode(id) {
        try {
            let response = await axios.get("codes/" + id);
            return response.data.data;
        } catch (error) {
            return error;
        }
    }

    async function getUsersByCode(id) {
        try {
            let response = await axios.get("codes/" + id + "/users");
            return response.data.data;
        } catch (error) {
            return error;
        }
    }

    async function createCode(code) {
        try {
            let response = await axios.post("codes", code);
            return response;
        } catch (error) {
            return error.response;
        }
    }

    async function updateCode(id, data) {
        try {
            let response = await axios.patch("codes/" + id, data);
            return response;
        } catch (error) {
            return error.response;
        }
    }

    async function deleteCode(codeId, data) {
        try {
            let response = await axios.delete("codes/" + codeId, {
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
        codes.value = [];
        lastPage.value = null;
        pagesCodes.value = [];
        updateTable.value = false;
    }

    return {
        codes,
        lastPage,
        pagesCodes,
        updateTable,
        filterTable,
        orderTable,
        getCodes,
        getCode,
        getUsersByCode,
        createCode,
        updateCode,
        deleteCode,
        clearStore,
    };
});
