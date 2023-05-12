<script setup>
import { watch, ref, watchEffect } from "vue";
import {
    mdiMail,
    mdiCog,
    mdiCheck,
    mdiClose,
    mdiClockTimeTwoOutline,
    mdiEmailFastOutline,
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
            form.value.response = complaint.value?.response;
            form.value.status = selectOptions[0];
        });
    }
);

const form = ref({
    response: "",
    status: "",
});

const selectOptions = [
    { id: 0, label: "Pendente", value: "P", icon: mdiClockTimeTwoOutline },
    { id: 1, label: "Resolução", value: "S", icon: mdiCog },
    { id: 2, label: "Terminada", value: "R", icon: mdiCheck },
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
        <div class="mb-5">
            <div class="flex justify-between">
                <div>
                    <p><b>Título: </b>{{ complaint.title }}</p>
                    <p><b>Local: </b>{{ complaint.local }}</p>
                </div>
                <div class="my-auto mr-4">
                    <PillTag
                        :label="
                            complaint.status == 'S'
                                ? 'Resolução'
                                : complaint.status == 'R'
                                ? 'Terminada'
                                : complaint.status == 'C'
                                ? 'Anulada'
                                : 'Pendente'
                        "
                        :icon="
                            complaint.status == 'S'
                                ? mdiCog
                                : complaint.status == 'R'
                                ? mdiCheck
                                : complaint.status == 'C'
                                ? mdiClose
                                : mdiClockTimeTwoOutline
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
                </div>
            </div>
            <p class="text-justify">
                <b>Comentário: </b>{{ complaint.comment }}
            </p>
        </div>

        <BaseDivider />

        <FormField
            label="Estado"
            help="Selecione o estado da reclamação. Obrigatório."
        >
            <FormControl
                v-model="form.status"
                :options="selectOptions"
                :icon="form.status.icon"
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
