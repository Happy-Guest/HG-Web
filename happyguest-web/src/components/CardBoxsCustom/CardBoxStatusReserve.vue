<script setup>
import { ref, watchEffect } from "vue";
import {
    mdiUpdate,
    mdiCheck,
    mdiClose,
    mdiClockTimeTwoOutline,
    mdiTextBox,
    mdiPackageCheck,
    mdiListStatus,
    mdiCog,
} from "@mdi/js";
import CardBoxModal from "@/components/CardBoxs/CardBoxModal.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import FormField from "@/components/Forms/FormField.vue";
import { useReserveStore } from "@/stores/reserve";
import PillTag from "../PillTags/PillTag.vue";
import BaseDivider from "../Bases/BaseDivider.vue";

const reserveStore = useReserveStore();
const reserve = ref([]);

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
    if (props.active) {
        resErrors.value = [];
        reserveStore.getReserve(props.selected).then((response) => {
            reserve.value = response;
            form.value.comment = reserve.value.comment;
            form.value.status = selectStatus.find(
                (status) => status.value == reserve.value.status
            );
        });
    }
});

const form = ref({
    comment: "",
    status: "",
});

const selectStatus = [
    { id: 0, label: "Pendente", value: "P", icon: mdiClockTimeTwoOutline },
    { id: 1, label: "Aceite", value: "A", icon: mdiCog },
    { id: 2, label: "Finalizada", value: "F", icon: mdiPackageCheck },
    { id: 3, label: "Rejeitada", value: "R", icon: mdiCheck },
    { id: 4, label: "Cancelada", value: "C", icon: mdiClose },
];

const updateStatus = () => {
    reserveStore
        .updateStatus(reserve.value.id, {
            comment: form.value.comment,
            status: form.value.status.value,
        })
        .then((response) => {
            if (response.status == 200) {
                reserve.value.status = response.data.reserve.status;
                reserve.value.response = response.data.reserve.comment;
                emit("updated", true);
                emit("update:active", false);
            } else {
                resErrors.value = response.data.errors;
            }
        });
};
</script>

<template>
    <CardBoxModal
        v-model="isModalActive"
        :title="'Atualizar Estado Reserva ➯ ' + reserve?.id"
        :icon-title="mdiListStatus"
        :button-label="'Atualizar'"
        button="warning"
        :icon="mdiUpdate"
        has-close
        has-cancel
        :errors="resErrors"
        @cancel="emit('update:active', false)"
        @confirm="updateStatus()"
    >
        <div class="mb-5">
            <div class="flex justify-between">
                <div>
                    <p><b>Cliente: </b>{{ reserve.user?.name }}</p>
                    <p><b>Serviço: </b>{{ reserve.service?.name }}</p>
                    <p><b>Nº Pessoas: </b>{{ reserve?.nr_people }}</p>
                    <p><b>Horário: </b>{{ reserve?.time }}</p>
                </div>
                <div class="my-auto mr-4">
                    <PillTag
                        v-if="reserve.status == 'P'"
                        class="justify-center"
                        label="Pendente"
                        color="info"
                        :icon="mdiClockTimeTwoOutline"
                    />
                    <PillTag
                        v-else-if="reserve.status == 'A'"
                        class="justify-center"
                        label="Aceite"
                        color="success"
                        :icon="mdiPackageCheck"
                    />
                    <PillTag
                        v-else-if="reserve.status == 'R'"
                        class="justify-center"
                        label="Rejeitada"
                        color="danger"
                        :icon="mdiCheck"
                    />
                    <PillTag
                        v-else
                        class="justify-center"
                        label="Cancelada"
                        color="contrast"
                        :icon="mdiClose"
                    />
                </div>
            </div>
        </div>

        <BaseDivider />

        <FormField
            label="Estado"
            help="Selecione o estado da reserva. Obrigatório."
            label-for="status"
        >
            <FormControl
                id="status"
                v-model="form.status"
                :options="selectStatus"
                :icon="form.status.icon"
            />
        </FormField>
        <FormField
            label="Comentário"
            help="Registe/Edite o comentário. Obrigatório."
            label-for="comment"
        >
            <FormControl
                id="comment"
                v-model="form.comment"
                :icon="mdiTextBox"
                name="comment"
                type="textarea"
            />
        </FormField>
    </CardBoxModal>
</template>
