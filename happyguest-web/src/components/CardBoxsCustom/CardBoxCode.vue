<script setup>
import { watch, ref, watchEffect } from "vue";
import {
    mdiContentSaveCheck,
    mdiRename,
    mdiBarcode,
    mdiBed,
    mdiCalendarRange,
    mdiRefresh,
    mdiPlusBoxMultiple,
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

const resMessage = ref("");
const resErrors = ref([]);

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
        resErrors.value = [];
        await codeStore.getCode(value).then((response) => {
            code.value = response;
            form.value.code = code.value?.code;
            form.value.rooms = code.value?.rooms;
            form.value.entry_date = format(code.value?.entry_date, false);
            form.value.exit_date = format(code.value?.exit_date, false);
        });
    }
);

const randomString = () => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
    const string_length = 5;
    let randomstring = "";
    for (let i = 0; i < string_length; i++) {
        let rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
};

const form = ref({
    code: props.selected ? "" : randomString(),
    rooms: "",
    entry_date: "",
    exit_date: "",
});

const emit = defineEmits(["update:active", "updated"]);

function format(date, api) {
    if (date) {
        var tzoffset = new Date().getTimezoneOffset() * 60000;
        var dateParts = null;
        var newDate = new Date();
        if (api) {
            dateParts = date.split("-");
            newDate = new Date(+dateParts[0], +dateParts[1] - 1, +dateParts[2]);
            return new Date(newDate - tzoffset)
                .toISOString()
                .slice(0, -1)
                .slice(0, 10)
                .replace(/-/g, "/");
        }
        dateParts = date.split("/");
        newDate = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
        return new Date(newDate - tzoffset)
            .toISOString()
            .slice(0, -1)
            .slice(0, 10);
    }
}

function setRooms(rooms) {
    if (rooms) {
        return rooms.split(",").map((room) => room.trim());
    }
}

const createCode = async () => {
    codeStore
        .createCode({
            code: form.value.code,
            rooms: setRooms(form.value.rooms),
            entry_date: format(form.value.entry_date, true),
            exit_date: format(form.value.exit_date, true),
        })
        .then((response) => {
            resMessage.value = response.data.message;
            if (response.status == 201) {
                isModalActive.value = false;
                codeStore.updateTable = true;
                emit("update:active", false);
                emit("updated", true);
            } else {
                resErrors.value = response.data.errors;
            }
        })
        .catch(() => {
            resMessage.value = "Ocorreu um erro ao criar o código.";
        });
};

const editCode = async () => {
    codeStore
        .updateCode(code.value.id, {
            code: form.value.code,
            rooms: Array.isArray(form.value.rooms)
                ? form.value.rooms
                : setRooms(form.value.rooms),
            entry_date: format(form.value.entry_date, true),
            exit_date: format(form.value.exit_date, true),
        })
        .then((response) => {
            resMessage.value = response.data.message;
            if (response.status == 200) {
                emit("updated", response.data.code);
            } else {
                resErrors.value = response.data.errors;
            }
        })
        .catch(() => {
            resMessage.value = "Ocorreu um erro ao atualizar o código.";
        });
};
</script>

<template>
    <CardBoxModal
        v-model="isModalActive"
        :title="selected ? 'Editar Código ➯ ' + code?.code : 'Criar Código'"
        :button-label="selected ? 'Atualizar' : 'Criar'"
        :icon="mdiContentSaveCheck"
        :icon-title="selected ? mdiRename : mdiPlusBoxMultiple"
        button="success"
        has-errors
        has-cancel
        has-close
        :errors="resErrors"
        @cancel="emit('update:active', false)"
        @confirm="selected ? editCode() : createCode()"
    >
        <FormField>
            <FormField
                label="Código"
                help="O código de acesso. Obrigatório."
                label-for="code"
                flex
                no-margin
            >
                <FormControl
                    id="code"
                    v-model="form.code"
                    :icon="mdiBarcode"
                    name="code"
                    :class="!selected ? 'w-10/12 flex flex-initial' : 'w-full'"
                    :disabled="selected ? true : false"
                    required
                    uppercase
                />
                <BaseButtons v-if="!selected">
                    <BaseButton
                        color="info"
                        class="w-12 h-12 sm:w-12 sm:h-12 my-auto flex-initial"
                        :icon="mdiRefresh"
                        small
                        outline
                        rounded-full
                        title="Gerar código aleatório"
                        @click="form.code = randomString()"
                    />
                </BaseButtons>
            </FormField>
            <FormField
                label="Quarto(s)"
                help="O(s) quarto(s), separados por vírgula. Obrigatório."
                label-for="rooms"
            >
                <FormControl
                    id="rooms"
                    v-model="form.rooms"
                    :icon="mdiBed"
                    name="rooms"
                    required
                    no-margin
                />
            </FormField>
        </FormField>
        <FormField>
            <FormField
                label="Data de entrada"
                help="A data de entrada. Obrigatório."
                label-for="entry_date"
                no-margin
            >
                <FormControl
                    id="entry_date"
                    v-model="form.entry_date"
                    :icon="mdiCalendarRange"
                    name="entry_date"
                    type="date"
                    required
                />
            </FormField>

            <FormField
                label="Data de saída"
                help="A data de saída. Obrigatório."
                label-for="exit_date"
            >
                <FormControl
                    id="exit_date"
                    v-model="form.exit_date"
                    :icon="mdiCalendarRange"
                    name="exit_date"
                    type="date"
                    required
                />
            </FormField>
        </FormField>
    </CardBoxModal>
</template>
