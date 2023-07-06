<script setup>
import { computed, ref, watch, onMounted, watchEffect } from "vue";
import {
    mdiPackageCheck,
    mdiClockTimeTwoOutline,
    mdiCog,
    mdiCheck,
    mdiClose,
    mdiTrashCan,
    mdiListStatus,
    mdiVacuum,
    mdiFood,
    mdiPaperRoll,
    mdiNewspaperVariant,
    mdiEye,
    mdiCheckCircle,
    mdiAlertCircle,
} from "@mdi/js";
import BaseLevel from "@/components/Bases/BaseLevel.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import PillTag from "@/components/PillTags/PillTag.vue";
import CardBoxModal from "../CardBoxs/CardBoxModal.vue";
import NotificationBar from "@/components/Others/NotificationBar.vue";
import CardBoxStatusOrder from "../CardBoxsCustom/CardBoxStatusOrder.vue";
import { useOrderStore } from "@/stores/order";
import { useRouter } from "vue-router";

const router = useRouter();
const orderStore = useOrderStore();
const selected = ref(null);
const notifText = ref("");
const resErrors = ref([]);
const isSuccessNotifActive = ref(false);
const isErrorNotifActive = ref(false);
const isModalDeleteActive = ref(false);
const currentPage = ref(0);
const orders = ref([]);
const numPages = computed(() => orderStore.lastPage);
const currentPageHuman = computed(() => currentPage.value + 1);
const isModalActive = ref(false);
const selectedUpdate = ref(null);

const props = defineProps({
    filter: {
        type: String,
        default: "ALL",
    },
    orderFilter: {
        type: String,
        default: "DESC",
    },
});

const emit = defineEmits(["update:not-empty"]);

async function getOrders() {
    orders.value = await orderStore.getOrders(
        currentPage.value + 1,
        props.filter,
        props.orderFilter
    );
    emit("update:not-empty", orders.value.length > 0);
}

onMounted(async () => {
    if (orderStore.updateTable != true) {
        orderStore.clearStore();
        await getOrders();
    }
});

async function reloadTable() {
    orderStore.clearStore();
    setTimeout(async () => {
        await getOrders();
    }, 200);
}

watchEffect(async () => {
    if (orderStore.updateTable) {
        await reloadTable();
        if (orders.value.length == 0 && currentPage.value > 0) {
            currentPage.value--;
            await reloadTable();
        }
    }
});

watch(currentPageHuman, async () => {
    await getOrders();
});

watch(
    () => props.orderFilter,
    async () => {
        await reloadTable();
    }
);

watch(
    () => props.filter,
    async () => {
        await reloadTable();
    }
);

const pagesList = computed(() => {
    const pagesList = [];
    let num = [];
    let k = 0;
    for (let i = 0; i < numPages.value; i++) {
        if (k < 10) {
            num.push(i);
            k++;
        }
        if (k == 10 || i == numPages.value - 1) {
            pagesList.push(num);
            num = [];
            k = 0;
        }
    }
    return pagesList[parseInt(currentPage.value / 10)];
});

watch(
    () => isModalDeleteActive.value,
    (value) => {
        if (value) {
            resErrors.value = [];
        }
    }
);

const submitDelete = (password) => {
    orderStore
        .deleteOrder(selected.value, password)
        .then((response) => {
            notifText.value = response.data.message;
            if (response.status === 200) {
                isModalDeleteActive.value = false;
                orders.value = orders.value.filter(
                    (order) => order.id != selected.value
                );
                orderStore.updateTable = true;
                isSuccessNotifActive.value = true;
                setTimeout(function () {
                    isSuccessNotifActive.value = false;
                }, 5000);
            } else {
                resErrors.value = response.data.errors;
            }
        })
        .catch(() => {
            notifText.value = "Ocorreu um erro ao remover o pedido.";
            isErrorNotifActive.value = true;
            setTimeout(function () {
                isErrorNotifActive.value = false;
            }, 5000);
        });
};
</script>

