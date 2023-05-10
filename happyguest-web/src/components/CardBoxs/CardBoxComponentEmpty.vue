<script setup>
import { mdiProgressClose } from "@mdi/js";
import BaseIcon from "@/components/Bases/BaseIcon.vue";
defineProps({
    message: {
        type: String,
        default: "Sem dados para mostrar...",
    },
    padding: {
        type: String,
        default: "py-24",
    },
});
</script>

<template>
    <div
        class="text-center text-gray-500 dark:text-slate-400 hover:font-semibold flex flex-row items-center justify-center"
        :class="padding"
    >
        <BaseIcon
            :path="mdiProgressClose"
            w="w-10 md:w-5"
            h="h-10 md:h-5"
            size="24"
            class="md:mr-2"
        />
        <p>{{ message }}</p>
    </div>
</template>
