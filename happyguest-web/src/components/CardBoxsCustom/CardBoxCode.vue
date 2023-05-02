<script setup>
import {  watch,ref, watchEffect} from "vue";
import {
    mdiContentSaveCheck,
    mdiRename,
    mdiBarcode,
    mdiBed,
    mdiCalendarRange
} from "@mdi/js";
import CardBoxModal from "@/components/CardBoxs/CardBoxModal.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import FormField from "@/components/Forms/FormField.vue";
import { useCodeStore } from "@/stores/code";

const codeStore = useCodeStore();
const code = ref([]);
const isModalActive = ref(false);

const props = defineProps({
    selected: {
        type: Number,
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


watch(
    () => props.selected,
    async (value) => {
        code.value = await codeStore.getCode(value);
        editForm.value.code = code.value?.code;
        editForm.value.rooms = code.value?.rooms;
        editForm.value.entry_date = code.value?.entry_date;
        editForm.value.exit_date = code.value?.exit_date;

    }
);

const editForm = ref({
    code: "",
    rooms: "",
    entry_date: "",
    exit_date: "",
});

const emit = defineEmits(["update:active"]);
</script>

<template>
    <CardBoxModal
        v-model="isModalActive"
        :title="'Editar Código ➯ ' + code?.code"
        button-label="Atualizar"
        :icon="mdiContentSaveCheck"
        :icon-title="mdiRename"
        button="success"
        @cancel="emit('update:active', false)"
        has-errors
        has-cancel
        has-close
    >
        <FormField
            label="Código"
            class="mt-6"
        >
            <FormControl
                v-model="editForm.code"
                :icon="mdiBarcode"
                name="code"
                required
            />
        </FormField>
        <FormField label="Quarto(s)" help="Quarto. Obrigatório.">
            <FormControl
                v-model="editForm.rooms"
                :icon="mdiBed"
                name="rooms"
                required
            />
        </FormField>
        <FormField>
            <FormField label="Data de entrada" help="A data de entrada. Obrigatório.">
            <FormControl
                v-model="editForm.entry_date"
                :icon="mdiCalendarRange"
                name="entry_date"
                required
            />
            </FormField>

            <FormField label="Data de saida" help="A data de saida. Obrigatório.">
            <FormControl
                v-model="editForm.exit_date"
                :icon="mdiCalendarRange"
                name="exit_date"
                required
            />
        </FormField>
        </FormField>
    </CardBoxModal>
</template>