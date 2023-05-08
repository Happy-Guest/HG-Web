<script setup>
import { watch, ref, watchEffect } from "vue";
import {
    mdiContentSaveCheck,
    mdiRename,
    mdiBarcode,
    mdiBed,
    mdiCalendarRange,
    mdiPencil,
    mdiRefresh,
} from "@mdi/js";
import CardBoxModal from "@/components/CardBoxs/CardBoxModal.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import FormField from "@/components/Forms/FormField.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
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
        Form.value.code = code.value?.code;
        Form.value.rooms = code.value?.rooms;
        Form.value.entry_date = code.value?.entry_date;
        Form.value.exit_date = code.value?.exit_date;
    }
);

const randomString = () => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
    const string_length = 4;
    let randomstring = "";
    for (let i = 0; i < string_length; i++) {
        let rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
};

const Form = ref({
    code: props.selected ? "" : randomString(),
    rooms: "",
    entry_date: "",
    exit_date: "",
});

const emit = defineEmits(["update:active"]);

const getDateString = (date) => {
    var dateString = new Date(date);
    return (
        dateString.getFullYear() +
        "-" +
        (dateString.getMonth() > 8
            ? dateString.getMonth() + 1
            : "0" + (dateString.getMonth() + 1)) +
        "-" +
        (dateString.getDate() > 9
            ? dateString.getDate()
            : "0" + dateString.getDate())
    );
};

const createCode = async () => {
    /*var response = await codeStore.create(Form.value);
    if (response) {
        //isSuccessNotifActive.value = true;
        //clearFields();
        //ocurrenceStore.clearStore();
        emit('update:active', true)
        setTimeout(function () {
            //isSuccessNotifActive.value = false;
            router.go(-1);
        }, 3000);
    }*/
};
const editCode = async () => {
    //
};
</script>

<template>
    <CardBoxModal
        v-model="isModalActive"
        :title="selected ? 'Editar Código ➯ ' + code?.code : 'Criar Código'"
        :button-label="selected ? 'Atualizar' : 'Criar'"
        :icon="mdiContentSaveCheck"
        :icon-title="selected ? mdiRename : mdiPencil"
        button="success"
        has-errors
        has-cancel
        has-close
        @cancel="emit('update:active', false)"
        @confirm="selected ? editCode : createCode"
    >
        <FormField label="Código" class="mt-6">
            <FormControl
                v-model="Form.code"
                :icon="mdiBarcode"
                name="code"
                required
            />
            <BaseButtons v-if="!selected">
                <BaseButton
                    color="info"
                    :icon="mdiRefresh"
                    small
                    @click="Form.code = randomString()"
                />
            </BaseButtons>
        </FormField>
        <FormField label="Quarto(s)" help="Quarto. Obrigatório.">
            <FormControl
                v-model="Form.rooms"
                :icon="mdiBed"
                name="rooms"
                required
            />
        </FormField>
        <FormField>
            <FormField
                label="Data de entrada"
                help="A data de entrada. Obrigatório."
            >
                <FormControl
                    :model-value="getDateString(Form.entry_date)"
                    :icon="mdiCalendarRange"
                    name="entry_date"
                    type="date"
                    required
                />
            </FormField>

            <FormField
                label="Data de saida"
                help="A data de saida. Obrigatório."
            >
                <FormControl
                    :model-value="getDateString(Form.exit_date)"
                    :icon="mdiCalendarRange"
                    name="exit_date"
                    type="date"
                    required
                />
            </FormField>
        </FormField>
    </CardBoxModal>
</template>
