<script setup>
import { mdiBullhornVariant, mdiPlus } from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Sections/SectionMain.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";
import CardBoxComponentEmpty from "@/components/CardBoxs/CardBoxComponentEmpty.vue";
import TableComplaints from "@/components/Tables/TableComplaints.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import CardBoxComplaint from "@/components/CardBoxsCustom/CardBoxComplaint.vue";
import { onMounted, ref } from "vue";
import { useComplaintStore } from "@/stores/complaint";

const complaintStore = useComplaintStore();

const hasComplaints = ref(false);

const isModalActiveCreate = ref(false);

onMounted(() => {
    hasComplaints.value = complaintStore.getComplaints(0);
});
</script>

<template>
    <LayoutAuthenticated>
        <CardBoxComplaint
            :active="isModalActiveCreate"
            @update:active="isModalActiveCreate = $event"
        />
        <SectionMain>
            <SectionTitleLine
                :icon="mdiBullhornVariant"
                :title="'Reclamações'"
                main
            >
                <BaseButtons>
                    <BaseButton
                        :icon="mdiPlus"
                        label="Registar reclamação"
                        color="success"
                        rounded-full
                        small
                        @click="isModalActiveCreate = true"
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
