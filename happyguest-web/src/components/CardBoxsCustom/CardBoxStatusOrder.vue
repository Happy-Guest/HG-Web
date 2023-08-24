<script setup>
import { watch, ref, watchEffect } from "vue";
import {
    mdiUpdate,
    mdiCheck,
    mdiClose,
    mdiClockTimeTwoOutline,
    mdiTextBox,
    mdiPackageCheck,
    mdiListStatus,
    mdiCog,
    mdiBeer,
    mdiFoodApple,
    mdiFoodCroissant,
    mdiFoodTurkey,
    mdiHamburger,
    mdiBed,
    mdiShower,
    mdiFoodVariant,
    mdiCandy,
} from "@mdi/js";
import CardBoxModal from "@/components/CardBoxs/CardBoxModal.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import FormField from "@/components/Forms/FormField.vue";
import { useOrderStore } from "@/stores/order";
import PillTag from "../PillTags/PillTag.vue";
import BaseDivider from "../Bases/BaseDivider.vue";

const orderStore = useOrderStore();
const order = ref([]);

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
        orderStore.getOrder(value).then((response) => {
            order.value = response;
            form.value.comment = order.value.comment;
            form.value.status = selectStatus.find(
                (status) => status.value == order.value.status
            );
        });
    }
);

const form = ref({
    comment: "",
    status: "",
});

const selectStatus = [
    { id: 0, label: "Pendente", value: "P", icon: mdiClockTimeTwoOutline },
    { id: 1, label: "A preparar", value: "W", icon: mdiCog },
    { id: 2, label: "Entregue", value: "DL", icon: mdiPackageCheck },
    { id: 3, label: "Rejeitada", value: "R", icon: mdiCheck },
    { id: 4, label: "Cancelada", value: "C", icon: mdiClose },
];

const updateStatus = () => {
    orderStore
        .updateStatus(order.value.id, {
            comment: form.value.comment,
            status: form.value.status.value,
        })
        .then((response) => {
            if (response.status == 200) {
                order.value.status = response.data.order.status;
                order.value.response = response.data.order.comment;
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
        :title="'Atualizar Estado Pedido ➯ ' + order?.id"
        :icon-title="mdiListStatus"
        :button-label="'Atualizar'"
        button="warning"
        :icon="mdiUpdate"
        has-errors
        has-close
        has-cancel
        :errors="resErrors"
        @cancel="emit('update:active', false)"
        @confirm="updateStatus()"
    >
        <div class="mb-5">
            <div class="flex justify-between">
                <div>
                    <p><b>Cliente: </b>{{ order.user?.name }}</p>
                    <p><b>Serviço: </b>{{ order.service?.name }}</p>
                    <p><b>Quarto: </b>{{ order?.room }}</p>
                    <p><b>Horário: </b>{{ order?.time }}</p>
                </div>
                <div class="my-auto mr-4">
                    <PillTag
                        v-if="order.status == 'P'"
                        class="justify-center"
                        label="Pendente"
                        color="info"
                        :icon="mdiClockTimeTwoOutline"
                    />
                    <PillTag
                        v-else-if="order.status == 'W'"
                        class="justify-center"
                        label="A preparar"
                        color="warning"
                        :icon="mdiCog"
                    />
                    <PillTag
                        v-else-if="order.status == 'DL'"
                        class="justify-center"
                        label="Entregue"
                        color="success"
                        :icon="mdiPackageCheck"
                    />
                    <PillTag
                        v-else-if="order.status == 'R'"
                        class="justify-center"
                        label="Rejeitado"
                        color="danger"
                        :icon="mdiCheck"
                    />
                    <PillTag
                        v-else
                        class="justify-center"
                        label="Cancelado"
                        color="contrast"
                        :icon="mdiClose"
                    />
                </div>
            </div>
            <div v-if="order?.items?.length != 0">
                <BaseDivider />
                <table class="w-full -mt-5">
                    <thead>
                        <tr>
                            <th v-if="order.service?.type == 'F'">Alimento</th>
                            <th v-else-if="order.service?.type == 'B'">
                                Objeto
                            </th>
                            <th>Categoria</th>
                            <th>Quantidade</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in order.items" :key="item.id">
                            <td>{{ item.name }}</td>
                            <td class="text-center">
                                <PillTag
                                    v-if="item.category == 'drink'"
                                    class="justify-center"
                                    label="Bebida"
                                    color="warning"
                                    :icon="mdiBeer"
                                    outline
                                    small
                                />
                                <PillTag
                                    v-else-if="item.category == 'snack'"
                                    class="justify-center"
                                    label="Lanche"
                                    color="success"
                                    :icon="mdiFoodApple"
                                    outline
                                    small
                                />
                                <PillTag
                                    v-else-if="item.category == 'dessert'"
                                    class="justify-center"
                                    label="Sobremesa"
                                    color="warning"
                                    :icon="mdiCandy"
                                    outline
                                    small
                                />
                                <PillTag
                                    v-else-if="item.category == 'breakfast'"
                                    class="justify-center w-32"
                                    label="P-Almoço"
                                    color="info"
                                    :icon="mdiFoodCroissant"
                                    outline
                                    small
                                />
                                <PillTag
                                    v-else-if="item.category == 'lunch'"
                                    class="justify-center"
                                    label="Almoço"
                                    color="contrast"
                                    :icon="mdiFoodTurkey"
                                    outline
                                    small
                                />
                                <PillTag
                                    v-else-if="item.category == 'dinner'"
                                    class="justify-center"
                                    label="Jantar"
                                    color="danger"
                                    :icon="mdiHamburger"
                                    outline
                                    small
                                />
                                <PillTag
                                    v-else-if="item.category == 'room'"
                                    class="justify-center"
                                    label="Quarto"
                                    color="warning"
                                    :icon="mdiBed"
                                    outline
                                    small
                                />
                                <PillTag
                                    v-else-if="item.category == 'bathroom'"
                                    class="justify-center"
                                    label="Casa Banho"
                                    color="contrast"
                                    :icon="mdiShower"
                                    outline
                                    small
                                />
                                <PillTag
                                    v-else
                                    class="justify-center"
                                    label="Outro"
                                    color="info"
                                    :icon="mdiFoodVariant"
                                    outline
                                    small
                                />
                            </td>
                            <td class="text-center">
                                <b>{{ item.quantity }} </b>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <BaseDivider />

        <FormField
            label="Estado"
            help="Selecione o estado do pedido. Obrigatório."
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
