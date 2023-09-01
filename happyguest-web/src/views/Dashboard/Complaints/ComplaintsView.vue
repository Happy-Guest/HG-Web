<script setup>
import {
    mdiBullhorn,
    mdiFilePlus,
    mdiFilterMultiple,
    mdiOrderNumericDescending,
    mdiOrderNumericAscending,
    mdiMagnify,
} from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Sections/SectionMain.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";
import CardBoxComponentEmpty from "@/components/CardBoxs/CardBoxComponentEmpty.vue";
import TableComplaints from "@/components/Tables/TableComplaints.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import { ref, watch, watchEffect } from "vue";
import { useComplaintStore } from "@/stores/complaint";

const complaintStore = useComplaintStore();

const hasComplaints = ref(true);

const selectOptionsFilter = [
    { value: "ALL", label: "Todas" },
    { value: "P", label: "Pendentes" },
    { value: "S", label: "Resolvidas" },
    { value: "R", label: "Terminadas" },
    { value: "C", label: "Anuladas" },
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
    if (value.value != complaintStore.filterTable) {
        complaintStore.filterTable = value.value;
        hasComplaints.value = true;
    }
});

watch(order, (value) => {
    if (value.value != complaintStore.orderTable) {
        complaintStore.orderTable = value.value;
    }
});

watchEffect(() => {
    if (complaintStore.filterTable) {
        filter.value = selectOptionsFilter.find(
            (option) => option.value === complaintStore.filterTable
        );
    }
});

watchEffect(() => {
    if (complaintStore.orderTable) {
        order.value = selectOptionsOrder.find(
            (option) => option.value === complaintStore.orderTable
        );
    }
});

watch(searchButton, (value) => {
    if (value) {
        hasComplaints.value = true;
    }
});
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLine :icon="mdiBullhorn" :title="'Reclamações'" main>
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
                        <BaseButtons class="justify-center">
                            <BaseButton
                                :icon="mdiFilePlus"
                                :to="{ name: 'complaintCreate' }"
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
                <TableComplaints
                    v-if="hasComplaints"
                    :filter="filter.value"
                    :order="order.value"
                    :search="search"
                    :search-button="searchButton"
                    @update:not-empty="hasComplaints = $event"
                    @button:search="searchButton = $event"
                />
                <CardBoxComponentEmpty
                    v-else
                    message="Sem reclamações registadas..."
                />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
