<script setup>
import { ref } from "vue";
import { mdiLoginVariant } from "@mdi/js";
import SectionFullScreen from "@/components/Sections/SectionFullScreen.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import { useAuthStore } from "@/stores/auth";

const canLogin = ref(true);
const authStore = useAuthStore();
</script>

<template>
    <LayoutGuest>
        <SectionFullScreen v-slot="{ cardClass }" bg="blueGray">
            <CardBox :class="cardClass">
                <div class="text-center">
                    <span class="text-3xl font-bold">Bem Vindo!</span>
                    <img src="/logo.png" alt="HappyGuest" />
                </div>
                <div v-if="canLogin" class="text-center mt-6 space-y-2">
                    <BaseButton
                        v-if="authStore.isLogged"
                        :to="{ name: 'dashboard' }"
                        color="info"
                        :icon="mdiLoginVariant"
                        label="Painel"
                        outline
                    />

                    <template v-else>
                        <BaseButton
                            :to="{ name: 'login' }"
                            color="success"
                            :icon="mdiLoginVariant"
                            label="Login"
                            outline
                        />
                    </template>
                </div>
            </CardBox>
        </SectionFullScreen>
    </LayoutGuest>
</template>
