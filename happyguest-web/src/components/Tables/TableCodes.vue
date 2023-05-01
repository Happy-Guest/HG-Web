<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { mdiEye, mdiClose, mdiCheck } from "@mdi/js";
import BaseLevel from "@/components/Bases/BaseLevel.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import PillTag from "@/components/PillTags/PillTag.vue";
import { useCodeStore } from "@/stores/code";

const codeStore = useCodeStore();

const currentPage = ref(0);
const codes = ref([]);
const numPages = computed(() => codeStore.lastPage);
const currentPageHuman = computed(() => currentPage.value + 1);

watch(currentPageHuman, async () => {
    codes.value = await codeStore.getCodes(currentPage.value + 1);
});

onMounted(async () => {
    codes.value = await codeStore.getCodes(1);
});

const pagesList = computed(() => {
    const pagesList = [];
    let num = [];
    let k = 0;
    for (let i = 0; i < numPages.value; i++) {
        if (k < 10) {
            num.push(i);
            k++;
        }
        if (k == 10 || i == numPages.value - 1) {
            pagesList.push(num);
            num = [];
            k = 0;
        }
    }
    return pagesList[parseInt(currentPage.value / 10)];
});
</script>

<template>
    <table class="w-full">
        <thead>
            <tr>
                <th>ID:</th>
                <th>Código:</th>
                <th>Quarto:</th>
                <th>Estado:</th>
                <th />
            </tr>
        </thead>
        <tbody>
            <tr v-for="code in codes" v-bind:key="code.id">
                <td data-label="Id">
                    {{ code.id }}
                </td>
                <td data-label="Código">
                   {{ code.code }}
                </td>
                <td data-label="Quarto">
                    <PillTag
                        class="justify-center"
                        :label="code.rooms"
                        color="contrast"
                        small
                    />
                </td>
                <td data-label="Estado" class="text-center">
                    <PillTag
                        v-if="code.used == '1'"
                        class="justify-center"
                        label="Utilizado"
                        color="success"
                        :icon="mdiCheck"
                    />
                    <PillTag
                        v-else
                        class="justify-center"
                        label="Não Utilizado"
                        color="danger"
                        :icon="mdiClose"
                    />
                </td>
                <td class="before:hidden lg:w-1 whitespace-nowrap">
                    <BaseButtons type="justify-start lg:justify-end" no-wrap>
                        <BaseButton color="info" :icon="mdiEye" small />
                    </BaseButtons>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
        <BaseLevel>
            <BaseButtons>
                <BaseButton
                    :label="'➤'"
                    class="font-bold rotate-180"
                    small
                    v-if="currentPage > 0"
                    @click="currentPage = 0"
                />
                <BaseButton
                    :label="'➜'"
                    class="font-bold rotate-180"
                    small
                    v-if="currentPage > 0"
                    @click="currentPage--"
                />
                <BaseButton
                    v-for="page in pagesList"
                    :key="page"
                    :active="page === currentPage"
                    :label="page + 1"
                    :color="page === currentPage ? 'lightDark' : 'whiteDark'"
                    small
                    @click="currentPage = page"
                />

                <BaseButton
                    :label="'➜'"
                    class="font-bold"
                    small
                    v-if="currentPage < numPages - 1"
                    @click="currentPage++"
                />
                <BaseButton
                    :label="'➤'"
                    class="font-bold"
                    small
                    v-if="currentPage < numPages - 1"
                    @click="currentPage = numPages - 1"
                />
            </BaseButtons>
            <small>Página {{ currentPageHuman }} de {{ numPages }}</small>
        </BaseLevel>
    </div>
</template>
