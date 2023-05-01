<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { mdiEye, mdiClose, mdiCheck } from "@mdi/js";
import BaseLevel from "@/components/Bases/BaseLevel.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import PillTag from "@/components/PillTags/PillTag.vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const currentPage = ref(0);
const users = ref([]);
const numPages = computed(() => authStore.lastPage);
const currentPageHuman = computed(() => currentPage.value + 1);

watch(currentPageHuman, async () => {
    users.value = await authStore.getUsers(currentPage.value + 1);
});

onMounted(async () => {
    users.value = await authStore.getUsers(1);
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
                <th>Nome:</th>
                <th>Email:</th>
                <th>Tipo:</th>
                <th />
            </tr>
        </thead>
        <tbody>
            <tr v-for="user in users" v-bind:key="user.id">
                <td data-label="Id">
                    {{ user.id }}
                </td>
                <td data-label="Nome">
                   {{ user.name }}
                </td>
                <td data-label="Email">
                   {{ user.email }}
                </td>
                <td data-label="Tipo" class="text-center">
                    <PillTag
                        v-if="user.role == 'M'"
                        class="justify-center"
                        label="Gestor"
                        color="success"
                    />
                    <PillTag
                        v-else-if="user.role == 'C'"
                        class="justify-center"
                        label="Cliente"
                        color="info"
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
