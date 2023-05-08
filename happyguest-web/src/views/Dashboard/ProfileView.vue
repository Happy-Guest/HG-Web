<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
    mdiAccount,
    mdiClipboardAccount,
    mdiEmail,
    mdiAsterisk,
    mdiFormTextboxPassword,
    mdiLockCheck,
    mdiLockReset,
    mdiCellphone,
    mdiCheckAll,
    mdiLock,
    mdiTrashCan,
    mdiContentSaveCheck,
    mdiAccountGroup,
} from "@mdi/js";
import SectionMain from "@/components/Sections/SectionMain.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import BaseDivider from "@/components/Bases/BaseDivider.vue";
import FormField from "@/components/Forms/FormField.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import UserCard from "@/components/Users/UserCard.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";
import NotificationBarInCard from "@/components/Others/NotificationBarInCard.vue";
import CardBoxModal from "@/components/CardBoxs/CardBoxModal.vue";
import FormValidationErrors from "@/components/Forms/FormValidationErrors.vue";
import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";

const router = useRouter();

const authStore = useAuthStore();
const userStore = useUserStore();

const user = ref(authStore.user);
const account = ref(false);

const statusPassword = ref(null);
const statusProfile = ref(null);

const resMessage = ref("");
const resErrors = ref([]);

const isModalDeleteActive = ref(false);
const isModalBlockActive = ref(false);
const isModalUnblockActive = ref(false);

const profileForm = ref({
    name: user.value.name,
    email: user.value.email,
    phone: user.value.phone ?? "",
});

const passwordForm = ref({
    old_password: "",
    new_password: "",
    new_password_confirmation: "",
});

const clearProfileFields = () => {
    profileForm.value.name = user.value.name;
    profileForm.value.email = user.value.email;
    profileForm.value.phone = user.value.phone ?? "";
};

async function loadUser() {
    await authStore.loadUser();
    user.value = authStore.user;
}

const submitProfile = () => {
    statusPassword.value = null;
    statusProfile.value = null;
    userStore
        .updateUser(user.value.id, profileForm.value)
        .then((response) => {
            resMessage.value = response.data.message;
            if (response.status === 200) {
                statusProfile.value = true;
                loadUser();
                setTimeout(function () {
                    statusProfile.value = null;
                }, 5000);
            } else {
                statusProfile.value = false;
                resErrors.value = response.data.errors;
            }
        })
        .catch(() => {
            statusProfile.value = false;
            resMessage.value = "Ocorreu um erro ao atualizar o perfil.";
        });
};

const submitPassword = () => {
    statusProfile.value = null;
    statusPassword.value = null;
    authStore
        .changePassword(passwordForm.value)
        .then((response) => {
            resMessage.value = response.data.message;
            if (response.status === 200) {
                statusPassword.value = true;
                setTimeout(function () {
                    statusPassword.value = null;
                }, 5000);
            } else {
                statusPassword.value = false;
                resErrors.value = response.data.errors;
            }
        })
        .catch(() => {
            statusPassword.value = false;
            resMessage.value = "Ocorreu um erro ao atualizar a palavra-passe.";
        });
};

async function submitLogout() {
    if (await authStore.logout()) {
        router.push({ name: "login" });
    }
}

const submitDelete = (password) => {
    userStore
        .deleteUser(user.value.id, password)
        .then((response) => {
            resMessage.value = response.data.message;
            if (response.status === 200) {
                if (account.value) {
                    router.push({ name: "users" });
                } else {
                    submitLogout();
                }
            } else {
                resErrors.value = response.data.errors;
            }
        })
        .catch(() => {
            resMessage.value = "Ocorreu um erro ao remover a conta.";
        });
};

const submitChangeState = (password) => {
    //
};
</script>

