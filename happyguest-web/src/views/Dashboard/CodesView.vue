<script setup>
import {
    mdiPlusBoxMultiple,
    mdiBarcode,
    mdiFilterMultiple,
    mdiOrderNumericDescending,
    mdiOrderNumericAscending,
    mdiMagnify,
} from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Sections/SectionMain.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import CardBoxComponentEmpty from "@/components/CardBoxs/CardBoxComponentEmpty.vue";
import TableCodes from "@/components/Tables/TableCodes.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import CardBoxCode from "@/components/CardBoxsCustom/CardBoxCode.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import { ref, watch, watchEffect } from "vue";
import { useCodeStore } from "@/stores/code";

const codeStore = useCodeStore();

const hasCodes = ref(true);
const newCode = ref(null);

const isModalActiveCreate = ref(false);

const selectOptionsFilter = [
    { value: "ALL", label: "Todos" },
    { value: "V", label: "Válidos" },
    { value: "E", label: "Expirados" },
    { value: "C", label: "Check-Out" },
    { value: "IC", label: "Em Check-Out" },
    { value: "NC", label: "Sem Check-Out" },
    { value: "U", label: "Utilizados" },
    { value: "NU", label: "Inutilizados" },
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

watch(filter, (value) => {
    if (value.value != codeStore.filterTable) {
        codeStore.filterTable = value.value;
        hasCodes.value = true;
    }
});

watch(order, (value) => {
    if (value.value != codeStore.orderTable) {
        codeStore.orderTable = value.value;
    }
});

watchEffect(() => {
    if (codeStore.filterTable) {
        filter.value = selectOptionsFilter.find(
            (option) => option.value === codeStore.filterTable
        );
    }
});

watchEffect(() => {
    if (codeStore.orderTable) {
        order.value = selectOptionsOrder.find(
            (option) => option.value === codeStore.orderTable
        );
    }
});

watch(searchButton, (value) => {
    if (value) {
        hasCodes.value = true;
    }
});
</script>

<template>
    <LayoutAuthenticated>
        <CardBoxCode
            :active="isModalActiveCreate"
            @update:active="isModalActiveCreate = $event"
            @updated="newCode = $event"
        />
        <SectionMain>
            <SectionTitleLine :icon="mdiBarcode" :title="'Códigos'" main>
                <div class="flex mr-0 sm:mr-12 lg:mr-8">
                    <div class="flex flex-col lg:flex-row">
                        <b class="my-auto mr-4">Ordenar:</b>
                        <FormControl
                            id="order"
                            v-model="order"
                            class="w-44 mr-0 lg:mr-6 mb-2 lg:mb-0"
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
                                title="Pesquise por Código"
                                :icon="mdiMagnify"
                                :placeholder="'Pesquisar'"
                                @keyup.enter="searchButton = true"
                                @focusout="searchButton = true"
                            />
                        </div>
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
                <TableCodes
                    v-if="hasCodes"
                    :new-code="newCode"
                    :filter="filter.value"
                    :order="order.value"
                    :search="search"
                    :search-button="searchButton"
                    @update:not-empty="hasCodes = $event"
                    @button:search="searchButton = $event"
                />
                <CardBoxComponentEmpty
                    v-else
                    message="Sem códigos criados..."
                />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
