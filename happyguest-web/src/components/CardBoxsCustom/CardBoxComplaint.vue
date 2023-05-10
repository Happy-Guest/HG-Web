<script setup>
import { watch, ref, watchEffect } from "vue";
import {
    mdiCursorText,
    mdiEye,
    mdiCommentTextOutline,
    mdiEmailFastOutline,
    mdiAccountCircle,
    mdiBed,
    mdiPencil,
    mdiContentSaveCheck,
    mdiMail,
    mdiCog,
    mdiCheck,
    mdiClose,
    mdiFileCheck,
} from "@mdi/js";
import CardBoxModal from "@/components/CardBoxs/CardBoxModal.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import FormField from "@/components/Forms/FormField.vue";
import { useComplaintStore } from "@/stores/complaint";
import PillTag from "../PillTags/PillTag.vue";
import BaseDivider from "../Bases/BaseDivider.vue";

const complaintStore = useComplaintStore();
const complaint = ref([]);

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
    hasResponse: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(["update:active", "updated"]);
const resErrors = ref([]);

watchEffect(() => {
    isModalActive.value = props.active;
});

watch(
    () => props.selected,
    (value) => {
        resErrors.value = [];
        complaintStore.getComplaint(value).then((response) => {
            complaint.value = response;
            form.value.title = complaint.value?.title;
            form.value.comment = complaint.value?.comment;
            form.value.room = complaint.value?.room;
            form.value.user = complaint.value?.user;
            form.value.response = complaint.value?.response;
            form.value.status = selectOptions[0];
        });
    }
);

const form = ref({
    title: "",
    comment: "",
    room: "",
    user: "",
    response: "",
    status: "",
});

const selectOptions = [
    { id: 0, label: "Pendente", value: "P", icon: mdiFileCheck },
    { id: 1, label: "Resolução", value: "S", icon: mdiCog },
    { id: 2, label: "Resolvida", value: "R", icon: mdiCheck },
    { id: 3, label: "Cancelada", value: "C", icon: mdiClose },
];

const responseComplaint = () => {
    complaintStore
        .responseComplaint(complaint.value.id, {
            response: form.value.response,
            status: form.value.status.value,
        })
        .then((response) => {
            if (response.status == 200) {
                complaint.value.status = response.data.complaint.status;
                complaint.value.response = response.data.complaint.response;
                emit("updated", response.data.complaint);
            } else {
                resErrors.value = response.data.errors;
            }
        });
};
</script>

<template>
    <CardBoxModal
        v-if="!hasResponse"
        v-model="isModalActive"
        :title="
            selected ? 'Reclamação ➯ ' + complaint?.id : 'Registar reclamação'
        "
        :icon-title="selected ? mdiEye : mdiPencil"
        :button-label="'Criar'"
        :button-cancel-label="selected ? 'Fechar' : 'Cancelar'"
        :button-cancel="selected ? 'info' : 'danger'"
        :icon="mdiContentSaveCheck"
        button="success"
        has-close
        has-cancel
        :only-view="selected ? true : false"
        @cancel="emit('update:active', false)"
        @confirm="createComplaint()"
    >
        <FormField
            label="Título"
            no-margin
            help="O título da reclamação. Obrigatório."
        >
            <FormControl
                v-model="form.title"
                :icon="mdiCursorText"
                name="title"
                :disabled="selected ? true : false"
            />
        </FormField>
        <FormField
            label="Comentário"
            help="O comentário da reclamação. Obrigatório."
        >
            <FormControl
                v-model="form.comment"
                :icon="mdiCommentTextOutline"
                name="comment"
                type="textarea"
                :disabled="selected ? true : false"
            />
        </FormField>

        <BaseDivider />

        <FormField>
            <FormField
                label="Quarto"
                help="O quarto da reclamação. Opcional."
                no-margin
            >
                <FormControl
                    v-model="complaint.room"
                    :icon="mdiBed"
                    name="room"
                    :disabled="selected ? true : false"
                />
            </FormField>
            <FormField
                label="Cliente"
                no-margin
                help="O cliente da reclamação. Opcional"
            >
                <FormControl
                    :model-value="complaint.user?.name"
                    :icon="mdiAccountCircle"
                    name="Client"
                    :disabled="selected ? true : false"
                />
            </FormField>
        </FormField>

        <BaseDivider />

        <FormField
            label="Resposta"
            no-margin
            help="A resposta da reclamação. Dada pelos gestores."
        >
            <FormControl
                :model-value="
                    form.response
                        ? form.response
                        : !selected
                        ? form.response
                        : 'Sem resposta'
                "
                :icon="mdiEmailFastOutline"
                name="response"
                :type="form.response ? 'textarea' : 'text'"
                :disabled="selected ? true : false"
            />
        </FormField>
    </CardBoxModal>
    <CardBoxModal
        v-else
        v-model="isModalActive"
        :title="'Responder Reclamação ➯ ' + complaint?.id"
        :icon-title="mdiEmailFastOutline"
        :button-label="'Responder'"
        button="warning"
        :icon="mdiMail"
        has-close
        has-cancel
        :errors="resErrors"
        @cancel="emit('update:active', false)"
        @confirm="responseComplaint()"
    >
        <PillTag
            :label="
                complaint.status == 'S'
                    ? 'Resolução'
                    : complaint.status == 'R'
                    ? 'Resolvida'
                    : complaint.status == 'C'
                    ? 'Cancelada'
                    : 'Pendente'
            "
            :icon="
                complaint.status == 'S'
                    ? mdiCog
                    : complaint.status == 'R'
                    ? mdiCheck
                    : complaint.status == 'C'
                    ? mdiClose
                    : mdiFileCheck
            "
            :color="
                complaint.status == 'S'
                    ? 'warning'
                    : complaint.status == 'R'
                    ? 'success'
                    : complaint.status == 'C'
                    ? 'danger'
                    : 'info'
            "
            class="my-1"
        />
        <p><b>Título: </b>{{ complaint.title }}</p>
        <p><b>Comentário: </b>{{ complaint.comment }}</p>

        <BaseDivider />

        <FormField
            label="Estado"
            help="Selecione o estado da reclamação. Obrigatório."
        >
            <FormControl
                v-model="form.status"
                :options="selectOptions"
                :icon="mdiFileCheck"
            />
        </FormField>
        <FormField
            label="Resposta"
            help="Registe a resposta da reclamação. Obrigatório."
        >
            <FormControl
                v-model="form.response"
                :icon="mdiEmailFastOutline"
                name="response"
                type="textarea"
            />
        </FormField>
    </CardBoxModal>
</template>
