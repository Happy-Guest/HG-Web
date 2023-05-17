<script setup>
import { mdiStarShooting } from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Sections/SectionMain.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";
import CardBoxComponentEmpty from "@/components/CardBoxs/CardBoxComponentEmpty.vue";
import TableReviews from "@/components/Tables/TableReviews.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
//import CardBoxReview from "@/components/CardBoxsCustom/CardBoxReview.vue";
import { onMounted, ref } from "vue";
import { useReviewStore } from "@/stores/review";

const reviewStore = useReviewStore();

const hasReviews = ref(false);

onMounted(async () => {
    hasReviews.value = await reviewStore.getReviews(0);
});
</script>

<template>
    <LayoutAuthenticated>
        <!-- <CardBoxReview
            :active="isModalActiveCreate"
            @update:active="isModalActiveCreate = $event"
        /> -->
        <SectionMain>
            <SectionTitleLine
                :icon="mdiStarShooting"
                :title="'Avaliações'"
                main
            >
            </SectionTitleLine>
            <CardBox class="mb-6" has-table>
                <TableReviews v-if="hasReviews" />
                <CardBoxComponentEmpty
                    v-else
                    message="Sem avaliações registadas..."
                />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
