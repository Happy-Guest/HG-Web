<script setup>
import { computed, ref, watch, onMounted, watchEffect } from "vue";
import {
    mdiFoodCroissant,
    mdiFood,
    mdiFoodTurkey,
    mdiFoodApple,
    mdiBeer,
    mdiFoodVariant,
    mdiShower,
    mdiBed,
    mdiPaperRoll,
    mdiHamburger,
    mdiTrashCan,
    mdiRename,
    mdiLayersRemove,
    mdiCheckCircle,
    mdiAlertCircle,
} from "@mdi/js";
import BaseLevel from "@/components/Bases/BaseLevel.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import NotificationBar from "@/components/Others/NotificationBar.vue";
import CardBoxModal from "@/components/CardBoxs/CardBoxModal.vue";
import PillTag from "@/components/PillTags/PillTag.vue";
import { useServiceStore } from "@/stores/service";
import { useItemStore } from "@/stores/item";
import { useAuthStore } from "@/stores/auth";

const itemStore = useItemStore();
const authStore = useAuthStore();

const serviceStore = useServiceStore();

const selected = ref(null);
const notifText = ref("");
const resErrors = ref([]);

const isSuccessNotifActive = ref(false);
const isErrorNotifActive = ref(false);

const isModalActive = ref(false);
const isModalDeleteActive = ref(false);
const isModalDissociateActive = ref(false);

