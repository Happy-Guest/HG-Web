<script setup>
import { computed, ref } from "vue";
import {
    mdiClose,
    mdiCloseCircleOutline,
    mdiCheckAll,
    mdiAsterisk,
} from "@mdi/js";
import BaseButton from "@/components/Bases/BaseButton.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import OverlayLayer from "@/components/Others/OverlayLayer.vue";
import CardBoxComponentTitle from "@/components/CardBoxs/CardBoxComponentTitle.vue";
import FormValidationErrors from "@/components/Forms/FormValidationErrors.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import FormField from "@/components/Forms/FormField.vue";

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    button: {
        type: String,
        default: "info",
    },
    buttonCancel: {
        type: String,
        default: "danger",
    },
    buttonCancelLabel: {
        type: String,
        default: "Cancelar",
    },
    buttonLabel: {
        type: String,
        default: "Confirmar",
    },
    icon: {
        type: String,
        default: mdiCheckAll,
    },
    iconTitle: {
        type: String,
        default: null,
    },
    errors: {
        type: Object,
        default: () => ({}),
    },
    hasCancel: Boolean,
    hasClose: Boolean,
    hasPassword: Boolean,
    hasErrors: Boolean,
    onlyView: Boolean,
    modelValue: {
        type: [String, Number, Boolean],
        default: null,
    },
});

const emit = defineEmits(["update:modelValue", "cancel", "confirm"]);

const password = ref(null);

const value = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
});

const confirmCancel = (mode) => {
    if (!props.hasErrors) {
        value.value = false;
    }
    emit(mode);
};

const confirm = () => confirmCancel("confirm");

const confirmForm = () => {
    emit("confirm", password.value);
    value.value = true;
    password.value = null;
};

const cancel = () => {
    confirmCancel("cancel");
};

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && value.value) {
        cancel();
    }
});
</script>
<template>
    <OverlayLayer v-show="value" @overlay-click="cancel">
        <CardBox
            v-show="value"
            class="shadow-lg w-11/12 md:w-3/5 lg:w-2/5 xl:w-4/12 z-50 overflow-auto md:overflow-hidden"
            is-modal
            :is-form="hasPassword || hasErrors"
            @submit.prevent="confirmForm"
        >
            <FormValidationErrors
                v-if="hasErrors || hasPassword"
                :errors="errors"
            />

            <CardBoxComponentTitle :title="title" :icon="iconTitle">
                <BaseButton
                    v-if="hasClose"
                    :icon="mdiClose"
                    color="whiteDark"
                    small
                    rounded-full
                    @click.prevent="cancel"
                />
            </CardBoxComponentTitle>

            <div class="space-y-3">
                <slot />
                <FormField
                    v-if="hasPassword"
                    label="Palavra-passe"
                    help="Confirme a sua palavra-passe. Obrigatório"
                >
                    <FormControl
                        v-model="password"
                        :icon="mdiAsterisk"
                        name="password"
                        type="password"
                        required
                        autocomplete="password"
                    />
                </FormField>
            </div>

            <template #footer>
                <BaseButtons>
                    <BaseButton
                        v-if="hasPassword || hasErrors"
                        :label="buttonLabel"
                        :color="button"
                        :icon="icon"
                        type="submit"
                    />
                    <BaseButton
                        v-else-if="!onlyView"
                        :label="buttonLabel"
                        :color="button"
                        :icon="icon"
                        @click="confirm"
                    />

                    <BaseButton
                        v-if="hasCancel"
                        :label="buttonCancelLabel"
                        :color="buttonCancel"
                        :icon="mdiCloseCircleOutline"
                        outline
                        @click="cancel"
                    />
                </BaseButtons>
            </template>
        </CardBox>
    </OverlayLayer>
</template>
