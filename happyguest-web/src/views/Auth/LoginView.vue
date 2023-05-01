<script setup>
import { ref } from "vue";
import {
    mdiAccount,
    mdiAsterisk,
    mdiCloseCircleOutline,
    mdiLoginVariant,
} from "@mdi/js";
import SectionFullScreen from "@/components/Sections/SectionFullScreen.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import FormCheckRadio from "@/components/Forms/FormCheckRadio.vue";
import FormField from "@/components/Forms/FormField.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";
import { useAuthStore } from "@/stores/auth";
import router from "@/router/index";

const form = ref({
    email: "",
    password: "",
    remember: false,
});

const authStore = useAuthStore();

const errors = ref({
    data: [],
    message: [],
    status: String,
});


const submit = async () => {
    var response = await authStore.login(form.value);
    if (response == true) {
        router.push({ name: "dashboard" });
    } 
    else if( response.status == 401){
        errors.value.message = JSON.parse(
            JSON.stringify(response.data.message)
        );
        errors.value.status = JSON.stringify(response.status);
    }
    else {
        errors.value.data = [];
        errors.value.data = JSON.parse(JSON.stringify(response.data.errors));
        errors.value.status = JSON.stringify(response.status);
        errors.value.message = JSON.parse(
            JSON.stringify(response.data.message)
        );
    }
};
</script>

<template>
    <LayoutGuest>
        <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
            <CardBox :class="cardClass" is-form @submit.prevent="submit">
                <FormField
                    label="Email"
                    :help="
                        errors.status == '422'
                            ? errors.message
                            : 'Insira o seu email.' && errors.data.email
                            ? errors.data.email[0]
                            : 'Insira o seu email.'
                    "
                    :error="
                        errors.data.email || errors.status == '422'
                            ? true
                            : false
                    "
                >
                    <FormControl
                        v-model="form.email"
                        :icon="mdiAccount"
                        name="email"
                        autocomplete="user-email"
                        :error="
                            errors.data.email || errors.status == '422'
                                ? true
                                : false
                        "
                        required
                    />
                </FormField>
                <FormField
                    label="Password"
                    :help="
                        errors.status == '401'
                            ? errors.message
                            : 'Insira a sua password.' 
                    "
                    :error="
                         errors.status == '401'
                            ? true
                            : false
                    "
                >
                    <FormControl
                        v-model="form.password"
                        :icon="mdiAsterisk"
                        type="password"
                        name="password"
                        autocomplete="current-password"
                        :error="
                            errors.status == '401'
                                ? true
                                : false
                        "
                        required
                    />
                </FormField>

                <FormCheckRadio
                    v-model="form.remember"
                    name="remember"
                    label="Lembrar"
                    :input-value="true"
                />

                <template #footer>
                    <div class="relative flex flex-row pb-10">
                        <div class="absolute left-0">
                            <BaseButtons>
                                <BaseButton
                                    type="submit"
                                    color="info"
                                    :icon="mdiLoginVariant"
                                    :class="{ 'opacity-25': form.processing }"
                                    label="Login"
                                />
                                <BaseButton
                                    to="/"
                                    color="danger"
                                    outline
                                    :icon="mdiCloseCircleOutline"
                                    label="Voltar"
                                />
                            </BaseButtons>
                        </div>
                    </div>
                </template>
            </CardBox>
        </SectionFullScreen>
    </LayoutGuest>
</template>
