<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { mdiRename, mdiClose, mdiCheck } from "@mdi/js";
import BaseLevel from "@/components/Bases/BaseLevel.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import PillTag from "@/components/PillTags/PillTag.vue";
import CardBoxCode from "@/components/CardBoxsCustom/CardBoxCode.vue";
import { useCodeStore } from "@/stores/code";

const codeStore = useCodeStore();

const currentPage = ref(0);
const codes = ref([]);
const numPages = computed(() => codeStore.lastPage);
const currentPageHuman = computed(() => currentPage.value + 1);

const isModalActive = ref(false);
const selected = ref(0);

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

const getDateString = (date) => {
    var dateString = new Date(date);
    return (
        (dateString.getDate() > 9
            ? dateString.getDate()
            : "0" + dateString.getDate()) +
        "/" +
        (dateString.getMonth() > 8
            ? dateString.getMonth() + 1
            : "0" + (dateString.getMonth() + 1)) +
        "/" +
        dateString.getFullYear()
    );
};
</script>

<template>
    <CardBoxCode
        :selected="selected"
        :active="isModalActive"
        @update:active="isModalActive = $event"
    />
    <table class="w-full">
        <thead>
            <tr>
                <th>ID:</th>
                <th>Código:</th>
                <th>Quarto(s):</th>
                <th>Entrada:</th>
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
                <td data-label="Quarto(s)">
                    <PillTag
                        class="justify-center"
                        :label="code.rooms"
                        color="contrast"
                        small
                    />
                </td>
                <td data-label="Código">
                   {{ getDateString(code.entry_date) }}
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
                <td
                    class="before:hidden lg:w-1 whitespace-nowrap place-content-center"
                >
                    <BaseButtons type="justify-start lg:justify-end" no-wrap>
                        <BaseButton
                            color="warning"
                            title="Editar"
                            :icon="mdiRename"
                            small
                            @click="isModalActive = true; selected = code.id;"
                        />
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
