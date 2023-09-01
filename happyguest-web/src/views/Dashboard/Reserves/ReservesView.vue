<script setup>
import {
    mdiReceiptClock,
    mdiOrderNumericDescending,
    mdiOrderNumericAscending,
    mdiFilterMultiple,
    mdiFilePlus,
    mdiMagnify,
} from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Sections/SectionMain.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";
import CardBoxComponentEmpty from "@/components/CardBoxs/CardBoxComponentEmpty.vue";
import TableReserves from "@/components/Tables/TableReserves.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import { ref, watchEffect, watch } from "vue";
import { useReserveStore } from "@/stores/reserve";

const reserveStore = useReserveStore();

const hasReserves = ref(true);

const selectOptionsFilter = [
    { value: "ALL", label: "Todas" },
    { value: "OR", label: "Restaurante" },
    { value: "O", label: "Outras" },
    { value: "P", label: "Pendentes" },
    { value: "A", label: "Aceites" },
    { value: "F", label: "Finalizadas" },
    { value: "R", label: "Rejeitadas" },
    { value: "C", label: "Canceladas" },
    { value: "D", label: "Eliminadas" },
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
    if (value.value != reserveStore.filterTable) {
        reserveStore.filterTable = value.value;
        hasReserves.value = true;
    }
});

watch(order, (value) => {
    if (value.value != reserveStore.orderTable) {
        reserveStore.orderTable = value.value;
    }
});

watchEffect(() => {
    if (reserveStore.filterTable) {
        filter.value = selectOptionsFilter.find(
            (option) => option.value === reserveStore.filterTable
        );
    }
});

watchEffect(() => {
    if (reserveStore.orderTable) {
        order.value = selectOptionsOrder.find(
            (option) => option.value === reserveStore.orderTable
        );
    }
});

watch(searchButton, (value) => {
    if (value) {
        hasReserves.value = true;
    }
});
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLine :icon="mdiReceiptClock" :title="'Reservas'" main>
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
                                :to="{ name: 'reserveRegister' }"
                                label="Registar"
                                class="mt-2 lg:mt-0"
                                color="success"
                                rounded-full
                                small
                            />
                        </BaseButtons>
                    </div>
                </div>
            </SectionTitleLine>
            <CardBox class="mb-6" has-table>
                <TableReserves
                    v-if="hasReserves"
                    :filter="filter.value"
                    :order="order.value"
                    :search="search"
                    :search-button="searchButton"
                    @update:not-empty="hasReserves = $event"
                    @button:search="searchButton = $event"
                />
                <CardBoxComponentEmpty
                    v-else
                    message="Sem reservas registadas..."
                />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
