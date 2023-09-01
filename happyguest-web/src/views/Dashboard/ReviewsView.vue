<script setup>
import {
    mdiStarShooting,
    mdiFilterMultiple,
    mdiOrderNumericDescending,
    mdiOrderNumericAscending,
    mdiFilePlus,
    mdiMagnify,
} from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Sections/SectionMain.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";
import CardBoxComponentEmpty from "@/components/CardBoxs/CardBoxComponentEmpty.vue";
import TableReviews from "@/components/Tables/TableReviews.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import CardBoxRegisterReview from "@/components/CardBoxsCustom/CardBoxRegisterReview.vue";
import { ref, watch, watchEffect } from "vue";
import { useReviewStore } from "@/stores/review";

const reviewStore = useReviewStore();

const hasReviews = ref(true);
const newReview = ref(null);
const isModalActiveCreate = ref(false);

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
const search = ref("");
const searchButton = ref(false);

watch(filter, async (value) => {
    if (value.value != reviewStore.filterTable) {
        reviewStore.filterTable = value.value;
        hasReviews.value = true;
    }
});

watch(order, async (value) => {
    if (value.value != reviewStore.orderTable) {
        reviewStore.orderTable = value.value;
    }
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

watch(searchButton, (value) => {
    if (value) {
        hasReviews.value = true;
    }
});
</script>

<template>
    <LayoutAuthenticated>
        <CardBoxRegisterReview
            :active="isModalActiveCreate"
            @update:active="isModalActiveCreate = $event"
            @updated="newReview = $event"
        />
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
                            class="w-44 mr-0 lg:mr-4 mb-2 lg:mb-0"
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
                            class="w-44 mr-0 lg:mr-4 mb-2 lg:mb-0"
                            :options="selectOptionsFilter"
                            :icon="mdiFilterMultiple"
                        />
                        <div class="flex justify-center">
                            <FormControl
                                id="search"
                                v-model="search"
                                class="w-36 mr-0 lg:mr-4 mb-2 lg:mb-0"
                                title="Pesquise por Nome do Cliente"
                                :icon="mdiMagnify"
                                :placeholder="'Pesquisar'"
                                @keyup.enter="searchButton = true"
                                @focusout="searchButton = true"
                            />
                        </div>
                        <BaseButtons class="justify-center">
                            <BaseButton
                                :icon="mdiFilePlus"
                                label="Registar"
                                class="mt-2 lg:mt-0"
                                color="success"
                                rounded-full
                                small
                                @click="isModalActiveCreate = true"
                            />
                        </BaseButtons>
                    </div>
                </div>
            </SectionTitleLine>
            <CardBox class="mb-6" has-table>
                <TableReviews
                    v-if="hasReviews"
                    :new-review="newReview"
                    :filter="filter.value"
                    :order="order.value"
                    :search="search"
                    :search-button="searchButton"
                    @update:not-empty="hasReviews = $event"
                    @button:search="searchButton = $event"
                />
                <CardBoxComponentEmpty
                    v-else
                    message="Sem avaliações registadas..."
                />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
