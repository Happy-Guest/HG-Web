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
    mdiTrashCan,
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
import { useRouter } from "vue-router";

const router = useRouter();

const userStore = useUserStore();
const authStore = useAuthStore();

const users = ref([]);

const currentPage = ref(0);
const numPages = computed(() => userStore.lastPage);
const currentPageHuman = computed(() => currentPage.value + 1);

const userId = ref(null);
const userBlocked = ref(null);
const notifText = ref();

const isModalBlockActive = ref(false);
const isSuccessNotifActive = ref(false);
const isErrorNotifActive = ref(false);
const isModalDeleteActive = ref(false);

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

const blockUser = async () => {
    var response = await userStore.changeStateUser(
        userId.value,
        userBlocked.value
    );
    if (response.status == 200) {
        users.value = update(
            users.value,
            (row) => row.id === userId.value,
            !userBlocked.value
        );
        return true;
    } else return false;
};

const blockUnblockUser = async () => {
    if (await blockUser()) {
        if (userBlocked.value == 0)
            notifText.value = "Utilizador Bloqueado com sucesso!";
        else notifText.value = "Utilizador Desbloqueado com sucesso!";
        isSuccessNotifActive.value = true;
        setTimeout(function () {
            isSuccessNotifActive.value = false;
        }, 5000);
    } else {
        if (userBlocked.value == 0)
            notifText.value = "Erro ao Bloquear Utilizador!";
        else notifText.value = "Erro ao Ativar Utilizador!";
        isErrorNotifActive.value = true;
        setTimeout(function () {
            isErrorNotifActive.value = false;
        }, 5000);
    }
};
const resErrors = ref([]);

const submitDelete = (password) => {
    userStore
        .deleteUser(userId.value, password)
        .then((response) => {
            notifText.value = response.data.message;
            if (response.status === 200) {
                isModalDeleteActive.value = false;
                users.value = users.value.filter(
                    (user) => user.id != userId.value
                );
                isSuccessNotifActive.value = true;
                setTimeout(function () {
                    isSuccessNotifActive.value = false;
                }, 5000);
            } else {
                resErrors.value = response.data.errors;
            }
        })
        .catch(() => {
            notifText.value = "Ocorreu um erro ao remover o utilizador.";
            isErrorNotifActive.value = true;
            setTimeout(function () {
                isErrorNotifActive.value = false;
            }, 5000);
        });
};
</script>

<template>
    <NotificationBar
        v-if="isSuccessNotifActive"
        color="success"
        :icon="mdiCheckCircle"
        class="animate-bounce-slow -mb-1 mx-8"
    >
        <b>{{ notifText }}</b>
    </NotificationBar>
    <NotificationBar
        v-if="isErrorNotifActive"
        color="danger"
        :icon="mdiAlertCircle"
        class="animate-bounce-slow -mb-1 mx-8"
    >
        <b>{{ notifText }}</b>
    </NotificationBar>
    <CardBoxModal
        v-model="isModalBlockActive"
        :title="userBlocked == 0 ? 'Bloquear Utilizador' : 'Ativar Utilizador'"
        button-label="Confirmar"
        :icon-title="userBlocked == 0 ? mdiLock : mdiAccountCheck"
        :button="userBlocked == 0 ? 'warning' : 'success'"
        has-cancel
        has-close
        @confirm="blockUnblockUser()"
    >
        <p>
            Tem a certeza que
            <b>deseja {{ userBlocked == 0 ? "bloquear " : "ativar" }}</b> o
            utilizador selecionado?
        </p>
    </CardBoxModal>
    <CardBoxModal
        v-model="isModalDeleteActive"
        :errors="resErrors"
        title="Remover Utilizador"
        button="danger"
        :icon-title="mdiTrashCan"
        has-cancel
        has-close
        has-password
        @confirm="submitDelete"
    >
        <p>Tem a certeza que <b>deseja remover</b> o utilizador?</p>
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
                        label="Admin"
                        class="justify-center"
                        color="warning"
                        :icon="mdiCrown"
                    />
                    <PillTag
                        v-else-if="user.role === 'M'"
                        label="Gestor"
                        class="justify-center"
                        color="info"
                        :icon="mdiAccountTie"
                    />
                    <PillTag
                        v-else-if="user.role === 'C'"
                        label="Cliente"
                        class="justify-center"
                        color="contrast"
                        :icon="mdiBriefcaseAccount"
                    />
                    <PillTag
                        v-else
                        label="Outro"
                        class="justify-center"
                        color="info"
                        :icon="mdiAccountHardHat"
                    />
                </td>
                <td data-label="Estado" class="whitespace-nowrap text-center">
                    <PillTag
                        v-if="user.blocked == 1"
                        label="Bloqueado"
                        color="danger"
                        :icon="mdiLock"
                        class="justify-center"
                    />
                    <PillTag
                        v-else
                        label="Ativo"
                        color="success"
                        class="justify-center"
                        :icon="mdiCheckAll"
                    />
                </td>
                <td class="before:hidden lg:w-1 whitespace-nowrap">
                    <BaseButtons type="justify-start lg:justify-end" no-wrap>
                        <BaseButton
                            color="info"
                            title="Ver Perfil"
                            :icon="mdiEye"
                            small
                            @click="
                                user.id == authStore.userId
                                    ? router.push({ name: 'profile' })
                                    : router.push({
                                          name: 'profileUser',
                                          params: { id: user.id },
                                      })
                            "
                        />
                        <BaseButton
                            v-if="user.blocked == 0"
                            color="warning"
                            title="Bloquear"
                            :icon="
                                user.id == authStore.userId ||
                                user.role == 'A' ||
                                (user.role == 'M' &&
                                    authStore.user?.role == 'M')
                                    ? mdiCancel
                                    : mdiLock
                            "
                            small
                            :disabled="
                                user.id == authStore.userId ||
                                user.role == 'A' ||
                                (user.role == 'M' &&
                                    authStore.user?.role == 'M')
                            "
                            @click="
                                isModalBlockActive = true;
                                userId = user.id;
                                userBlocked = user.blocked;
                            "
                        />
                        <BaseButton
                            v-else-if="user.blocked == 1 && user.role != 'A'"
                            color="success"
                            title="Ativar"
                            :icon="
                                user.id == authStore.userId ||
                                user.role == 'A' ||
                                (user.role == 'M' &&
                                    authStore.user?.role == 'M')
                                    ? mdiCancel
                                    : mdiAccountCheck
                            "
                            small
                            :disabled="
                                user.id == authStore.userId ||
                                user.role == 'A' ||
                                (user.role == 'M' &&
                                    authStore.user?.role == 'M')
                            "
                            @click="
                                isModalBlockActive = true;
                                userId = user.id;
                                userBlocked = user.blocked;
                            "
                        />
                        <BaseButton
                            color="danger"
                            title="Remover"
                            :icon="
                                user.role == 'A' ||
                                user.id == authStore.userId ||
                                (user.role == 'M' &&
                                    authStore.user?.role == 'M')
                                    ? mdiCancel
                                    : mdiTrashCan
                            "
                            small
                            :disabled="
                                user.role == 'A' ||
                                user.id == authStore.userId ||
                                (user.role == 'M' &&
                                    authStore.user?.role == 'M')
                            "
                            @click="
                                isModalDeleteActive = true;
                                userId = user.id;
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
