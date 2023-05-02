<script setup>
import { mdiArrowLeft } from "@mdi/js";
import SectionFullScreen from "@/components/Sections/SectionFullScreen.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import LayoutGuest from "../layouts/LayoutGuest.vue";
</script>

<template>
    <LayoutGuest>
        <SectionFullScreen bg="blueGray">
            <div class="container flex items-center justify-center">
                <div class="text-center">
                    <h3 class="font-black text-9xl text-blue-500">
                        <span class="sr-only">Erro </span>404
                    </h3>
                    <h3
                        class="mt-6 text-2xl font-semibold lg:text-3xl text-white"
                    >
                        Oops, página não encontrada...
                    </h3>
                    <BaseButton
                        class="mt-6 hover:bg-white hover:text-black dark:hover:bg-sky-800 dark:hover:text-white font-semibold"
                        color="contrast"
                        :icon="mdiArrowLeft"
                        label="Voltar"
                        to="/painel"
                    />
                </div>
            </div>
        </SectionFullScreen>
    </LayoutGuest>
</template>
