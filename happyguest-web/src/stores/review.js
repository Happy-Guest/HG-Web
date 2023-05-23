import { inject, ref } from "vue";
import { defineStore } from "pinia";

export const useReviewStore = defineStore("review", () => {
    const axios = inject("axios");
    const reviews = ref([]);

    const lastPage = ref();
    const pagesReviews = ref([]);
    const updateTable = ref(false);

    async function loadReviews(page) {
        let response;
        if (page == 0) {
            response = await axios.get("reviews/");
            lastPage.value = response.data.meta.last_page;
            if (response.data.meta.total == 0) {
                return false;
            }
            return true;
        } else {
            response = await axios.get("reviews?page=" + page);
            lastPage.value = response.data.meta.last_page;
            reviews.value.push(response.data.data);
            pagesReviews.value.push(page);
            return reviews.value[pagesReviews.value.indexOf(page)];
        }
    }

    async function getReviews(page) {
        if (pagesReviews.value.includes(page)) {
            return reviews.value[pagesReviews.value.indexOf(page)];
        }
        return await loadReviews(page);
    }

    async function getReview(id) {
        try {
            let response = await axios.get("reviews/" + id);
            return response.data.data;
        } catch (error) {
            return error;
        }
    }

    async function deleteReview(reviewId, data) {
        try {
            let response = await axios.delete("reviews/" + reviewId, {
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
        reviews.value = [];
        lastPage.value = null;
        pagesReviews.value = [];
        updateTable.value = false;
    }

    return {
        reviews,
        lastPage,
        pagesReviews,
        updateTable,
        loadReviews,
        getReviews,
        getReview,
        deleteReview,
        clearStore,
    };
});
