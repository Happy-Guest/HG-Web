<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { mdiEye, mdiCrown, mdiAccountTie, mdiBriefcaseAccount, mdiAccountHardHat} from "@mdi/js";
import BaseLevel from "@/components/Bases/BaseLevel.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import PillTag from "@/components/PillTags/PillTag.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

const currentPage = ref(0);
const users = ref([]);
const numPages = computed(() => userStore.lastPage);
const currentPageHuman = computed(() => currentPage.value + 1);
const isModalActive = ref(false);
const userIdSelect = ref(0);
const userInfo = ref([]);

watch(currentPageHuman, async () => {
    users.value = await userStore.getUsers(currentPage.value + 1);
});

onMounted(async () => {
    users.value = await userStore.getUsers(1);
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

watch(isModalActive, async () => {
    if (isModalActive.value) {
        userInfo.value = await userStore.loadUserById(userIdSelect.value);
    } else {
        userInfo.value = [];
    }
});
</script>

<template>
    <table class="w-full">
        <thead>
            <tr>
                <th />
                <th>ID:</th>
                <th>Nome:</th>
                <th>Email:</th>
                <th>Tipo:</th>
                <th />
            </tr>
        </thead>
        <tbody>
            <tr v-for="user in users" :key="user.id">
                <td class="border-b-0 lg:w-6 before:hidden">
                    <UserAvatar
                        :avatar="user.photo_url"
                        :username="user.name"
                        class="w-24 h-24 mx-auto lg:w-6 lg:h-6"
                    />
                </td>
                <td data-label="Id" class="text-center">
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
                        v-if="user.role === 'A'"
                        label="Administrador"
                        class="mr-4"
                        color="warning"
                        :icon="mdiCrown"
                    />
                    <PillTag
                        v-else-if="user.role === 'M'"
                        label="Gestor"
                        class="mr-4"
                        color="info"
                        :icon="mdiAccountTie"
                    />
                    <PillTag
                        v-else-if="user.role === 'C'"
                        label="Cliente"
                        class="mr-4"
                        color="contrast"
                        :icon="mdiBriefcaseAccount"
                    />
                    <PillTag
                        v-else
                        label="Outro"
                        class="mr-4"
                        color="info"
                        :icon="mdiAccountHardHat"
                    />
                </td>
                <td class="before:hidden lg:w-1 whitespace-nowrap">
                    <BaseButtons type="justify-start lg:justify-end" no-wrap>
                        <BaseButton
                            color="info"
                            :icon="mdiEye"
                            small
                            @click="
                                isModalActive = true;
                                userIdSelect = user.id;
                            "
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
                    v-if="currentPage > 0"
                    :label="'➤'"
                    class="font-bold rotate-180"
                    small
                    @click="currentPage = 0"
                />
                <BaseButton
                    v-if="currentPage > 0"
                    :label="'➜'"
                    class="font-bold rotate-180"
                    small
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
                    v-if="currentPage < numPages - 1"
                    :label="'➜'"
                    class="font-bold"
                    small
                    @click="currentPage++"
                />
                <BaseButton
                    v-if="currentPage < numPages - 1"
                    :label="'➤'"
                    class="font-bold"
                    small
                    @click="currentPage = numPages - 1"
                />
            </BaseButtons>
            <small>Página {{ currentPageHuman }} de {{ numPages }}</small>
        </BaseLevel>
    </div>
</template>