const props = defineProps({
    serviceId: {
        type: Number,
        default: null,
    },
    nameEN: {
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
});

const currentPage = ref(0);
const items = ref([]);
const numPages = computed(() => {
    if (props.serviceId != null) {
        return serviceStore.lastPage;
    } else {
        return itemStore.lastPage;
    }
});

const currentPageHuman = computed(() => currentPage.value + 1);

async function getItems() {
    if (props.serviceId != null) {
        items.value = await serviceStore.getItemsService(
            props.serviceId,
            currentPage.value + 1,
            props.filter,
            props.order
        );
    } else {
        items.value = await itemStore.getItems(
            currentPage.value + 1,
            props.filter,
            props.order
        );
    }
}

onMounted(async () => {
    if (itemStore.updateTable != true) {
        await getItems();
    }
});

watch(
    () => isModalDeleteActive.value,
    (value) => {
        if (value) {
            resErrors.value = [];
        }
    }
);

async function reloadTable() {
    itemStore.clearStore();
    setTimeout(async () => {
        await getItems();
        if (items.value.length == 0 && currentPage.value > 0) {
            currentPage.value--;
            await reloadTable();
        }
    }, 200);
}

watchEffect(async () => {
    if (itemStore.updateTable) {
        await reloadTable();
    }
});

watchEffect(async () => {
    if (serviceStore.updateTableItems) {
        await reloadTable();
    }
});

watch(currentPageHuman, async () => {
    await getItems();
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
    () => props.serviceId,
    () => {
        serviceStore.clearStore();
        reloadTable();
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

const submitDelete = (password) => {
    itemStore
        .deleteItem(selected.value, password)
        .then((response) => {
            notifText.value = response.data.message;
            if (response.status === 200) {
                isModalDeleteActive.value = false;
                items.value = items.value.filter(
                    (code) => code.id != selected.value
                );
                itemStore.updateTable = true;
                isSuccessNotifActive.value = true;
                setTimeout(function () {
                    isSuccessNotifActive.value = false;
                }, 5000);
            } else {
                resErrors.value = response.data.errors;
            }
        })
        .catch(() => {
            notifText.value = "Ocorreu um erro ao remover o item.";
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
        title="Remover Item"
        button="danger"
        :icon-title="mdiTrashCan"
        has-cancel
        has-close
        has-password
        @confirm="submitDelete"
    >
        <p>Tem a certeza que <b>deseja remover</b> o item?</p>
    </CardBoxModal>
    <table class="w-full">
        <thead>
            <tr>
                <th>ID:</th>
                <th>Nome:</th>
                <th v-if="nameEN">Nome (Inglês):</th>
                <th v-if="props.serviceId == null">Tipo:</th>
                <th>Categoria:</th>
                <th>Stock:</th>
                <th
                    v-if="
                        authStore.user?.role == 'A' ||
                        authStore.user?.role == 'M'
                    "
                >
                    Preço:
                </th>
                <th />
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in items" :key="item.id">
                <td
                    data-label="ID"
                    class="text-center text-gray-500 dark:text-slate-400 font-semibold"
                >
                    {{ item.id }}
                </td>
                <td>
                    {{
                        !nameEN
                            ? item.name.length > 50
                                ? item.name.substring(0, 50) + "..."
                                : item.name
                            : item.name.length > 25
                            ? item.name.substring(0, 25) + "..."
                            : item.name
                    }}
                </td>
                <td v-if="nameEN" class="text-gray-500 dark:text-slate-400">
                    {{
                        item.nameEN.length > 25
                            ? item.nameEN.substring(0, 25) + "..."
                            : item.nameEN
                    }}
                </td>
                <td v-if="props.serviceId == null" class="text-center">
                    <PillTag
                        v-if="item.type == 'F'"
                        class="justify-center"
                        label="Alimento"
                        color="warning"
                        :icon="mdiFood"
                    />
                    <PillTag
                        v-else-if="item.type == 'O'"
                        class="justify-center"
                        label="Objeto"
                        color="success"
                        :icon="mdiPaperRoll"
                    />
                </td>
                <td class="text-center">
                    <PillTag
                        v-if="item.category == 'drink'"
                        class="justify-center"
                        label="Bebida"
                        color="warning"
                        :icon="mdiBeer"
                        outline
                    />
                    <PillTag
                        v-else-if="item.category == 'snack'"
                        class="justify-center"
                        label="Lanche"
                        color="success"
                        :icon="mdiFoodApple"
                        outline
                    />
                    <PillTag
                        v-else-if="item.category == 'breakfast'"
                        class="justify-center"
                        label="P. Almoço"
                        color="info"
                        :icon="mdiFoodCroissant"
                        outline
                    />
                    <PillTag
                        v-else-if="item.category == 'lunch'"
                        class="justify-center"
                        label="Almoço"
                        color="contrast"
                        :icon="mdiFoodTurkey"
                        outline
                    />
                    <PillTag
                        v-else-if="item.category == 'dinner'"
                        class="justify-center"
                        label="Jantar"
                        color="danger"
                        :icon="mdiHamburger"
                        outline
                    />
                    <PillTag
                        v-else-if="item.category == 'room'"
                        class="justify-center"
                        label="Quarto"
                        color="warning"
                        :icon="mdiBed"
                        outline
                    />
                    <PillTag
                        v-else-if="item.category == 'bathroom'"
                        class="justify-center"
                        label="Casa Banho"
                        color="contrast"
                        :icon="mdiShower"
                        outline
                    />
                    <PillTag
                        v-else
                        class="justify-center"
                        label="Outro"
                        color="info"
                        :icon="mdiFoodVariant"
                        outline
                    />
                </td>
                <td
                    class="text-center text-gray-500 dark:text-slate-400"
                    :class="item.stock ? 'font-semibold' : ''"
                >
                    {{ item.stock ? item.stock : "N/A" }}
                </td>
                <td
                    v-if="
                        authStore.user?.role == 'A' ||
                        authStore.user?.role == 'M'
                    "
                    class="text-center"
                    :class="
                        item.price
                            ? 'text-green-500 font-semibold'
                            : 'text-gray-500 dark:text-slate-400'
                    "
                >
                    {{ item.price ? item.price + "€" : "N/A" }}
                </td>
                <td
                    class="before:hidden lg:w-1 whitespace-nowrap place-content-center"
                >
                    <BaseButtons type="justify-start lg:justify-end" no-wrap>
                        <BaseButton
                            color="warning"
                            title="Editar"
                            :icon="mdiRename"
                            small
                            @click="
                                isModalActive = true;
                                selected = item.id;
                            "
                        />
                        <BaseButton
                            v-if="props.serviceId == null"
                            color="danger"
                            title="Remover"
                            :icon="mdiTrashCan"
                            small
                            @click="
                                isModalDeleteActive = true;
                                selected = item.id;
                            "
                        />
                        <BaseButton
                            v-else
                            color="danger"
                            title="Desassociar"
                            :icon="mdiLayersRemove"
                            small
                            @click="
                                isModalDissociateActive = true;
                                selected = item.id;
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
