<script setup>
import { ref } from "vue";
import {
    mdiEmail,
    mdiAsterisk,
    mdiCloseCircleOutline,
    mdiLoginVariant,
} from "@mdi/js";
import SectionFullScreen from "@/components/Sections/SectionFullScreen.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import FormCheckRadioGroup from "@/components/Forms/FormCheckRadioGroup.vue";
import BaseLevel from "@/components/Bases/BaseLevel.vue";
import FormField from "@/components/Forms/FormField.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";
import NotificationBarInCard from "@/components/Others/NotificationBarInCard.vue";
import { useAuthStore } from "@/stores/auth";
import router from "@/router/index";

const form = ref({
    email: "",
    password: "",
    remember: false,
});

const authStore = useAuthStore();

const errors = ref({
    message: "",
    status: "",
});

const submit = async () => {
    var response = await authStore.login(form.value);
    if (response == true) {
        router.push({ name: "dashboard" });
    } else {
        errors.value.message = JSON.parse(
            JSON.stringify(response.data.message)
        );
        errors.value.status = JSON.stringify(response.status);
    }
};
</script>

<template>
    <LayoutGuest>
        <SectionFullScreen v-slot="{ cardClass }" bg="blueGray">
            <CardBox :class="cardClass" is-form @submit.prevent="submit">
                <NotificationBarInCard v-if="errors.message" color="danger">
                    <div>
                        <b>Whoops! Algo correu mal.</b>
                    </div>
                    {{ errors.message }}
                </NotificationBarInCard>

                <FormField
                    label="Email"
                    label-for="email"
                    help="Insira o email da sua conta."
                >
                    <FormControl
                        id="email"
                        v-model="form.email"
                        :icon="mdiEmail"
                        autocomplete="email"
                        type="email"
                        required
                    />
                </FormField>

                <FormField
                    label="Palavra-passe"
                    label-for="password"
                    help="Insira a palavra-passe da sua conta."
                >
                    <FormControl
                        id="password"
                        v-model="form.password"
                        :icon="mdiAsterisk"
                        type="password"
                        autocomplete="current-password"
                        required
                    />
                </FormField>

                <FormCheckRadioGroup
                    v-model="form.remember"
                    name="remember"
                    :options="{ remember: 'Manter sessão iniciada' }"
                />

                <BaseLevel class="mt-8">
                    <BaseButtons>
                        <BaseButton
                            type="submit"
                            color="success"
                            label="Login"
                            :icon="mdiLoginVariant"
                            :class="{ 'opacity-25': form.processing }"
                            :disabled="form.processing"
                        />
                        <BaseButton
                            to="/"
                            color="danger"
                            :icon="mdiCloseCircleOutline"
                            label="Voltar"
                            outline
                        />
                    </BaseButtons>
                </BaseLevel>
            </CardBox>
        </SectionFullScreen>
    </LayoutGuest>
</template>
