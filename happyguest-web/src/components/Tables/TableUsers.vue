<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { mdiEye, mdiClose, mdiCheck } from "@mdi/js";
import BaseLevel from "@/components/Bases/BaseLevel.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import PillTag from "@/components/PillTags/PillTag.vue";
import CardBoxModal from "@/components/CardBoxs/CardBoxModal.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const currentPage = ref(0);
const users = ref([]);
const numPages = computed(() => authStore.lastPage);
const currentPageHuman = computed(() => currentPage.value + 1);
const isModalActive = ref(false);
const userIdSelect = ref(0);
const userInfo = ref([]);

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

watch(isModalActive, async () => {
    if(isModalActive.value) {
        userInfo.value = await authStore.loadUserById(userIdSelect.value);
    }
    else {
        userInfo.value = [];
    }
});
</script>

<template>
    
    <CardBoxModal
        has-close
        v-model="isModalActive"
        :title="`Utilizador - ` + userInfo.id"
    >
        <table>
            <tr>
                <td class="leading-loose">
                    <p>
                        <span class="font-bold">Nome:</span> {{ userInfo.name }}
                    </p>
                    <p>
                        <span class="font-bold">Email:</span>
                        {{ userInfo.email }}
                    </p>
                    <p>
                        <span class="font-bold">Telefone:</span>
                        {{ userInfo.phone }}
                    </p>
                    <p class="my-2">
                        <span class="font-bold mr-3">Tipo:</span>
                        <PillTag
                        v-if="userInfo.role == 'M'"
                        class="justify-center"
                        label="Gestor"
                        color="warning"
                    />
                    <PillTag
                        v-else-if="userInfo.role == 'C'"
                        class="justify-center"
                        label="Cliente"
                        color="info"
                    />
                    </p>
                    <p>
                        <span class="font-bold">Data Criação:</span>
                        {{ userInfo.created_at }}
                    </p>
                </td>
                <td class="flex items-center justify-center">
                    <UserAvatar
                        api="initials"
                        :avatar="userInfo.photo_url"
                        :username="userInfo.name"
                        class="w-12 h-12 mx-auto lg:w-36 lg:h-36"
                        table
                    />
                </td>
            </tr>
        </table>
    </CardBoxModal>
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
            <tr v-for="user in users" v-bind:key="user.id">
                <td class="border-b-0 lg:w-6 before:hidden">
                    <UserAvatar
                        api="initials"
                        avatar="https://api.dicebear.com/6.x/avataaars/svg?seed=Diogo"
                        :username="user.name"
                        class="w-24 h-24 mx-auto lg:w-6 lg:h-6"
                        minitable
                    />
                </td>
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
                        color="warning"
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
