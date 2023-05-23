<script setup>
import { mdiPlusBoxMultiple, mdiBarcode, mdiFilterMultiple } from "@mdi/js";
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
import { onMounted, ref } from "vue";
import { useCodeStore } from "@/stores/code";

const codeStore = useCodeStore();

const hasCodes = ref(false);
const newCode = ref(null);

const isModalActiveCreate = ref(false);

const selectOptionsFilter = [
    { value: "ALL", label: "Todos" },
    { value: "V", label: "Válidos" },
    { value: "E", label: "Expirados" },
    { value: "U", label: "Utilizados" },
    { value: "NU", label: "Inutilizados" },
];

const filter = ref(selectOptionsFilter[0]);

onMounted(async () => {
    hasCodes.value = await codeStore.getCodes(0);
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
                <div class="flex">
                    <div class="flex mr-4 sm:mr-12">
                        <b class="my-auto mr-4">Filtrar:</b>
                        <FormControl
                            id="filter"
                            v-model="filter"
                            class="w-40"
                            :options="selectOptionsFilter"
                            :icon="mdiFilterMultiple"
                        />
                    </div>
                    <BaseButtons class="mr-0 sm:mr-12">
                        <BaseButton
                            :icon="mdiPlusBoxMultiple"
                            label="Criar"
                            color="success"
                            rounded-full
                            small
                            @click="isModalActiveCreate = true"
                        />
                    </BaseButtons>
                </div>
            </SectionTitleLine>
            <CardBox class="mb-6" has-table>
                <TableCodes v-if="hasCodes" :new-code="newCode" />
                <CardBoxComponentEmpty
                    v-else
                    message="Sem códigos criados..."
                />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