<template>
    <NotificationBar
        v-if="isSuccessNotifActive"
        color="success"
        :icon="mdiCheckCircle"
        table
    >
        <b>{{ notifText }}</b>
    </NotificationBar>
    <NotificationBar
        v-if="isErrorNotifActive"
        color="danger"
        :icon="mdiAlertCircle"
        table
    >
        <b>{{ notifText }}</b>
    </NotificationBar>
    <CardBoxModal
        v-model="isModalDeleteActive"
        :errors="resErrors"
        title="Remover Pedido"
        button="danger"
        :icon-title="mdiTrashCan"
        has-cancel
        has-close
        has-password
        @confirm="submitDelete"
    >
        <p>Tem a certeza que <b>deseja remover</b> o pedido?</p>
    </CardBoxModal>
    <CardBoxStatusOrder
        :selected="selectedUpdate"
        :active="isModalActive"
        @update:active="isModalActive = $event"
        @updated="orderStore.updateTable = $event"
    />
    <table class="w-full">
        <thead>
            <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Quarto</th>
                <th>Serviço</th>
                <th>Estado</th>
                <th>Horário</th>
                <th />
            </tr>
        </thead>
        <tbody>
            <tr v-for="order in orders" :key="order.id">
                <td
                    data-label="ID"
                    class="text-center text-gray-500 dark:text-slate-400 font-semibold"
                >
                    {{ order.id }}
                </td>
                <td data-label="Cliente">
                    {{ order.user }}
                </td>
                <td data-label="Quarto" class="text-center font-semibold">
                    <PillTag
                        class="justify-center ml-2 font-semibold"
                        :label="order.room"
                        color="info"
                    />
                </td>
                <td data-label="Serviço" class="text-center font-semibold">
                    <PillTag
                        class="justify-center"
                        :label="order.service.name"
                        :color="
                            order.service.type == 'C'
                                ? 'contrast'
                                : order.service.type == 'F'
                                ? 'warning'
                                : order.service.type == 'B'
                                ? 'success'
                                : 'info'
                        "
                        :icon="
                            order.service.type == 'C'
                                ? mdiVacuum
                                : order.service.type == 'F'
                                ? mdiFood
                                : order.service.type == 'B'
                                ? mdiPaperRoll
                                : mdiNewspaperVariant
                        "
                        outline
                    />
                </td>
                <td data-label="Estado" class="text-center">
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
                </td>
                <td
                    data-label="Horário"
                    class="text-center text-gray-500 dark:text-slate-400 font-semibold"
                >
                    {{ order.time }}
                </td>
                <td
                    class="before:hidden lg:w-1 whitespace-nowrap place-content-center"
                >
                    <BaseButtons type="justify-start lg:justify-end" no-wrap>
                        <BaseButton
                            color="info"
                            title="Ver Pedido"
                            :icon="mdiEye"
                            small
                            @click="
                                router.push({
                                    name: 'orderView',
                                    params: { id: order.id },
                                })
                            "
                        />
                        <BaseButton
                            color="warning"
                            title="Alterar estado"
                            :icon="mdiListStatus"
                            small
                            @click="
                                isModalActive = true;
                                selectedUpdate = order.id;
                            "
                        />
                        <BaseButton
                            color="danger"
                            title="Remover"
                            :icon="mdiTrashCan"
                            small
                            @click="
                                isModalDeleteActive = true;
                                selected = order.id;
                            "
                        />
                    </BaseButtons>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
        <BaseLevel>
            <BaseButtons>
                <BaseButton
                    v-if="currentPage > 0"
                    :label="'➤'"
                    class="font-bold rotate-180"
                    small
                    @click="currentPage = 0"
                />
                <BaseButton
                    v-if="currentPage > 0"
                    :label="'➜'"
                    class="font-bold rotate-180"
                    small
                    @click="currentPage--"
                />
                <BaseButton
                    v-for="page in pagesList"
                    :key="page"
                    :active="page === currentPage"
                    :label="page + 1"
                    :color="page === currentPage ? 'lightDark' : 'whiteDark'"
                    small
                    @click="currentPage = page"
                />

                <BaseButton
                    v-if="currentPage < numPages - 1"
                    :label="'➜'"
                    class="font-bold"
                    small
                    @click="currentPage++"
                />
                <BaseButton
                    v-if="currentPage < numPages - 1"
                    :label="'➤'"
                    class="font-bold"
                    small
                    @click="currentPage = numPages - 1"
                />
            </BaseButtons>
            <small>Página {{ currentPageHuman }} de {{ numPages }}</small>
        </BaseLevel>
    </div>
</template>
