<script setup>
import { mdiBullhorn, mdiFilePlus, mdiFilterMultiple } from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Sections/SectionMain.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";
import CardBoxComponentEmpty from "@/components/CardBoxs/CardBoxComponentEmpty.vue";
import TableComplaints from "@/components/Tables/TableComplaints.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import { onMounted, ref } from "vue";
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

const filter = ref(selectOptionsFilter[0]);

onMounted(async () => {
    hasComplaints.value = await complaintStore.getComplaints(0);
});
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLine :icon="mdiBullhorn" :title="'Reclamações'" main>
                <div class="flex">
                    <div class="flex mr-4 sm:mr-12">
                        <b class="my-auto mr-4">Filtrar:</b>
                        <FormControl
                            id="filter"
                            v-model="filter"
                            :options="selectOptionsFilter"
                            :icon="mdiFilterMultiple"
                        />
                    </div>
                    <BaseButtons class="mr-0 sm:mr-12">
                        <BaseButton
                            :icon="mdiFilePlus"
                            :to="{ name: 'complaintCreate' }"
                            label="Registar"
                            color="success"
                            rounded-full
                            small
                        />
                    </BaseButtons>
                </div>
            </SectionTitleLine>
            <CardBox class="mb-6" has-table>
                <TableComplaints v-if="hasComplaints" />
                <CardBoxComponentEmpty
                    v-else
                    message="Sem reclamações registadas..."
                />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
