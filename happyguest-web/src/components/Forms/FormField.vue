<script setup>
import { computed, useSlots } from "vue";

const props = defineProps({
    label: {
        type: String,
        default: null,
    },
    labelFor: {
        type: String,
        default: null,
    },
    help: {
        type: String,
        default: null,
    },
    error: Boolean,
    noMargin: Boolean,
    flex: Boolean,
});

const slots = useSlots();

const wrapperClass = computed(() => {
    const base = [];
    const slotsLength = slots.default().length;

    if (slotsLength > 1 && !props.flex) {
        base.push("grid grid-cols-1 gap-3");
    }

    if (props.flex) {
        base.push("flex flex-wrap sm:flex-nowrap gap-1 md:gap-3");
    }

    if (slotsLength === 2) {
        base.push("md:grid-cols-2");
    }

    return base;
});
</script>

<template>
    <div class="mb-6 last:-mb-4">
        <label v-if="label" :for="labelFor" class="block font-bold mb-2">{{
            label
        }}</label>
        <div :class="wrapperClass">
            <slot />
        </div>
        <div
            v-if="help && error"
            class="text-xs text-red-700 dark:text-red-600 mt-1"
        >
            {{ help }}
        </div>
        <div
            v-else-if="help"
            class="text-xs text-gray-500 dark:text-slate-400 mt-1"
        >
            {{ help }}
        </div>
    </div>
</template>
