<script setup>
import { computed, ref, watch, onMounted, watchEffect } from "vue";
import {
    mdiEye,
    mdiCancel,
    mdiCheck,
    mdiClose,
    mdiTrashCan,
    mdiCheckCircle,
} from "@mdi/js";
import BaseLevel from "@/components/Bases/BaseLevel.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import PillTag from "@/components/PillTags/PillTag.vue";
import CardBoxModal from "@/components/CardBoxs/CardBoxModal.vue";
import CardBoxCheckout from "@/components/CardBoxsCustom/CardBoxCheckout.vue";
import NotificationBar from "@/components/Others/NotificationBar.vue";
import { useCheckoutStore } from "@/stores/checkout";

const props = defineProps({
    newCheckout: {
        type: Boolean,
        default: false,
    },
    filter: {
        type: String,
        default: "ALL",
    },
    order: {
        type: String,
        default: "DESC",
    },
    search: {
        type: String,
        default: "",
    },
    searchButton: {
        type: Boolean,
        default: false,
    },
});

const checkoutStore = useCheckoutStore();

const checkouts = ref([]);

const currentPage = ref(0);
const numPages = computed(() => checkoutStore.lastPage);
const currentPageHuman = computed(() => currentPage.value + 1);

const isModalDeleteActive = ref(false);
const isModalActive = ref(false);
const isModalValidateActive = ref(false);
const isSuccessNotifActive = ref(false);
const isErrorNotifActive = ref(false);
const selectedView = ref(null);

const notifText = ref("");
const resErrors = ref([]);

const emit = defineEmits(["update:not-empty", "button:search"]);

async function getCheckouts() {
    checkouts.value = await checkoutStore.getCheckouts(
        currentPage.value + 1,
        props.filter,
        props.order,
        props.search
    );
    emit("update:not-empty", checkouts.value.length > 0);
}

watch(currentPageHuman, async () => {
    await getCheckouts();
});

watch(
    () => props.newCheckout,
    (value) => {
        if (value) {
            isSuccessNotifActive.value = true;
            isModalActive.value = false;
            checkoutStore.updateTable = true;
            notifText.value = "Check-Out registado com sucesso!";
            setTimeout(() => {
                isSuccessNotifActive.value = false;
            }, 5000);
        }
    }
);

watch(
    () => isModalDeleteActive.value,
    (value) => {
        if (value) {
            resErrors.value = [];
        }
    }
);

onMounted(async () => {
    if (checkoutStore.updateTable != true) {
        checkoutStore.clearStore();
        await getCheckouts();
    }
});

async function reloadTable() {
    checkoutStore.clearStore();
    setTimeout(async () => {
        await getCheckouts();
        if (checkouts.value.length == 0 && currentPage.value > 0) {
            currentPage.value--;
            await reloadTable();
        }
    }, 200);
}

watchEffect(async () => {
    if (checkoutStore.updateTable) {
        await reloadTable();
    }
});

watch(
    () => props.filter,
    async () => {
        await reloadTable();
    }
);

watch(
    () => props.order,
    async () => {
        await reloadTable();
    }
);

watch(
    () => props.searchButton,
    async () => {
        if (props.searchButton) {
            await reloadTable();
        }
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

const validateCheckout = async () => {
    await checkoutStore.validateCheckout(selectedView.value);
    isModalValidateActive.value = false;
    await reloadTable();
};

const submitDelete = (password) => {
    checkoutStore
        .deleteCheckout(selectedView.value, password)
        .then((response) => {
            notifText.value = response.data.message;
            if (response.status === 200) {
                isModalDeleteActive.value = false;
                checkouts.value = checkouts.value.filter(
                    (checkouts) => checkouts.id != selectedView.value
                );
                checkoutStore.updateTable = true;
                isSuccessNotifActive.value = true;
                setTimeout(function () {
                    isSuccessNotifActive.value = false;
                }, 5000);
            } else {
                resErrors.value = response.data.errors;
            }
        })
        .catch(() => {
            notifText.value = "Ocorreu um erro ao remover o check-out.";
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
        title="Remover Check-Out"
        button="danger"
        :icon-title="mdiTrashCan"
        has-cancel
        has-close
        has-password
        @confirm="submitDelete"
    >
        <p>Tem a certeza que <b>deseja remover</b> o check-out?</p>
    </CardBoxModal>
    <CardBoxModal
        v-model="isModalValidateActive"
        :title="'Validar Check-Out ➯ ' + selectedView"
        button-label="Validar"
        :icon-title="mdiCheck"
        :button="'success'"
        has-cancel
        has-close
        @confirm="validateCheckout()"
    >
        <p>Tem a certeza que deseja <b>validar</b> o check-out?</p>
        <span>Esta ação será <b>irreversível</b>!</span>
    </CardBoxModal>
    <CardBoxCheckout
        :selected="selectedView"
        :active="isModalActive"
        only-view
        @update:active="isModalActive = $event"
        @updated="updateModal($event)"
    />
    <table class="w-full">
        <thead>
            <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Código</th>
                <th>Validado</th>
                <th>Efetuado Em</th>
                <th />
            </tr>
        </thead>
        <tbody>
            <tr v-for="checkout in checkouts" :key="checkout.id">
                <td
                    data-label="ID"
                    class="text-center text-gray-500 dark:text-slate-400 font-semibold"
                >
                    {{ checkout.id }}
                </td>
                <td data-label="Cliente" class="font-semibold">
                    {{ checkout.user }}
                </td>
                <td data-label="Código" class="font-semibold text-center">
                    {{ checkout.code }}
                </td>
                <td data-label="Validado" class="text-center">
                    <PillTag
                        v-if="checkout.validated == '1'"
                        class="justify-center"
                        label="Sim"
                        color="success"
                        :icon="mdiCheck"
                    />
                    <PillTag
                        v-else
                        class="justify-center"
                        label="Não"
                        color="danger"
                        :icon="mdiClose"
                    />
                </td>
                <td
                    data-label="Efetuado Em"
                    class="text-gray-500 dark:text-slate-400 text-center"
                >
                    {{ checkout.date }}
                </td>

                <td
                    class="before:hidden lg:w-1 whitespace-nowrap place-content-center"
                >
                    <BaseButtons type="justify-start lg:justify-end" no-wrap>
                        <BaseButton
                            color="info"
                            title="Ver Cliente"
                            :icon="mdiEye"
                            small
                            @click="
                                isModalActive = true;
                                selectedView = checkout.id;
                            "
                        />
                        <BaseButton
                            color="success"
                            title="Validar"
                            :icon="checkout.validated ? mdiCancel : mdiCheck"
                            small
                            :disabled="checkout.validated == '1'"
                            @click="
                                isModalValidateActive = true;
                                selectedView = checkout.id;
                            "
                        />
                        <BaseButton
                            color="danger"
                            title="Remover"
                            :icon="mdiTrashCan"
                            small
                            @click="
                                isModalDeleteActive = true;
                                selectedView = checkout.id;
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
