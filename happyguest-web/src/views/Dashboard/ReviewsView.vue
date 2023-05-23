<script setup>
import { mdiStarShooting, mdiFilterMultiple } from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Sections/SectionMain.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";
import CardBoxComponentEmpty from "@/components/CardBoxs/CardBoxComponentEmpty.vue";
import TableReviews from "@/components/Tables/TableReviews.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import { onMounted, ref } from "vue";
import { useReviewStore } from "@/stores/review";

const reviewStore = useReviewStore();

const hasReviews = ref(false);

const selectOptionsFilter = [
    { value: "ALL", label: "Todas" },
    { value: "S", label: "Partilhadas" },
    { value: "NS", label: "Não Partilhadas" },
    { value: "A", label: "Com Autorização" },
    { value: "NA", label: "Sem Autorização" },
];

const filter = ref(selectOptionsFilter[0]);

onMounted(async () => {
    hasReviews.value = await reviewStore.getReviews(0);
});
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLine
                :icon="mdiStarShooting"
                :title="'Avaliações'"
                main
            >
                <div>
                    <div class="flex mr-0 sm:mr-12">
                        <b class="my-auto mr-4">Filtrar:</b>
                        <FormControl
                            id="filter"
                            v-model="filter"
                            :options="selectOptionsFilter"
                            :icon="mdiFilterMultiple"
                        />
                    </div>
                </div>
            </SectionTitleLine>
            <CardBox class="mb-6" has-table>
                <TableReviews v-if="hasReviews" :filter="filter.value" />
                <CardBoxComponentEmpty
                    v-else
                    message="Sem avaliações registadas..."
                />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
