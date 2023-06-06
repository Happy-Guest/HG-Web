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
    mdiCalendarRange,
    mdiCellphone,
    mdiMapMarker,
    mdiLock,
    mdiTrashCan,
    mdiContentSaveCheck,
    mdiAccountGroup,
    mdiAccountCheck,
    mdiBullhorn,
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
import FormFilePicker from "@/components/Forms/FormFilePicker.vue";
import TableComplaints from "@/components/Tables/TableComplaints.vue";
import CardBoxComponentEmpty from "@/components/CardBoxs/CardBoxComponentEmpty.vue";
import FormCheckRadio from "@/components/Forms/FormCheckRadio.vue";
import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";
import { useComplaintStore } from "@/stores/complaint";

const router = useRouter();

const authStore = useAuthStore();
const userStore = useUserStore();
const complaintStore = useComplaintStore();

const user = ref({});
const account = ref(false);
const hasComplaints = ref(false);
const seeComplaints = ref(false);

const profileForm = ref({
    name: user.value.name,
    email: user.value.email,
    phone: user.value.phone ?? "",
    address: user.value.address ?? "",
    birth_date: user.value.birth_date
        ? format(user.value.birth_date, false)
        : "",
    photo: null,
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
    profileForm.value.address = user.value.address ?? "";
    profileForm.value.birth_date = user.value.birth_date
        ? format(user.value.birth_date, false)
        : "";
};

defineUser();

async function getUser() {
    return await userStore.loadUserById(router.currentRoute.value.params.id);
}

const statusPassword = ref(null);
const statusProfile = ref(null);

const resMessage = ref("");
const resErrors = ref([]);

const isModalDeleteActive = ref(false);
const isModalBlockActive = ref(false);
const isModalUnblockActive = ref(false);

const submitProfile = () => {
    statusPassword.value = null;
    statusProfile.value = null;
    userStore
        .updateUser(user.value.id, {
            name: profileForm.value.name,
            email: profileForm.value.email,
            phone: profileForm.value.phone,
            address: profileForm.value.address,
            birth_date: format(profileForm.value.birth_date, true),
            photo: profileForm.value.photo,
        })
        .then((response) => {
            resMessage.value = response.data.message;
            if (response.status === 200) {
                statusProfile.value = true;
                user.value = response.data.user;
                if (!account.value) {
                    localStorage.setItem(
                        "user",
                        JSON.stringify(response.data.user)
                    );
                    authStore.user = response.data.user;
                }
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
            resMessage.value = "Ocorreu um erro ao remover o utilizador.";
        });
};

const submitChangeState = () => {
    statusProfile.value = null;
    userStore
        .changeStateUser(user.value.id, user.value.blocked)
        .then((response) => {
            resMessage.value = response.data.message;
            if (response.status === 200) {
                if (user.value.blocked === 1) {
                    user.value.blocked = 0;
                } else {
                    user.value.blocked = 1;
                }
            }
        })
        .catch(() => {
            statusProfile.value = false;
            resMessage.value =
                "Ocorreu um erro ao alterar o estado do utilizador.";
        });
};

function defineUser() {
    if (router.currentRoute.value.params.id) {
        account.value = true;
        if (authStore.user?.id == router.currentRoute.value.params.id) {
            router.push({ name: "profile" });
        }
        getUser().then(async (response) => {
            user.value = response;
            clearProfileFields();
            hasComplaints.value = await complaintStore.getComplaints(
                0,
                user.value.id
            );
        });
    } else {
        account.value = false;
        user.value = authStore.user;
        clearProfileFields();
    }
}

function format(date, api) {
    if (date) {
        var tzoffset = new Date().getTimezoneOffset() * 60000;
        var dateParts = null;
        var newDate = new Date();
        if (api) {
            dateParts = date.split("-");
            newDate = new Date(+dateParts[0], +dateParts[1] - 1, +dateParts[2]);
            return new Date(newDate - tzoffset)
                .toISOString()
                .slice(0, -1)
                .slice(0, 10)
                .replace(/-/g, "/");
        }
        dateParts = date.split("/");
        newDate = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
        return new Date(newDate - tzoffset)
            .toISOString()
            .slice(0, -1)
            .slice(0, 10);
    }
}
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
            <p>Tem a certeza que <b>deseja remover</b> o utilizador?</p>
            <p v-if="!account">A sua sessão <b>será terminada</b>.</p>
        </CardBoxModal>
        <CardBoxModal
            v-model="isModalBlockActive"
            title="Bloquear Utilizador"
            button="warning"
            :icon-title="mdiLock"
            has-cancel
            has-close
            @confirm="submitChangeState"
        >
            <p>Tem a certeza que <b>deseja bloquear</b> o utilizador?</p>
        </CardBoxModal>
        <CardBoxModal
            v-model="isModalUnblockActive"
            title="Ativar Utilizador"
            button="success"
            :icon-title="mdiAccountCheck"
            has-cancel
            has-close
            @confirm="submitChangeState"
        >
            <p>Tem a certeza que <b>deseja ativar</b> o utilizador?</p>
        </CardBoxModal>
        <SectionMain>
            <SectionTitleLine
                :icon="account ? mdiAccountGroup : mdiClipboardAccount"
                :title="
                    account ? 'Perfil ➯ ' + (user.id ?? 'Id') : 'O Meu Perfil'
                "
                main
            >
                <BaseButtons class="mr-0 sm:mr-8">
                    <BaseButton
                        v-if="
                            account &&
                            user.blocked == 1 &&
                            ((authStore.user?.role == 'M' &&
                                user.role == 'C') ||
                                authStore.user?.role == 'A')
                        "
                        :icon="mdiAccountCheck"
                        label="Ativar"
                        color="success"
                        rounded-full
                        small
                        @click="isModalUnblockActive = true"
                    />
                    <BaseButton
                        v-else-if="
                            account &&
                            user.blocked == 0 &&
                            ((authStore.user?.role == 'M' &&
                                user.role == 'C') ||
                                authStore.user?.role == 'A')
                        "
                        :icon="mdiLock"
                        label="Bloquear"
                        color="warning"
                        rounded-full
                        small
                        @click="isModalBlockActive = true"
                    />
                    <BaseButton
                        v-if="
                            user.id == authStore.user?.id ||
                            authStore.user?.role == 'A' ||
                            (authStore.user?.role == 'M' && user.role == 'C')
                        "
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
                :created="user.created_at"
                :updated="user.updated_at"
            />

            <div
                :class="!account ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : ''"
            >
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

                    <FormField flex>
                        <FormField
                            label="Nome"
                            :help="
                                account
                                    ? 'O nome do utilizador. Obrigatório'
                                    : 'O seu nome. Obrigatório'
                            "
                            class="mb-4 sm:mb-0 w-full sm:w-5/6"
                            label-for="name"
                            no-margin
                        >
                            <FormControl
                                id="name"
                                v-model="profileForm.name"
                                :icon="mdiAccount"
                                name="username"
                                autocomplete="name"
                                maxlength="255"
                                required
                                :disabled="
                                    user.id != authStore.user?.id &&
                                    authStore.user?.role == 'M' &&
                                    (user.role == 'A' || user.role == 'M')
                                "
                            />
                        </FormField>
                        <div class="w-full sm:w-1/6 flex justify-center">
                            <FormField label="Foto" help="Opcional">
                                <FormFilePicker
                                    id="userPhoto"
                                    v-model="profileForm.photo"
                                    label="Enviar"
                                    is-round-icon
                                    accept="
                                    image/png,image/jpeg,image/jpg,image/gif,image/svg+xml,
                                "
                                />
                            </FormField>
                        </div>
                    </FormField>

                    <FormField
                        label="Email"
                        :help="
                            account
                                ? 'O email do utilizador. Obrigatório'
                                : 'O seu email. Obrigatório'
                        "
                        label-for="email"
                    >
                        <FormControl
                            id="email"
                            v-model="profileForm.email"
                            :icon="mdiEmail"
                            type="email"
                            name="email"
                            maxlength="255"
                            required
                            autocomplete="email"
                            :disabled="
                                user.id != authStore.user?.id &&
                                authStore.user?.role == 'M' &&
                                (user.role == 'A' || user.role == 'M')
                            "
                        />
                    </FormField>

                    <BaseDivider />

                    <FormField flex>
                        <FormField
                            label="Nº Telefone"
                            class="w-full md:w-2/4 mb-4 sm:mb-0"
                            :help="
                                account
                                    ? 'O Nº de telefone do utilizador. Opcional'
                                    : 'O seu Nº de telefone. Opcional'
                            "
                            label-for="phone"
                        >
                            <FormControl
                                id="phone"
                                v-model="profileForm.phone"
                                :icon="mdiCellphone"
                                type="number"
                                name="phone"
                                autocomplete="phone"
                                :placeholder="
                                    profileForm.phone.length === 0
                                        ? 'Não definido'
                                        : ''
                                "
                                :disabled="
                                    user.id != authStore.user?.id &&
                                    authStore.user?.role == 'M' &&
                                    (user.role == 'A' || user.role == 'M')
                                "
                            />
                        </FormField>
                        <FormField
                            label="Data Nascimento"
                            :help="
                                account
                                    ? 'A data de nascimento do utilizador. Opcional'
                                    : 'A sua data de nascimento. Opcional'
                            "
                            class="w-full md:w-2/4"
                            label-for="birth_date"
                        >
                            <FormControl
                                id="birth_date"
                                v-model="profileForm.birth_date"
                                type="date"
                                :icon="mdiCalendarRange"
                                name="birth_date"
                                :placeholder="
                                    profileForm.birth_date == null
                                        ? 'Não definida'
                                        : ''
                                "
                                :disabled="
                                    user.id != authStore.user?.id &&
                                    authStore.user?.role == 'M' &&
                                    (user.role == 'A' || user.role == 'M')
                                "
                            />
                        </FormField>
                    </FormField>

                    <FormField
                        label="Morada"
                        :help="
                            account
                                ? 'A morada do utilizador. Opcional'
                                : 'A sua morada. Opcional'
                        "
                        label-for="address"
                    >
                        <FormControl
                            id="address"
                            v-model="profileForm.address"
                            :icon="mdiMapMarker"
                            name="address"
                            maxlength="255"
                            autocomplete="address"
                            :placeholder="
                                profileForm.address.length === 0
                                    ? 'Não definida'
                                    : ''
                            "
                            :disabled="
                                user.id != authStore.user?.id &&
                                authStore.user?.role == 'M' &&
                                (user.role == 'A' || user.role == 'M')
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
                                :disabled="
                                    user.id != authStore.user?.id &&
                                    authStore.user?.role == 'M' &&
                                    (user.role == 'A' || user.role == 'M')
                                "
                            />
                            <BaseButton
                                color="info"
                                label="Repor"
                                outline
                                :icon="mdiLockReset"
                                :disabled="
                                    user.id != authStore.user?.id &&
                                    authStore.user?.role == 'M' &&
                                    (user.role == 'A' || user.role == 'M')
                                "
                                @click="clearProfileFields"
                            />
                        </BaseButtons>
                    </template>
                </CardBox>

                <CardBox
                    v-if="!account"
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
                        label-for="old_password"
                    >
                        <FormControl
                            id="old_password"
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
                        help="A sua nova palavra-passe. Deve conter pelo menos 5 caracteres. Obrigatório"
                        label-for="new_password"
                    >
                        <FormControl
                            id="new_password"
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
                        label-for="new_password_confirmation"
                    >
                        <FormControl
                            id="new_password_confirmation"
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
            <div v-if="user.role == 'C'">
                <SectionTitleLine
                    :icon="mdiBullhorn"
                    title="Reclamações do Cliente"
                    class="mt-2"
                >
                    <FormCheckRadio
                        v-model="seeComplaints"
                        class="font-semibold mr-12 mt-2"
                        name="complaint-switch"
                        type="switch"
                        label="Mostrar"
                        input-value="seeComplaints"
                        :disabled="hasComplaints ? false : true"
                        :class="
                            !hasComplaints
                                ? 'cursor-not-allowed opacity-80'
                                : ''
                        "
                    />
                </SectionTitleLine>
                <CardBox class="my-auto" has-table>
                    <TableComplaints
                        v-if="hasComplaints && seeComplaints"
                        :user-id="user.id"
                    />
                    <CardBoxComponentEmpty
                        v-else-if="hasComplaints && !seeComplaints"
                        padding="p-10"
                        message="Clique para mostrar as reclamações..."
                    />
                    <CardBoxComponentEmpty
                        v-else
                        padding="p-10"
                        message="Sem reclamações registadas..."
                    />
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
