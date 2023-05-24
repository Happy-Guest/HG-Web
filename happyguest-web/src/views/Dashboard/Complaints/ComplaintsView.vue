<script setup>
import {
    mdiBullhorn,
    mdiFilePlus,
    mdiFilterMultiple,
    mdiOrderNumericDescending,
    mdiOrderNumericAscending,
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
import { onMounted, ref, watch, watchEffect } from "vue";
import { useComplaintStore } from "@/stores/complaint";

const complaintStore = useComplaintStore();

const hasComplaints = ref(false);

const selectOptionsFilter = [
    { value: "ALL", label: "Todas" },
    { value: "P", label: "Pendentes" },
    { value: "S", label: "Resolvidas" },
    { value: "R", label: "Terminadas" },
    { value: "C", label: "Anuladas" },
];

const selectOptionsOrder = [
    { value: "DESC", label: "Descendente" },
    { value: "ASC", label: "Ascendente" },
];

const filter = ref(selectOptionsFilter[0]);
const order = ref(selectOptionsOrder[0]);

onMounted(async () => {
    hasComplaints.value = await complaintStore.getComplaints(
        0,
        null,
        filter.value.value
    );
});

watch(filter, async (value) => {
    if (value.value != complaintStore.filterTable) {
        hasComplaints.value = await complaintStore.getComplaints(
            0,
            null,
            value.value
        );
        setTimeout(() => {
            complaintStore.filterTable = value.value;
        }, 200);
    }
});

watch(order, (value) => {
    complaintStore.orderTable = value.value;
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
                            class="w-48 mr-0 lg:mr-4 lg:mr-6 mb-2 lg:mb-0"
                            :options="selectOptionsFilter"
                            :icon="mdiFilterMultiple"
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
                />
                <CardBoxComponentEmpty
                    v-else
                    message="Sem reclamações registadas..."
                />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
