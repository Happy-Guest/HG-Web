<script setup>
import {
    mdiBookClock,
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
import TableOrders from "@/components/Tables/TableOrders.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import { ref, watchEffect, watch } from "vue";
import { useOrderStore } from "@/stores/order";

const orderStore = useOrderStore();

const hasOrders = ref(true);

const selectOptionsFilter = [
    { value: "ALL", label: "Todos" },
    { value: "OC", label: "Limpezas" },
    { value: "OB", label: "P. Objetos" },
    { value: "OF", label: "P. Alimentos" },
    { value: "O", label: "Outros" },
    { value: "P", label: "Pendentes" },
    { value: "R", label: "Rejeitados" },
    { value: "W", label: "A Preparar" },
    { value: "DL", label: "Entregues" },
    { value: "C", label: "Cancelados" },
    { value: "D", label: "Eliminados" },
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
    if (value.value != orderStore.filterTable) {
        orderStore.filterTable = value.value;
        hasOrders.value = true;
    }
});

watch(order, (value) => {
    if (value.value != orderStore.orderTable) {
        orderStore.orderTable = value.value;
    }
});

watchEffect(() => {
    if (orderStore.filterTable) {
        filter.value = selectOptionsFilter.find(
            (option) => option.value === orderStore.filterTable
        );
    }
});

watchEffect(() => {
    if (orderStore.orderTable) {
        order.value = selectOptionsOrder.find(
            (option) => option.value === orderStore.orderTable
        );
    }
});

watch(searchButton, (value) => {
    if (value) {
        hasOrders.value = true;
    }
});
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLine :icon="mdiBookClock" :title="'Pedidos'" main>
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
                                :to="{ name: 'orderRegister' }"
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
                <TableOrders
                    v-if="hasOrders"
                    :filter="filter.value"
                    :order-filter="order.value"
                    :search="search"
                    :search-button="searchButton"
                    @update:not-empty="hasOrders = $event"
                    @button:search="searchButton = $event"
                />
                <CardBoxComponentEmpty
                    v-else
                    message="Sem pedidos registados..."
                />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
