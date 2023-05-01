<script setup>
import BaseIcon from "@/components/Bases/BaseIcon.vue";

defineProps({
    icon: {
        type: String,
        default: null,
    },
    h: {
        type: String,
        default: null,
    },
    error: Boolean,
});
</script>

<template>
    <BaseIcon
        v-if="!error"
        :path="icon"
        w="w-10"
        :h="h"
        class="absolute top-0 left-0 z-10 pointer-events-none text-gray-500 dark:text-slate-400"
    />
    <BaseIcon
        v-else
        :path="icon"
        w="w-10"
        :h="h"
        class="absolute top-0 right-0 z-10 pointer-events-none text-red-600 dark:text-red-500"
    />
</template>
