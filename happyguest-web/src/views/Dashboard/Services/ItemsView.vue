<script setup>
import { mdiBookOpenPageVariant } from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Sections/SectionMain.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";
import CardBoxComponentEmpty from "@/components/CardBoxs/CardBoxComponentEmpty.vue";
import TableItems from "@/components/Tables/TableItems.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import { onMounted, ref } from "vue";
import { useItemStore } from "@/stores/item";

const itemStore = useItemStore();

const hasitems = ref(false);

/*
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

Const filter = ref(selectOptionsFilter[0]);
const order = ref(selectOptionsOrder[0]);
*/
onMounted(async () => {
    hasitems.value = await itemStore.getItems(0);
});

/*
watch(filter, async (value) => {
    if (value.value != itemStore.filterTable) {
        hasitems.value = await itemStore.getitems(0, value.value);
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
});*/
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLine
                :icon="mdiBookOpenPageVariant"
                :title="'Menu de Pedidos'"
                main
            >
                <!-- <div class="flex mr-0 sm:mr-12 lg:mr-8">
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
                            class="w-48"
                            :options="selectOptionsFilter"
                            :icon="mdiFilterMultiple"
                        />
                    </div>
                </div>-->
            </SectionTitleLine>
            <CardBox class="mb-6" has-table>
                <TableItems v-if="hasitems" :name-e-n="true" />
                <CardBoxComponentEmpty
                    v-else
                    message="Sem objetos registados..."
                />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
