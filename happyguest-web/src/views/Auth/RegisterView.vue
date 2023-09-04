<script setup>
import { ref } from "vue";
import {
    mdiAccount,
    mdiEmail,
    mdiFormTextboxPassword,
    mdiCloseCircleOutline,
    mdiAccountPlus,
    mdiStickerPlus,
    mdiCellphone,
    mdiMapMarker,
    mdiCalendarRange,
    mdiCrown,
    mdiAccountTie,
    mdiBriefcaseAccount,
    mdiAccountHardHat,
} from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Sections/SectionMain.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import FormField from "@/components/Forms/FormField.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import BaseDivider from "@/components/Bases/BaseDivider.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseLevel from "@/components/Bases/BaseLevel.vue";
import FormValidationErrors from "@/components/Forms/FormValidationErrors.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";
import NotificationBarInCard from "@/components/Others/NotificationBarInCard.vue";
import FormFilePicker from "@/components/Forms/FormFilePicker.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.js";
import { useUserStore } from "@/stores/user.js";

const router = useRouter();

const authStore = useAuthStore();
const userStore = useUserStore();

const statusAccount = ref(false);
const resMessage = ref("");
const resErrors = ref([]);

const selectOptions = [
    { id: 0, label: "Cliente", value: "C", icon: mdiBriefcaseAccount },
];

if (authStore.user?.role == "A") {
    selectOptions.push({
        id: 1,
        label: "Administrador",
        value: "A",
        icon: mdiCrown,
    });
    selectOptions.push({
        id: 2,
        label: "Gestor",
        value: "M",
        icon: mdiAccountTie,
    });
    selectOptions.push({
        id: 3,
        label: "Funcionário",
        value: "E",
        icon: mdiAccountHardHat,
    });
}

const form = ref({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    type: selectOptions[0],
    address: "",
    birth_date: "",
    photo: null,
});

const submit = () => {
    statusAccount.value = null;
    authStore
        .register({
            name: form.value.name,
            email: form.value.email,
            phone: form.value.phone,
            password: form.value.password,
            password_confirmation: form.value.password_confirmation,
            role: form.value.type.value,
            address: form.value.address,
            birth_date: format(form.value.birth_date),
            photo: form.value.photo,
        })
        .then((response) => {
            resMessage.value = response.data.message;
            if (response.status === 201) {
                statusAccount.value = true;
                userStore.updateTable = true;
                setTimeout(() => {
                    router.push({ name: "users" });
                }, 5000);
            } else {
                statusAccount.value = false;
                resErrors.value = response.data.errors;
                form.value.password_confirmation = "";
            }
        })
        .catch(() => {
            statusAccount.value = false;
            resMessage.value = "Ocorreu um erro a registar o perfil.";
        });
};

function format(date) {
    if (date) {
        var tzoffset = new Date().getTimezoneOffset() * 60000;
        var dateParts = null;
        var newDate = new Date();
        dateParts = date.split("-");
        newDate = new Date(+dateParts[0], +dateParts[1] - 1, +dateParts[2]);
        return new Date(newDate - tzoffset)
            .toISOString()
            .slice(0, -1)
            .slice(0, 10)
            .replace(/-/g, "/");
    }
}
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLine
                :icon="mdiAccountPlus"
                :title="'Registar Utilizador'"
                main
            >
            </SectionTitleLine>
            <CardBox is-form @submit.prevent="submit">
                <FormValidationErrors
                    v-if="statusAccount === false"
                    :errors="resErrors"
                />

                <Transition name="fade">
                    <NotificationBarInCard v-if="statusAccount" color="success">
                        <b>{{ resMessage }}</b>
                    </NotificationBarInCard>
                </Transition>

                <FormField flex>
                    <FormField
                        label="Nome"
                        help="Insira o nome da conta. Obrigatório"
                        class="mb-4 sm:mb-0 w-full sm:w-5/6"
                        no-margin
                    >
                        <FormControl
                            v-model="form.name"
                            :icon="mdiAccount"
                            type="text"
                            maxlength="255"
                            autocomplete="name"
                            required
                        />
                    </FormField>
                    <div class="w-full sm:w-1/6 flex justify-center">
                        <FormField label="Foto" help="Opcional">
                            <FormFilePicker
                                v-model="form.photo"
                                label="Enviar"
                                is-round-icon
                                accept="
                                    image/png,image/jpeg,image/jpg,image/gif,image/svg+xml,
                                "
                            />
                        </FormField>
                    </div>
                </FormField>

                <FormField>
                    <FormField
                        label="Email"
                        help="Insira o email da conta. Obrigatório"
                        no-margin
                    >
                        <FormControl
                            v-model="form.email"
                            :icon="mdiEmail"
                            type="email"
                            maxlength="255"
                            autocomplete="email"
                            required
                        />
                    </FormField>
                    <FormField
                        label="Tipo"
                        help="Selecione o tipo de utilizador. Obrigatório"
                        no-margin
                    >
                        <FormControl
                            v-model="form.type"
                            :options="selectOptions"
                            :icon="form.type.icon"
                        />
                    </FormField>
                </FormField>

                <BaseDivider />

                <FormField>
                    <FormField
                        label="Nº Telefone"
                        help="Insira o número de telefone. Opcional"
                        no-margin
                    >
                        <FormControl
                            v-model="form.phone"
                            :icon="mdiCellphone"
                            type="number"
                            autocomplete="phone"
                        />
                    </FormField>
                    <FormField
                        label="Data Nascimento"
                        help="Insira a data de nascimento. Opcional"
                        label-for="birth_date"
                    >
                        <FormControl
                            id="birth_date"
                            v-model="form.birth_date"
                            type="date"
                            :icon="mdiCalendarRange"
                            name="birth_date"
                        />
                    </FormField>
                </FormField>

                <FormField
                    label="Morada"
                    help="Insira a morada da conta. Opcional"
                    label-for="address"
                >
                    <FormControl
                        id="address"
                        v-model="form.address"
                        :icon="mdiMapMarker"
                        name="address"
                        maxlength="255"
                        autocomplete="address"
                    />
                </FormField>

                <BaseDivider />

                <FormField>
                    <FormField
                        label="Palavra-passe"
                        help="Insira a palavra-passe. Deve conter pelo menos 5 caracteres. Obrigatório"
                        no-margin
                    >
                        <FormControl
                            v-model="form.password"
                            :icon="mdiFormTextboxPassword"
                            type="password"
                            maxlength="255"
                            autocomplete="new-password"
                            required
                        />
                    </FormField>

                    <FormField
                        label="Confirmar Palavra-passe"
                        help="Confirme a palavra-passe. Obrigatório."
                    >
                        <FormControl
                            v-model="form.password_confirmation"
                            :icon="mdiFormTextboxPassword"
                            type="password"
                            maxlength="255"
                            autocomplete="new-password"
                            required
                        />
                    </FormField>
                </FormField>

                <BaseLevel>
                    <BaseButtons>
                        <BaseButton
                            type="submit"
                            color="success"
                            label="Registar"
                            :icon="mdiStickerPlus"
                            :class="{ 'opacity-25': form.processing }"
                            :disabled="form.processing"
                        />
                        <BaseButton
                            :to="{ name: 'users' }"
                            color="danger"
                            :icon="mdiCloseCircleOutline"
                            label="Voltar"
                            outline
                        />
                    </BaseButtons>
                </BaseLevel>
            </CardBox>
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
