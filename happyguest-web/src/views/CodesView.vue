<script setup>
import { mdiPlus, mdiBarcode } from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Sections/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/Sections/SectionTitleLineWithButton.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import CardBoxComponentEmpty from "@/components/CardBoxs/CardBoxComponentEmpty.vue";
import TableCodes from "@/components/Tables/TableCodes.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import { onMounted, ref, onUpdated } from "vue";
import { useCodeStore } from "@/stores/code";

const codeStore = useCodeStore();

const hasCodes = ref(false);


const checkCodes = async () => {
    setTimeout(async function () {
        hasCodes.value = await codeStore.getCodes(
            0
        );
    }, 700);
};

onMounted(() => {
    checkCodes();
});

onUpdated(() => {
    checkCodes();
});
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLineWithButton
                :icon="mdiBarcode"
                :title="
                    'Códigos'"
                main
            >
                <BaseButtons>
                    <BaseButton
                       
                        :icon="mdiPlus"
                        label="Associar Código"
                        color="success"
                        rounded-full
                        small
                    />
                </BaseButtons>
            </SectionTitleLineWithButton>
            <CardBox class="mb-6" has-table>
                <TableCodes
                    v-if="hasCodes"
                />
                <CardBoxComponentEmpty
                    message="Sem códigos registados..."
                    v-else
                />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
