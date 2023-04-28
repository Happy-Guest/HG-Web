<script setup>
import { mdiCog } from "@mdi/js";
import { useSlots, computed } from "vue";
import BaseIcon from "@/components/Bases/BaseIcon.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import IconRounded from "@/components/Others/IconRounded.vue";

defineProps({
    icon: {
        type: String,
        default: null,
    },
    title: {
        type: String,
        required: true,
    },
    main: Boolean,
    wheel: Boolean,
});

const hasSlot = computed(() => useSlots().default);
</script>

<template>
    <section
        :class="{ 'pt-6': !main, 'pt-7': main }"
        class="mb-6 flex items-center justify-between"
    >
        <div class="flex items-center justify-start">
            <IconRounded
                v-if="icon && main"
                :icon="icon"
                color="light"
                class="mr-3 shadow-sm w-14 md:w-12"
                bg
            />
            <BaseIcon
                v-else-if="icon"
                :path="icon"
                class="mr-2 mt-1"
                size="24"
            />
            <h1 :class="main ? 'text-3xl' : 'text-2xl'" class="leading-tight">
                {{ title }}
            </h1>
        </div>
        <slot v-if="hasSlot" />
        <BaseButton v-else-if="wheel" :icon="mdiCog" color="whiteDark" />
    </section>
</template>
