<script setup>
import {
    mdiBookOpenPageVariant,
    mdiOrderNumericDescending,
    mdiOrderNumericAscending,
    mdiFilterMultiple,
    mdiPlusBoxMultiple,
} from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Sections/SectionMain.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";
import CardBoxComponentEmpty from "@/components/CardBoxs/CardBoxComponentEmpty.vue";
import TableItems from "@/components/Tables/TableItems.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import { onMounted, ref, watchEffect, watch } from "vue";
import { useItemStore } from "@/stores/item";

const itemStore = useItemStore();

const hasitems = ref(false);
//const newItem = ref(null);

const isModalActiveCreate = ref(false);

const selectOptionsFilter = [
    { value: "ALL", label: "Todos" },
    { value: "O", label: "Objetos" },
    { value: "F", label: "Alimentos" },
    { value: "room", label: "Quarto" },
    { value: "bathroom", label: "Casa Banho" },
    { value: "drink", label: "Bebidas" },
    { value: "breakfast", label: "P. Almoço" },
    { value: "lunch", label: "Almoço" },
    { value: "dinner", label: "Jantar" },
    { value: "snack", label: "Lanches" },
    { value: "other", label: "Outros" },
    { value: "D", label: "Apagados" },
];

const selectOptionsOrder = [
    { value: "DESC", label: "Descendente" },
    { value: "ASC", label: "Ascendente" },
];

const filter = ref(selectOptionsFilter[0]);
const order = ref(selectOptionsOrder[0]);

onMounted(async () => {
    hasitems.value = await itemStore.getItems(0, filter.value.value);
});

watch(filter, async (value) => {
    if (value.value != itemStore.filterTable) {
        hasitems.value = await itemStore.getItems(0, value.value);
        setTimeout(() => {
            itemStore.filterTable = value.value;
        }, 200);
    }
});

watch(order, (value) => {
    itemStore.orderTable = value.value;
});

watchEffect(() => {
    if (itemStore.filterTable) {
        filter.value = selectOptionsFilter.find(
            (option) => option.value === itemStore.filterTable
        );
    }
});

watchEffect(() => {
    if (itemStore.orderTable) {
        order.value = selectOptionsOrder.find(
            (option) => option.value === itemStore.orderTable
        );
    }
});
</script>

<template>
    <LayoutAuthenticated>
        <!-- <CardBoxItem
            :active="isModalActiveCreate"
            @update:active="isModalActiveCreate = $event"
            @updated="newItem = $event"
        /> -->
        <SectionMain>
            <SectionTitleLine
                :icon="mdiBookOpenPageVariant"
                :title="'Menu de Pedidos'"
                main
            >
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
                        <BaseButtons class="justify-center">
                            <BaseButton
                                :icon="mdiPlusBoxMultiple"
                                label="Criar"
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
                <TableItems
                    v-if="hasitems"
                    :name-e-n="true"
                    :filter="filter.value"
                    :order="order.value"
                />
                <CardBoxComponentEmpty
                    v-else
                    message="Sem objetos registados..."
                />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
