<script setup>
import {
    mdiReceiptClock,
    mdiOrderNumericDescending,
    mdiOrderNumericAscending,
    mdiFilterMultiple,
} from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Sections/SectionMain.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";
import CardBoxComponentEmpty from "@/components/CardBoxs/CardBoxComponentEmpty.vue";
import TableOrders from "@/components/Tables/TableOrders.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import { onMounted, ref, watchEffect, watch } from "vue";
import { useOrderStore } from "@/stores/order";

const orderStore = useOrderStore();

const hasorders = ref(false);

const selectOptionsFilter = [
    { value: "ALL", label: "Todos" },
    { value: "P", label: "Pendentes" },
    { value: "R", label: "Rejeitados" },
    { value: "W", label: "A Preparar" },
    { value: "DL", label: "Entregues" },
    { value: "C", label: "Cancelados" },
    { value: "D", label: "Apagados" },
];

const selectOptionsOrder = [
    { value: "DESC", label: "Descendente" },
    { value: "ASC", label: "Ascendente" },
];

const filter = ref(selectOptionsFilter[0]);
const order = ref(selectOptionsOrder[0]);

onMounted(async () => {
    hasorders.value = await orderStore.getOrders(0, filter.value.value);
});

watch(filter, async (value) => {
    if (value.value != orderStore.filterTable) {
        hasorders.value = await orderStore.getOrders(0, value.value);
        setTimeout(() => {
            orderStore.filterTable = value.value;
        }, 200);
    }
});

watch(order, (value) => {
    orderStore.orderTable = value.value;
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
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLine :icon="mdiReceiptClock" :title="'Pedidos'" main>
                <div class="flex mr-0 sm:mr-12 lg:mr-8">
                    <div class="flex flex-col lg:flex-row">
                        <b class="my-auto mr-4">Ordenar:</b>
                        <FormControl
                            id="order"
                            v-model="order"
                            class="w-48 mr-0 lg:mr-4 mb-2 lg:mb-0"
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
                            class="w-48 mr-0 lg:mr-4 mb-2 lg:mb-0"
                            :options="selectOptionsFilter"
                            :icon="mdiFilterMultiple"
                        />
                    </div>
                </div>
            </SectionTitleLine>
            <CardBox class="mb-6" has-table>
                <TableOrders
                    v-if="hasorders"
                    :filter="filter.value"
                    :order-filter="order.value"
                />
                <CardBoxComponentEmpty
                    v-else
                    message="Sem pedidos registados..."
                />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
