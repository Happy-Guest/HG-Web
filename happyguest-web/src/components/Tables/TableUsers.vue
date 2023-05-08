<script setup>
import { computed, ref, watch, onMounted } from "vue";
import {
    mdiEye,
    mdiCrown,
    mdiAccountTie,
    mdiBriefcaseAccount,
    mdiAccountHardHat,
    mdiLock,
    mdiCheckAll,
    mdiCancel,
    mdiAccountCheck,
    mdiAlertCircle,
    mdiCheckCircle,
} from "@mdi/js";
import BaseLevel from "@/components/Bases/BaseLevel.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import PillTag from "@/components/PillTags/PillTag.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import CardBoxModal from "@/components/CardBoxs/CardBoxModal.vue";
import NotificationBar from "@/components/Others/NotificationBar.vue";
import { useUserStore } from "@/stores/user";
import { useAuthStore } from "@/stores/auth";

const userStore = useUserStore();
const authStore = useAuthStore();

const currentPage = ref(0);
const users = ref([]);
const numPages = computed(() => userStore.lastPage);
const currentPageHuman = computed(() => currentPage.value + 1);
const isModalActive = ref(false);
const userIdSelect = ref(0);
const userInfo = ref([]);
const notifText = ref();
const isModalBlockActive = ref(false);
const isSuccessNotifActive = ref(false);
const isErrorNotifActive = ref(false);

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

const update = (arr, cb, blocked) => {
    arr.forEach((item) => {
        if (cb(item)) {
            item.blocked = blocked;
        }
    });

    return arr;
};

const blockUser = async (userInfo) => {
    var response = await userStore.blockUnblockUser(userInfo);
    if (response == true) {
        users.value = update(
            users.value,
            (row) => row.id === userInfo.id,
            !userInfo.blocked
        );
        return true;
    } else {
        return response;
    }
};

const blockUnBlockUser = async (userInfo) => {
    var response = await userStore.blockUnblockUser(userInfo);
    if (response == true) {
    }
    if (blockUser(userInfo)) {
        if (userInfo.blocked == 0)
            notifText.value = "Utilizador Bloqueado com sucesso!";
        else notifText.value = "Utilizador Desbloqueado com sucesso!";
        isSuccessNotifActive.value = true;
        setTimeout(function () {
            isSuccessNotifActive.value = false;
        }, 7000);
    } else {
        if (userInfo.blocked == 0)
            notifText.value = "Erro ao Bloquear utilizador!";
        else notifText.value = "Erro ao Desbloquear utilizador!";
        isErrorNotifActive.value = true;
        setTimeout(function () {
            isErrorNotifActive.value = false;
        }, 7000);
    }
};
</script>

<template>
    <NotificationBar
        v-if="isSuccessNotifActive"
        color="success"
        :icon="mdiCheckCircle"
        class="motion-safe:animate-bounce-slow -mb-2"
    >
        {{ notifText }}
    </NotificationBar>
    <NotificationBar
        v-if="isErrorNotifActive"
        color="danger"
        :icon="mdiAlertCircle"
        class="motion-safe:animate-bounce-slow -mb-2"
    >
        {{ notifText }}
    </NotificationBar>
    <CardBoxModal
        v-model="isModalBlockActive"
        :title="
            userInfo.blocked == 0
                ? 'Bloquear Utilizador'
                : 'Desbloquear Utilizador'
        "
        :button-label="userInfo.blocked == 0 ? 'Bloquear ' : 'Desbloquear'"
        :icon="mdiLock"
        button="info"
        has-cancel
        has-close
        @confirm="blockUnBlockUser(userInfo)"
    >
        <p>
            Tem a certeza que deseja
            <b>{{ userInfo.blocked == 0 ? "bloquear " : "desbloquear" }}</b> o
            utilizador selecionado?
        </p>
    </CardBoxModal>
    <table class="w-full">
        <thead>
            <tr>
                <th />
                <th>ID:</th>
                <th>Nome:</th>
                <th>Email:</th>
                <th>Tipo:</th>
                <th>Estado:</th>
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
                        class="w-40 justify-center"
                        color="warning"
                        :icon="mdiCrown"
                    />
                    <PillTag
                        v-else-if="user.role === 'M'"
                        label="Gestor"
                        class="w-40 justify-center"
                        color="info"
                        :icon="mdiAccountTie"
                    />
                    <PillTag
                        v-else-if="user.role === 'C'"
                        label="Cliente"
                        class="w-40 justify-center"
                        color="contrast"
                        :icon="mdiBriefcaseAccount"
                    />
                    <PillTag
                        v-else
                        label="Outro"
                        class="w-40 justify-center"
                        color="info"
                        :icon="mdiAccountHardHat"
                    />
                </td>
                <td
                    data-label="Estado"
                    class="lg:w-4 whitespace-nowrap text-center"
                >
                    <PillTag
                        v-if="user.blocked == 1"
                        label="Bloqueado"
                        color="danger"
                        :icon="mdiLock"
                        class="w-28 justify-center"
                        small
                    />
                    <PillTag
                        v-else
                        label="Ativo"
                        color="success"
                        class="w-28 justify-center"
                        :icon="mdiCheckAll"
                        small
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
                        <BaseButton v-if="user.blocked == 0" color="warning"
                        :icon=" user.id == authStore.userId ||
                        (authStore.user.role == 'M' && user.role == 'A') ?
                        mdiCancel : mdiLock " small :disabled="user.id ==
                        authStore.userId || (authStore.user.role == 'M' &&
                        user.role == 'A')" " @click=" isModalBlockActive = true;
                        userInfo = user; " />
                        <BaseButton
                            v-else-if="user.blocked == 1"
                            color="info"
                            :icon="
                                user.id == authStore.userId ||
                                (authStore.user.role == 'M' && user.role == 'A')
                                    ? mdiCancel
                                    : mdiAccountCheck
                            "
                            small
                            :disabled="
                                user.id == authStore.userId ||
                                (authStore.user.role == 'M' && user.role == 'A')
                            "
                            @click="
                                isModalBlockActive = true;
                                userInfo = user;
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