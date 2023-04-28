<script setup>
import BaseIcon from "@/components/Bases/BaseIcon.vue";

defineProps({
    title: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        default: null,
    },
});
</script>

<template>
    <div class="flex items-center justify-between mb-3">
        <div class="flex items-center">
            <BaseIcon
                v-if="icon"
                :icon="icon"
                :path="icon"
                size="22"
                class="mr-3 mt-1"
            />
            <h1 class="text-2xl">
                {{ title }}
            </h1>
        </div>
        <slot />
    </div>
</template>
