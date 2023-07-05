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
    mdiCancel,
    mdiBookPlus,
    mdiFoodVariant,
    mdiCursorText,
    mdiTagMultiple,
    mdiClose,
    mdiBeer,
    mdiFoodApple,
    mdiFoodCroissant,
    mdiFoodTurkey,
    mdiHamburger,
    mdiShower,
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
import PillTag from "@/components/PillTags/PillTag.vue";
import BaseDivider from "@/components/Bases/BaseDivider.vue";
import { useOrderStore } from "@/stores/order";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { useItemStore } from "@/stores/item";

const itemStore = useItemStore();
const userStore = useUserStore();
const router = useRouter();
const orderStore = useOrderStore();
const resMessage = ref("");
const resErrors = ref([]);
const order = ref([]);
const selected = ref(null);
const itemName = ref();
const itemQuantity = ref();
const itemId = ref();
const selectedItem = ref(null);
const validItem = ref(false);
const rooms = ref([]);

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
    price: 0,
    comment: null,
});

const clear = () => {
    form.value.user.id = "";
    form.value.user.name = "";
    form.value.room = "";
    form.value.time = "";
    form.value.service = selectService[0];
    form.value.items = [];
    form.value.price = 0;
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

watch(
    () => itemId.value,
    (value) => {
        if (value) {
            itemQuantity.value = "1";
            itemStore
                .getItem(value)
                .then((response) => {
                    if (response.id) {
                        if (
                            form.value.service.value == 2 &&
                            response.type != "O"
                        ) {
                            validItem.value = false;
                            itemName.value = "Item não encontrado!";
                            return;
                        } else if (
                            form.value.service.value == 3 &&
                            response.type != "F"
                        ) {
                            validItem.value = false;
                            itemName.value = "Item não encontrado!";
                            return;
                        }
                        validItem.value = true;
                        itemName.value = response.name;
                        selectedItem.value = response;
                    } else {
                        validItem.value = false;
                        itemName.value = "Item não encontrado!";
                    }
                })
                .catch(() => {
                    validItem.value = false;
                    itemName.value = "";
                });
        }
    }
);

watch(
    () => form.value.service.value,
    () => {
        itemName.value = "";
        selectedItem.value = null;
        form.value.items = [];
    }
);

function addItem() {
    if (
        selectedItem.value.id != "" &&
        itemQuantity.value != "" &&
        validItem.value &&
        !form.value.items.some((item) => item.id == selectedItem.value.id)
    ) {
        const itemPrice = (selectedItem.value.price ?? 0) * itemQuantity.value;
        form.value.items.push({
            id: selectedItem.value.id,
            name: itemName.value,
            category: selectedItem.value.category,
            quantity: itemQuantity.value,
            price: itemPrice,
        });
        form.value.price += itemPrice;
        selectedItem.value = null;
        itemName.value = "";
        itemQuantity.value = "";
        itemId.value = "";
    }
}

function removeItem(item) {
    form.value.price -= item.price;
    form.value.items.splice(form.value.items.indexOf(item), 1);
}
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
                        help="O ID do cliente. Obrigatório."
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
                <div v-if="form.service.value != 1">
                    <BaseDivider />
                    <FormField flex>
                        <FormField
                            label="ID Item"
                            help="O ID do item. Obrigatório."
                            class="w-full md:w-2/12 mb-4 sm:mb-0"
                            label-for="item"
                            no-margin
                        >
                            <FormControl
                                id="item"
                                v-model="itemId"
                                :icon="mdiFoodVariant"
                                name="Item"
                                type="number"
                            />
                        </FormField>
                        <FormField
                            label="Quantidade"
                            help="A quantidade. Obrigatório."
                            class="w-full md:w-3/12"
                            label-for="quantity"
                            flex
                        >
                            <FormControl
                                id="quantity"
                                v-model="itemQuantity"
                                class="w-10/12 flex flex-initial"
                                :icon="mdiTagMultiple"
                                name="Quantity"
                                type="number"
                            />
                            <BaseButtons>
                                <BaseButton
                                    color="success"
                                    class="w-10 h-10 my-auto flex-initial mb-4"
                                    :icon="
                                        !validItem || !itemQuantity
                                            ? mdiCancel
                                            : mdiBookPlus
                                    "
                                    small
                                    outline
                                    rounded-full
                                    title="Adicionar Item"
                                    :disabled="
                                        !itemId || !validItem || !itemQuantity
                                    "
                                    @click="addItem()"
                                />
                            </BaseButtons>
                        </FormField>
                        <FormField
                            label="Nome Item"
                            help="O nome do item selecionado. Automático."
                            class="w-full md:w-7/12"
                            label-for="itemName"
                        >
                            <FormControl
                                id="itemName"
                                v-model="itemName"
                                :icon="mdiCursorText"
                                name="Item"
                                disabled
                            />
                        </FormField>
                    </FormField>
                    <table v-if="form.items.length" class="w-full -mt-5">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Categoria</th>
                                <th>Quantidade</th>
                                <th>Preço</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(item, index) in form.items"
                                :key="index"
                            >
                                <td>{{ item.id }}</td>
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
                                        v-else-if="item.category == 'breakfast'"
                                        class="justify-center w-32"
                                        label="P. Almoço"
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
                                <td class="text-center">{{ item.quantity }}</td>
                                <td class="text-center">{{ item.price }} €</td>
                                <td
                                    class="before:hidden lg:w-1 whitespace-nowrap place-content-center"
                                >
                                    <BaseButtons
                                        type="justify-start lg:justify-end"
                                        no-wrap
                                    >
                                        <BaseButton
                                            color="danger"
                                            :icon="mdiClose"
                                            small
                                            title="Remover Item"
                                            @click="removeItem(item)"
                                        />
                                    </BaseButtons>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <h1 class="mt-5">Total: {{ form.price }} €</h1>
                    <BaseDivider />
                </div>
                <FormField
                    label="Horário"
                    help="O horário. Obrigatório."
                    class="w-full mt-5"
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
