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
import CardBoxCode from "@/components/CardBoxsCustom/CardBoxCode.vue";
import { onMounted, ref } from "vue";
import { useCodeStore } from "@/stores/code";

const codeStore = useCodeStore();

const hasCodes = ref(false);

const isModalActiveCreate = ref(false);

onMounted(() => {
    hasCodes.value = codeStore.getCodes(0);
});


</script>

<template>
     <CardBoxCode
        :active="isModalActiveCreate"
        @update:active="isModalActiveCreate = $event"
    />
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLineWithButton
                :icon="mdiBarcode"
                :title="'Códigos'"
                @click="isModalActiveCreate = true;"
                main
            >
                <BaseButtons>
                    <BaseButton
                        :icon="mdiPlus"
                        label="Criar Código"
                        color="success"
                        rounded-full
                        small
                    />
                </BaseButtons>
            </SectionTitleLineWithButton>
            <CardBox class="mb-6" has-table>
                <TableCodes v-if="hasCodes" />
                <CardBoxComponentEmpty
                    v-else
                    message="Sem códigos registados..."
                />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
