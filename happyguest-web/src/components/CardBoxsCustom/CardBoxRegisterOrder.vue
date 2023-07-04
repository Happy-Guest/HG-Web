<script setup>
import { watch, ref, watchEffect } from "vue";
import {
    mdiContentSaveCheck,
    mdiCalendarRange,
    mdiAccountMultiple,
    mdiAccount,
    mdiAccountCircle,
    mdiFilePlus,
    mdiVacuum,
    mdiFood,
    mdiPaperRoll,
} from "@mdi/js";
import CardBoxModal from "@/components/CardBoxs/CardBoxModal.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import FormField from "@/components/Forms/FormField.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import { useOrderStore } from "@/stores/order";
import { useServiceStore } from "@/stores/service";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import BaseDivider from "../Bases/BaseDivider.vue";

const userStore = useUserStore();
const router = useRouter();
const orderStore = useOrderStore();
const serviceStore = useServiceStore();

const isModalActive = ref(false);

const resMessage = ref("");
const resErrors = ref([]);

const props = defineProps({
    active: {
        type: Boolean,
        default: false,
    },
});

watchEffect(() => {
    isModalActive.value = props.active;
});

const selectService = [
    { value: "1", label: "Limpeza de Quarto", icon: mdiVacuum },
    { value: "2", label: "Pedido de Objetos", icon: mdiPaperRoll },
    { value: "3", label: "Pedido de Alimentos", icon: mdiFood },
];

const form = ref({
    user: [
        {
            id: "",
            name: "",
        },
    ],
    romm: "",
    time: "",
    status: "P",
    service: selectService[0],
    items: [],
    price: "",
    comment: null,
});

const emit = defineEmits(["update:active", "updated"]);

const clear = () => {
    form.value.user.id = "";
    form.value.user.name = "";
    form.value.room = "";
    form.value.time = "";
    form.value.service = selectService[0];
    form.value.items.item_id = "";
    form.value.items.quantity = "";
    form.value.price = "";
};

const registerOrder = async () => {
    orderStore
        .registerOrder({
            user_id: form.value.user.id,
            room: form.value.room,
            time: form.value.time,
            status: form.value.status,
            service_id: form.value.service.id,
            items: form.value.items,
            price: form.value.price,
            comment: form.value.comment,
        })
        .then((response) => {
            resMessage.value = response.data.message;
            if (response.status == 201) {
                isModalActive.value = false;
                orderStore.updateTable = true;
                emit("update:active", false);
                emit("updated", true);
                clear();
            } else if (response.status == 401) {
                resErrors.value = response.data.message;
            } else {
                resErrors.value = response.data.errors;
            }
        })
        .catch(() => {
            resMessage.value = "Ocorreu um erro ao registar um pedido.";
        });
};

watch(
    () => form.value.user.id,
    (value) => {
        if (value != "") {
            userStore.loadUserById(value).then((response) => {
                if (response.role && response.role != "C")
                    form.value.user.name = "Utilizador não é cliente!";
                else if (response.id) form.value.user.name = response.name;
                else form.value.user.name = "Utilizador não encontrado!";
            });
        }
    }
);

const itemsService = ref([{ value: "", label: "" }]);

watch(
    () => form.value.service,
    async (value) => {
        await serviceStore.getService(value.value).then((response) => {
            for (let index = 0; index < response.items.length; index++) {
                const item = response.items[index];
                itemsService.value[index] = {
                    value: item.id,
                    label: item.name,
                };
            }
        });
    }
);
</script>

<template>
    <CardBoxModal
        v-model="isModalActive"
        :title="'Registar Pedido'"
        :button-label="'Registar'"
        :icon="mdiContentSaveCheck"
        :icon-title="mdiFilePlus"
        button="success"
        has-errors
        has-cancel
        has-close
        :errors="resErrors"
        @cancel="emit('update:active', false)"
        @confirm="registerOrder()"
    >
        <div class="mb-6">
            <FormField>
                <FormField
                    label="ID Cliente"
                    help="O ID do cliente. Obrigatório."
                    class="mb-4 sm:mb-0"
                    label-for="client"
                    flex
                >
                    <FormControl
                        id="client"
                        v-model="form.user.id"
                        :icon="mdiAccount"
                        type="number"
                        class="w-10/12 flex flex-initial"
                        name="Client"
                        required
                    />
                    <BaseButtons>
                        <BaseButton
                            color="info"
                            class="w-10 h-10 my-auto flex-initial mb-4"
                            :icon="mdiAccountMultiple"
                            small
                            outline
                            rounded-full
                            :title="'Ver Clientes'"
                            @click="
                                (router.push({ name: 'users' }),
                                (userStore.updateTable = true)),
                                    (userStore.filterTable = 'C')
                            "
                        />
                    </BaseButtons>
                </FormField>
                <FormField
                    label="Nome Cliente"
                    help="O nome do cliente selecionado. Automático."
                    label-for="clientName"
                >
                    <FormControl
                        id="clientName"
                        v-model="form.user.name"
                        :icon="mdiAccountCircle"
                        name="Client"
                        disabled
                    />
                </FormField>
            </FormField>
        </div>
        <BaseDivider />
        <FormField
            label="Serviço"
            help="O Serviço. Obrigatório."
            label-for="service"
            class="w-full"
        >
            <FormControl
                id="service"
                v-model="form.service"
                :options="selectService"
                :icon="form.service.icon"
                required
            />
        </FormField>
        <FormField
            label="Menu"
            help="O Menu. Obrigatório."
            label-for="items"
            class="w-full"
        >
            <FormControl
                id="items"
                v-model="form.items"
                :options="itemsService"
                required
            />
        </FormField>

        <BaseDivider />
        <FormField
            label="Horário"
            help="O hHorário. Obrigatório."
            class="w-full"
            label-for="time"
        >
            <FormControl
                id="time"
                v-model="form.time"
                type="datetime-local"
                :icon="mdiCalendarRange"
                name="time"
                required
            />
        </FormField>
    </CardBoxModal>
</template>
