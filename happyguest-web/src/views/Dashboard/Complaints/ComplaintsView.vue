<script setup>
import { mdiBullhornVariant, mdiFilePlus } from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Sections/SectionMain.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";
import CardBoxComponentEmpty from "@/components/CardBoxs/CardBoxComponentEmpty.vue";
import TableComplaints from "@/components/Tables/TableComplaints.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import { onMounted, ref } from "vue";
import { useComplaintStore } from "@/stores/complaint";

const complaintStore = useComplaintStore();

const hasComplaints = ref(false);

onMounted(() => {
    hasComplaints.value = complaintStore.getComplaints(0);
});
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLine
                :icon="mdiBullhornVariant"
                :title="'Reclamações'"
                main
            >
                <BaseButtons>
                    <BaseButton
                        :icon="mdiFilePlus"
                        :to="{ name: 'complaintCreate' }"
                        label="Registar"
                        color="success"
                        rounded-full
                        small
                    />
                </BaseButtons>
            </SectionTitleLine>
            <CardBox class="mb-6" has-table>
                <TableComplaints v-if="hasComplaints" />
                <CardBoxComponentEmpty
                    v-else
                    message="Sem reclamações registados..."
                />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>