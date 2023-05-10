<script setup>
import { mdiPlus, mdiBarcode } from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Sections/SectionMain.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";
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
const updated = ref(false);

const isModalActiveCreate = ref(false);

onMounted(() => {
    hasCodes.value = codeStore.getCodes(0);
});
</script>

<template>
    <LayoutAuthenticated>
        <CardBoxCode
            :active="isModalActiveCreate"
            @update:active="isModalActiveCreate = $event"
            @updated="updated = true"
        />
        <SectionMain>
            <SectionTitleLine :icon="mdiBarcode" :title="'Códigos'" main>
                <BaseButtons>
                    <BaseButton
                        :icon="mdiPlus"
                        label="Criar Código"
                        color="success"
                        rounded-full
                        small
                        @click="isModalActiveCreate = true"
                    />
                </BaseButtons>
            </SectionTitleLine>
            <CardBox class="mb-6" has-table>
                <TableCodes v-if="hasCodes" :updated="updated" />
                <CardBoxComponentEmpty
                    v-else
                    message="Sem códigos criados..."
                />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
