<script setup>
import { ref, watchEffect } from "vue";
import { mdiFile } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxs/CardBoxModal.vue";

const isModalActive = ref(false);

const props = defineProps({
    active: {
        type: Boolean,
        default: false,
    },
    srcFile: {
        type: String,
        default: "",
    },
    fileName: {
        type: String,
        default: "",
    },
    isImage: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(["update:active"]);

watchEffect(() => {
    isModalActive.value = props.active;
});
</script>

<template>
    <CardBoxModal
        v-model="isModalActive"
        :title="fileName"
        :icon-title="mdiFile"
        only-view
        has-close
        has-cancel
        @cancel="emit('update:active', false)"
    >
        <div>
            <img
                v-if="isImage"
                :src="srcFile"
                class="w-full h-auto rounded-xl object-scale-down max-h-96"
            />
            <iframe
                v-else
                :src="srcFile"
                class="w-full h-96 rounded-xl"
                frameborder="0"
                allowfullscreen
            ></iframe>
        </div>
    </CardBoxModal>
</template>
