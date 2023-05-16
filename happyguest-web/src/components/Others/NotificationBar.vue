<script setup>
import { ref, computed, useSlots } from "vue";
import { mdiClose } from "@mdi/js";
import { colorsBgLight, colorsOutline } from "@/colors.js";
import BaseLevel from "@/components/Bases/BaseLevel.vue";
import BaseIcon from "@/components/Bases/BaseIcon.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";

const props = defineProps({
    icon: {
        type: String,
        default: null,
    },
    outline: Boolean,
    color: {
        type: String,
        required: true,
    },
    table: Boolean,
});

const componentClass = computed(() =>
    props.outline
        ? colorsOutline[props.color]
        : colorsBgLight[props.color] +
          (props.table
              ? " -mb-1 mx-6 md:py-2 animate-bounce-slow"
              : "mb-6 md:py-3")
);

const isDismissed = ref(false);

const dismiss = () => {
    isDismissed.value = true;
};

const slots = useSlots();

const hasRightSlot = computed(() => slots.right);
</script>

<template>
    <div
        v-if="!isDismissed"
        class="px-3 py-6 last:mb-0 border rounded-lg transition-colors duration-150"
        :class="componentClass"
    >
        <BaseLevel>
            <div class="flex flex-col md:flex-row items-center">
                <BaseIcon
                    v-if="icon"
                    :path="icon"
                    w="w-10 md:w-5"
                    h="h-10 md:h-5"
                    size="24"
                    class="md:mr-2"
                />
                <span class="text-center md:text-left md:py-2"><slot /></span>
            </div>
            <slot v-if="hasRightSlot" name="right" />
            <BaseButton
                v-else
                :icon="mdiClose"
                small
                rounded-full
                color="white"
                @click="dismiss"
            />
        </BaseLevel>
    </div>
</template>
