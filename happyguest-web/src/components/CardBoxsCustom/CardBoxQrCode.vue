<script setup>
import { watch, ref, watchEffect } from "vue";

import CardBoxModal from "@/components/CardBoxs/CardBoxModal.vue";

import QRCode from "qrcode";
import { mdiQrcode } from "@mdi/js";

const qrCodeData = ref(null);

const isModalActive = ref(false);

const props = defineProps({
    selected: {
        type: String,
        default: null,
    },
    active: {
        type: Boolean,
        default: false,
    },
});

watchEffect(() => {
    isModalActive.value = props.active;
});

const emit = defineEmits(["update:active"]);
const code = ref(null);

watch(
    () => props.selected,
    () => {
        code.value = props?.selected;
        generateQRCode();
    }
);

const generateQRCode = () => {
    QRCode.toDataURL(code.value, (err, url) => {
        if (err) {
            console.error("Erro ao gerar o QR Code:", err);
            qrCodeData.value = null;
        } else {
            qrCodeData.value = url;
        }
    });
};
</script>

<template>
    <CardBoxModal
        v-model="isModalActive"
        :title="'QR Code ➯ ' + code"
        :icon-title="mdiQrcode"
        button-cancel-label="Fechar"
        has-cancel
        has-close
        only-view
        @cancel="emit('update:active', false)"
    >
        <div v-if="qrCodeData" class="flex justify-center mt-7">
            <img
                class="w-1/2 h-auto rounded-xl"
                :src="qrCodeData"
                alt="QR Code"
            />
        </div>
    </CardBoxModal>
</template>
