import { inject, ref } from "vue";
import { defineStore } from "pinia";

export const useCodeStore = defineStore("code", () => {
    const axios = inject("axios");
    const codes = ref([]);

    const lastPage = ref();
    const pagesCodes = ref([]);

    async function loadCodes(page) {
        let response;
        if (page == 0) {
            response = await axios.get("codes/");
            lastPage.value = response.data.meta.last_page;
            if (response.data.meta.total == 0) {
                return false;
            }
            return true;
        } else {
            response = await axios.get("codes?page=" + (page - 1));
            codes.value.push(response.data.data);
            pagesCodes.value.push(page);
            return codes.value[pagesCodes.value.indexOf(page)];
        }
    }

    async function getCodes(page) {
        if (pagesCodes.value.includes(page)) {
            return codes.value[pagesCodes.value.indexOf(page)];
        }
        return await loadCodes(page);
    }

    async function getCode(id) {
        try {
            const response = await axios.get("codes/" + id);
            return response.data.data;
        } catch (error) {
            return error;
        }
    }


    return {
        codes,
        lastPage,
        pagesCodes,
        getCodes,
        getCode,
    };
});
