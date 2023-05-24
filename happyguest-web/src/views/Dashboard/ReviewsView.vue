<script setup>
import {
    mdiStarShooting,
    mdiFilterMultiple,
    mdiOrderNumericDescending,
    mdiOrderNumericAscending,
} from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Sections/SectionMain.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";
import CardBoxComponentEmpty from "@/components/CardBoxs/CardBoxComponentEmpty.vue";
import TableReviews from "@/components/Tables/TableReviews.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import { onMounted, ref, watch, watchEffect } from "vue";
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

const selectOptionsOrder = [
    { value: "DESC", label: "Descendente" },
    { value: "ASC", label: "Ascendente" },
];

const filter = ref(selectOptionsFilter[0]);
const order = ref(selectOptionsOrder[0]);

onMounted(async () => {
    hasReviews.value = await reviewStore.getReviews(0, filter.value.value);
});

watch(filter, async (value) => {
    if (value.value != reviewStore.filterTable) {
        hasReviews.value = await reviewStore.getReviews(0, value.value);
        setTimeout(() => {
            reviewStore.filterTable = value.value;
        }, 200);
    }
});

watch(order, (value) => {
    reviewStore.orderTable = value.value;
});

watchEffect(() => {
    if (reviewStore.filterTable) {
        filter.value = selectOptionsFilter.find(
            (option) => option.value === reviewStore.filterTable
        );
    }
});

watchEffect(() => {
    if (reviewStore.orderTable) {
        order.value = selectOptionsOrder.find(
            (option) => option.value === reviewStore.orderTable
        );
    }
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
                <div class="flex mr-0 sm:mr-12 lg:mr-8">
                    <div class="flex flex-col lg:flex-row">
                        <b class="my-auto mr-4">Ordenar:</b>
                        <FormControl
                            id="order"
                            v-model="order"
                            class="w-48 mr-0 lg:mr-4 lg:mr-6 mb-2 lg:mb-0"
                            :options="selectOptionsOrder"
                            :icon="
                                order.value === 'DESC'
                                    ? mdiOrderNumericDescending
                                    : mdiOrderNumericAscending
                            "
                        />
                        <b class="my-auto mr-4">Filtrar:</b>
                        <FormControl
                            id="filter"
                            v-model="filter"
                            class="w-48"
                            :options="selectOptionsFilter"
                            :icon="mdiFilterMultiple"
                        />
                    </div>
                </div>
            </SectionTitleLine>
            <CardBox class="mb-6" has-table>
                <TableReviews
                    v-if="hasReviews"
                    :filter="filter.value"
                    :order="order.value"
                />
                <CardBoxComponentEmpty
                    v-else
                    message="Sem avaliações registadas..."
                />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
