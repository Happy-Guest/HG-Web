<script setup>
import { watch, ref, onMounted } from "vue";
import {
    mdiContentSaveCheck,
    mdiCalendarRange,
    mdiAccount,
    mdiAccountCircle,
    mdiFilePlus,
    mdiVacuum,
    mdiFood,
    mdiPaperRoll,
    mdiLockReset,
    mdiBed,
    mdiTextBox,
    mdiFileEye,
    mdiAccountMultiple,
} from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Sections/SectionMain.vue";
import NotificationBarInCard from "@/components/Others/NotificationBarInCard.vue";
import FormValidationErrors from "@/components/Forms/FormValidationErrors.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import FormField from "@/components/Forms/FormField.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import { useOrderStore } from "@/stores/order";
import { useServiceStore } from "@/stores/service";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();
const orderStore = useOrderStore();
const serviceStore = useServiceStore();

const resMessage = ref("");
const resErrors = ref([]);

const order = ref([]);

const selected = ref(null);

onMounted(() => {
    if (router.currentRoute.value.params?.id) {
        resErrors.value = [];
        orderStore
            .getOrder(router.currentRoute.value.params?.id)
            .then((response) => {
                order.value = response;
                rooms.value.push({
                    value: order.value.room,
                    label: order.value.room,
                });
                form.value.room = rooms.value[0];
                form.value.time = formatDate(order.value.time, false);
                form.value.service = selectService.find(
                    (option) => option.value == order.value.service.id
                );
                form.value.items = order.value.items;
                form.value.price = order.value.price;
                form.value.comment = order.value.comment;
                selected.value = router.currentRoute.value.params.id;
                if (order.value.user) {
                    form.value.user = order.value.user;
                } else {
                    form.value.user.id = "Sem ID";
                    form.value.user.name = "Anónima";
                }
            });
    } else {
        selected.value = null;
    }
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
    room: "",
    time: "",
    status: "P",
    service: selectService[0],
    items: [],
    price: "",
    comment: null,
});

const clear = () => {
    form.value.user.id = "";
    form.value.user.name = "";
    form.value.room = "";
    form.value.time = "";
    form.value.service = selectService[0];
    form.value.items.item_id = "";
    form.value.items.quantity = "";
    form.value.price = "";
    form.value.comment = null;
    rooms.value = [];
};

const formatDate = (date, api) => {
    if (api) {
        const [datePart, timePart] = date.split("T");
        const [year, month, day] = datePart.split("-");
        const [hour, minute] = timePart.split(":");

        const formattedDate = `${year}/${month}/${day} ${hour}:${minute}`;
        return formattedDate;
    } else {
        const [datePart, timePart] = date.split(" ");
        const [year, month, day] = datePart.split("/");
        const [hour, minute] = timePart.split(":");

        const formattedDate = `${day}-${month}-${year}T${hour}:${minute}`;
        return formattedDate;
    }
};

const statusOrder = ref(false);

const registerOrder = async () => {
    orderStore
        .registerOrder({
            user_id: form.value.user.id,
            room: form.value.room.value,
            time: formatDate(form.value.time, true),
            status: form.value.status,
            service_id: form.value.service.value,
            items: form.value.items.length != 0 ? form.value.items : null,
            price: form.value.price,
            comment: form.value.comment,
        })
        .then((response) => {
            resMessage.value = response.data.message;
            if (response.status == 201) {
                resMessage.value = response.data.message;
                statusOrder.value = true;
                orderStore.updateTable = true;
                setTimeout(() => {
                    router.push({ name: "orders" });
                }, 5000);
            } else {
                statusOrder.value = false;
                resErrors.value = response.data.errors;
            }
        })
        .catch(() => {
            resMessage.value = "Ocorreu um erro ao registar um pedido.";
        });
};
const rooms = ref([]);

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
            rooms.value = [];
            userStore.getCodeByUser(value).then((response) => {
                for (let index = 0; index < response.length; index++) {
                    const code = response[index].code;
                    for (let index = 0; index < code.rooms.length; index++) {
                        const room = code.rooms[index];
                        rooms.value.push({
                            value: room,
                            label: room,
                        });
                    }
                }
            });
        }
    }
);

const itemsService = ref([{ value: "", label: "" }]);

