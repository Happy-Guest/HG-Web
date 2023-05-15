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
    mdiCrown,
    mdiAccountTie,
    mdiBriefcaseAccount,
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
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.js";

const router = useRouter();

const authStore = useAuthStore();

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
}

const form = ref({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    type: selectOptions[0],
    role: selectOptions[0].value,
});

const submit = () => {
    statusAccount.value = null;
    authStore
        .register(form.value)
        .then((response) => {
            resMessage.value = response.data.message;
            if (response.status === 201) {
                statusAccount.value = true;
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

                <FormField
                    label="Nome"
                    label-for="name"
                    help="Insira o nome da conta. Obrigatório"
                >
                    <FormControl
                        v-model="form.name"
                        :icon="mdiAccount"
                        type="text"
                        autocomplete="name"
                        required
                    />
                </FormField>

                <FormField
                    label="Email"
                    label-for="email"
                    help="Insira o email da conta. Obrigatório"
                >
                    <FormControl
                        v-model="form.email"
                        :icon="mdiEmail"
                        type="email"
                        autocomplete="email"
                        required
                    />
                </FormField>

                <FormField>
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
                    <FormField
                        label="Nº Telefone"
                        label-for="phone"
                        help="Insira o número de telefone. Opcional"
                    >
                        <FormControl
                            v-model="form.phone"
                            :icon="mdiCellphone"
                            type="number"
                            autocomplete="phone"
                        />
                    </FormField>
                </FormField>

                <BaseDivider />

                <FormField>
                    <FormField
                        label="Palavra-passe"
                        label-for="password"
                        help="Insira a palavra-passe. Deve conter pelo menos 8 caracteres. Obrigatório"
                        no-margin
                    >
                        <FormControl
                            v-model="form.password"
                            :icon="mdiFormTextboxPassword"
                            type="password"
                            autocomplete="new-password"
                            required
                        />
                    </FormField>

                    <FormField
                        label="Confirmar Palavra-passe"
                        label-for="password_confirmation"
                        help="Confirme a palavra-passe. Obrigatório."
                    >
                        <FormControl
                            v-model="form.password_confirmation"
                            :icon="mdiFormTextboxPassword"
                            type="password"
                            autocomplete="new-password"
                            required
                        />
                    </FormField>
                </FormField>

                <BaseDivider />

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