<template>
    <LayoutAuthenticated>
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
            <p>Tem a certeza que <b>deseja remover</b> a conta?</p>
            <p v-if="!account">A sua sessão <b>será terminada</b>.</p>
        </CardBoxModal>
        <CardBoxModal
            v-model="isModalBlockActive"
            title="Bloquear Utilizador"
            button="warning"
            :icon-title="mdiLock"
            has-cancel
            has-close
            has-password
            @confirm="submitChangeState"
        >
            <p>Tem a certeza que <b>deseja bloquear</b> a conta?</p>
        </CardBoxModal>
        <CardBoxModal
            v-model="isModalUnblockActive"
            title="Ativar Utilizador"
            button="success"
            :icon-title="mdiCheckAll"
            has-cancel
            has-close
            has-password
            @confirm="submitChangeState"
        >
            <p>Tem a certeza que <b>deseja ativar</b> a conta?</p>
        </CardBoxModal>
        <SectionMain>
            <SectionTitleLine
                :icon="account ? mdiAccountGroup : mdiClipboardAccount"
                :title="account ? 'Perfil ➯ ' + user.id : 'O Meu Perfil'"
                main
            >
                <BaseButtons no-margin>
                    <BaseButton
                        v-if="account && user?.blocked === 1"
                        :icon="mdiCheckAll"
                        label="Ativar"
                        color="success"
                        rounded-full
                        small
                        @click="isModalUnblockActive = true"
                    />
                    <BaseButton
                        v-else-if="account && user?.blocked === 0"
                        :icon="mdiLock"
                        label="Bloquear"
                        color="warning"
                        rounded-full
                        small
                        @click="isModalBlockActive = true"
                    />
                    <BaseButton
                        v-if="!account || account.type != 'A'"
                        :icon="mdiTrashCan"
                        label="Remover"
                        color="danger"
                        rounded-full
                        small
                        @click="isModalDeleteActive = true"
                    />
                </BaseButtons>
            </SectionTitleLine>

            <UserCard
                class="mb-6"
                :user-name="user.name"
                :user-role="user.role"
                :user-blocked="user.blocked === 1"
                :current-user="account ? false : true"
                :user-avatar="user.photo_url"
            />

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CardBox
                    is-form
                    class="my-auto"
                    @submit.prevent="submitProfile"
                >
                    <FormValidationErrors
                        v-if="statusProfile === false"
                        :errors="resErrors"
                    />
                    <Transition name="fade">
                        <NotificationBarInCard
                            v-if="statusProfile"
                            color="success"
                        >
                            <b>{{ resMessage }}</b>
                        </NotificationBarInCard>
                    </Transition>
                    <FormField label="Nome" help="O seu nome. Obrigatório">
                        <FormControl
                            v-model="profileForm.name"
                            :icon="mdiAccount"
                            name="username"
                            required
                            autocomplete="username"
                        />
                    </FormField>

                    <FormField label="Email" help="O seu e-mail. Obrigatório">
                        <FormControl
                            v-model="profileForm.email"
                            :icon="mdiEmail"
                            type="email"
                            name="email"
                            required
                            autocomplete="email"
                        />
                    </FormField>

                    <BaseDivider />

                    <FormField
                        label="Nº Telefone"
                        help="O seu número de telefone. Opcional"
                    >
                        <FormControl
                            v-model="profileForm.phone"
                            :icon="mdiCellphone"
                            type="number"
                            name="phone"
                            maxlength="1"
                            autocomplete="phone"
                            :placeholder="
                                profileForm.phone.length === 0
                                    ? 'Não definido'
                                    : ''
                            "
                        />
                    </FormField>

                    <template #footer>
                        <BaseButtons>
                            <BaseButton
                                type="submit"
                                color="success"
                                label="Atualizar"
                                :icon="mdiContentSaveCheck"
                            />
                            <BaseButton
                                color="info"
                                label="Repor"
                                outline
                                :icon="mdiLockReset"
                                @click="clearProfileFields"
                            />
                        </BaseButtons>
                    </template>
                </CardBox>

                <CardBox
                    is-form
                    class="my-auto"
                    @submit.prevent="submitPassword"
                >
                    <FormValidationErrors
                        v-if="statusPassword === false"
                        :errors="resErrors"
                    />
                    <Transition name="fade">
                        <NotificationBarInCard
                            v-if="statusPassword"
                            color="success"
                        >
                            <b>{{ resMessage }}</b>
                        </NotificationBarInCard>
                    </Transition>

                    <FormField
                        label="Palavra-passe Atual"
                        help="A sua palavra-passe atual. Obrigatório"
                    >
                        <FormControl
                            v-model="passwordForm.old_password"
                            :icon="mdiAsterisk"
                            name="old_password"
                            type="password"
                            required
                            autocomplete="current-password"
                        />
                    </FormField>

                    <BaseDivider />

                    <FormField
                        label="Nova Palavra-passe"
                        help="A sua nova palavra-passe. Deve conter pelo menos 8 caracteres. Obrigatório"
                    >
                        <FormControl
                            v-model="passwordForm.new_password"
                            :icon="mdiFormTextboxPassword"
                            name="new_password"
                            type="password"
                            required
                            autocomplete="new-password"
                        />
                    </FormField>

                    <FormField
                        label="Confirmar Palavra-passe"
                        help="Confirme a sua nova palavra-passe. Obrigatório"
                    >
                        <FormControl
                            v-model="passwordForm.new_password_confirmation"
                            :icon="mdiFormTextboxPassword"
                            name="new_password_confirmation"
                            type="password"
                            required
                            autocomplete="new-password"
                        />
                    </FormField>

                    <template #footer>
                        <BaseButtons>
                            <BaseButton
                                type="submit"
                                color="success"
                                label="Alterar"
                                :icon="mdiLockCheck"
                            />
                            <BaseButton
                                color="info"
                                label="Limpar"
                                outline
                                :icon="mdiLockReset"
                                @click="
                                    passwordForm.old_password = '';
                                    passwordForm.new_password = '';
                                    passwordForm.new_password_confirmation = '';
                                "
                            />
                        </BaseButtons>
                    </template>
                </CardBox>
            </div>
        </SectionMain>
    </LayoutAuthenticated>
</template>

<style>
.fade-leave-active {
    transition: all 1s ease;
}
.fade-leave-to {
    opacity: 0;
}
</style>