watch(
    () => form.value.service,
    async (value) => {
        itemsService.value = [];
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
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLine
                :title="selected ? 'Pedido ➯ ' + order?.id : 'Registar Pedido'"
                :icon="selected ? mdiFileEye : mdiFilePlus"
                main
            >
            </SectionTitleLine>
            <CardBox is-form class="my-auto" @submit.prevent="registerOrder">
                <FormValidationErrors
                    v-if="statusOrder == false"
                    :errors="resErrors"
                />
                <Transition name="fade">
                    <NotificationBarInCard v-if="statusOrder" color="success">
                        <b>{{ resMessage }}</b>
                    </NotificationBarInCard>
                </Transition>
                <FormField flex>
                    <FormField
                        label="ID Cliente"
                        help="O ID do cliente. Opcional"
                        class="w-full md:w-1/3 mb-4 sm:mb-0"
                        label-for="client"
                        flex
                        no-margin
                    >
                        <FormControl
                            id="client"
                            v-model="form.user.id"
                            :icon="mdiAccount"
                            name="Client"
                            :disabled="selected ? true : false"
                            required
                            class="w-10/12 flex flex-initial"
                        />
                        <BaseButtons>
                            <BaseButton
                                color="info"
                                class="w-10 h-10 my-auto flex-initial mb-4"
                                :icon="
                                    selected ? mdiAccount : mdiAccountMultiple
                                "
                                small
                                outline
                                rounded-full
                                :title="
                                    selected ? 'Ver Cliente' : 'Ver Clientes'
                                "
                                @click="
                                    selected
                                        ? router.push({
                                              name: 'profileUser',
                                              params: { id: form.user.id },
                                          })
                                        : (router.push({ name: 'users' }),
                                          (userStore.updateTable = true)),
                                        (userStore.filterTable = 'C')
                                "
                            />
                        </BaseButtons>
                    </FormField>
                    <FormField
                        label="Nome Cliente"
                        help="O nome do cliente selecionado. Automático."
                        class="w-full md:w-2/3"
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
                <FormField>
                    <FormField
                        label="Serviço"
                        help="O serviço. Obrigatório."
                        label-for="service"
                        class="w-full mb-4 sm:mb-0"
                    >
                        <FormControl
                            id="service"
                            v-model="form.service"
                            :options="selectService"
                            :icon="form.service.icon"
                            required
                            :disabled="selected ? true : false"
                        />
                    </FormField>
                    <FormField
                        label="Quarto"
                        help="O quarto. Obrigatório."
                        label-for="room"
                        class="w-full mb-4 sm:mb-0"
                    >
                        <FormControl
                            id="room"
                            v-model="form.room"
                            :options="rooms"
                            :icon="mdiBed"
                            required
                            :disabled="
                                rooms.length == 0 || selected ? true : false
                            "
                        />
                    </FormField>
                </FormField>
                <FormField
                    v-if="form.service.value != 1"
                    :label="form.service.value == 2 ? 'Objetos' : 'Alimentos'"
                    :help="
                        form.service.value == 2
                            ? 'O(s) objetos(s). Obrigatório.'
                            : 'O(s) alimento(s). Obrigatório.'
                    "
                    label-for="items"
                    class="w-full"
                >
                    <FormControl
                        id="items"
                        v-model="form.items"
                        :options="itemsService"
                        required
                        :disabled="selected ? true : false"
                    />
                </FormField>
                <FormField
                    label="Horário"
                    help="O horário. Obrigatório."
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
                        :disabled="selected ? true : false"
                    />
                </FormField>
                <FormField
                    label="Comentário"
                    help="O comentário. Opcional."
                    class="w-full"
                    label-for="comment"
                >
                    <FormControl
                        id="comment"
                        v-model="form.comment"
                        type="textarea"
                        :icon="mdiTextBox"
                        name="comment"
                    />
                </FormField>
                <template #footer>
                    <div class="relative">
                        <BaseButtons>
                            <BaseButton
                                type="submit"
                                color="success"
                                label="Registar"
                                :icon="mdiContentSaveCheck"
                            />
                            <BaseButton
                                color="info"
                                label="Repor"
                                outline
                                :icon="mdiLockReset"
                                @click="clear"
                            />
                        </BaseButtons>
                    </div>
                </template>
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
