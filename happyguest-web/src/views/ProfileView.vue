<script setup>
import { ref } from "vue";

import {
    mdiAccount,
    mdiMail,
    mdiAsterisk,
    mdiFormTextboxPassword,
    mdiPhone,
} from "@mdi/js";
import SectionMain from "@/components/Sections/SectionMain.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import BaseDivider from "@/components/Bases/BaseDivider.vue";
import FormField from "@/components/Forms/FormField.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import FormFilePicker from "@/components/Forms/FormFilePicker.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import UserCard from "@/components/Users/UserCard.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const passwordForm = ref({
    current_password: "",
    password: "",
    password_confirmation: "",
});


const submitPass = () => {
    //
};

const clearPasswordFields = () => {
    passwordForm.value.current_password = "";
    passwordForm.value.password = "";
    passwordForm.value.password_confirmation = "";
};
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLine :icon="mdiAccount" title="Perfil" main>
            </SectionTitleLine>

            <UserCard class="mb-6" :user="authStore.user" currentUser />
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CardBox is-form @submit.prevent="submitProfile">
                    <FormField label="Avatar" help="Max 500kb">
                        <FormFilePicker label="Upload" />
                    </FormField>

                    <FormField label="Nome" >
                        <FormControl
                            :modelValue="authStore.user?.name"
                            :icon="mdiAccount"
                            name="username"
                            disabled
                            transparent
                        />
                    </FormField>
                    <FormField label="E-mail" >
                        <FormControl
                            :modelValue="authStore.user?.email"
                            :icon="mdiMail"
                            type="email"
                            name="email"
                            disabled
                            transparent
                        />
                    </FormField>
                    <FormField label="Nº Telefone" >
                        <FormControl
                            :modelValue="authStore.user?.phone"
                            :icon="mdiPhone"
                            type="phone"
                            name="phone"
                            disabled
                            transparent
                        />
                    </FormField>

                    <!--<template #footer>
                        <BaseButtons>
                            <BaseButton
                                color="info"
                                type="submit"
                                label="Submit"
                            />
                            <BaseButton color="info" label="Options" outline />
                        </BaseButtons>
                    </template>-->
                </CardBox>

                <CardBox is-form @submit.prevent="submitPass">
                    <FormField
                        label="Current password"
                        help="Required. Your current password"
                    >
                        <FormControl
                            v-model="passwordForm.current_password"
                            :icon="mdiAsterisk"
                            name="password_current"
                            type="password"
                            required
                            autocomplete="current-password"
                        />
                    </FormField>

                    <BaseDivider />

                    <FormField
                        label="New password"
                        help="Required. New password"
                    >
                        <FormControl
                            v-model="passwordForm.password"
                            :icon="mdiFormTextboxPassword"
                            name="password"
                            type="password"
                            required
                            autocomplete="new-password"
                        />
                    </FormField>

                    <FormField
                        label="Confirm password"
                        help="Required. New password one more time"
                    >
                        <FormControl
                            v-model="passwordForm.password_confirmation"
                            :icon="mdiFormTextboxPassword"
                            name="password_confirmation"
                            type="password"
                            required
                            autocomplete="new-password"
                        />
                    </FormField>

                    <template #footer>
                        <BaseButtons>
                            <BaseButton
                                type="submit"
                                color="info"
                                label="Submit"
                            />
                            <BaseButton color="info" label="Options" outline />
                        </BaseButtons>
                    </template>
                </CardBox>
            </div>
        </SectionMain>
    </LayoutAuthenticated>
</template>
