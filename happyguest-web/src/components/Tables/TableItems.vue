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
    mdiBookRemove,
    mdiCheckCircle,
    mdiAlertCircle,
    mdiBookPlus,
    mdiCheck,
    mdiClose,
    mdiCandy,
} from "@mdi/js";
import BaseLevel from "@/components/Bases/BaseLevel.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import NotificationBar from "@/components/Others/NotificationBar.vue";
import CardBoxModal from "@/components/CardBoxs/CardBoxModal.vue";
import CardBoxItem from "@/components/CardBoxsCustom/CardBoxItem.vue";
import PillTag from "@/components/PillTags/PillTag.vue";
import { useServiceStore } from "@/stores/service";
import { useItemStore } from "@/stores/item";
import { useAuthStore } from "@/stores/auth";

const itemStore = useItemStore();
const authStore = useAuthStore();
const user = authStore.user;

const serviceStore = useServiceStore();

const selected = ref(null);
const selectedService = ref(null);
const notifText = ref("");
const resErrors = ref([]);

const isSuccessNotifActive = ref(false);
const isErrorNotifActive = ref(false);

const isModalActive = ref(false);
const isModalDeleteActive = ref(false);
const isModalAssociateActive = ref(false);
const isModalDissociateActive = ref(false);

const props = defineProps({
    serviceId: {
        type: Number,
        default: null,
    },
    filter: {
        type: String,
        default: "ALL",
    },
    order: {
        type: String,
        default: "DESC",
    },
    newItem: {
        type: Boolean,
        default: false,
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

const emit = defineEmits(["update:not-empty"]);

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
    emit("update:not-empty", items.value.length > 0);
}

onMounted(async () => {
    if (itemStore.updateTable != true) {
        itemStore.clearStore();
        serviceStore.clearStore();
        await getItems();
    }
});

watch(
    () => props.newItem,
    (value) => {
        if (value) {
            updateModal(null, value);
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

function updateModal(resItem, newItem) {
    isSuccessNotifActive.value = true;
    isModalActive.value = false;
    itemStore.updateTable = true;
    if (newItem) {
        notifText.value = "Item criado com sucesso!";
    } else {
        items.value = items.value.map((item) => {
            if (item.id == resItem.id) {
                item = resItem;
            }
            return item;
        });
        notifText.value = "Item atualizado com sucesso!";
    }
    setTimeout(() => {
        isSuccessNotifActive.value = false;
    }, 5000);
}

async function reloadTable() {
    itemStore.clearStore();
    serviceStore.clearStore();
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

const submitAssociate = (item) => {
    itemStore
        .associateItem(
            item == null ? selected.value : item,
            selectedService.value
        )
        .then((response) => {
            notifText.value = response.data.message;
            if (response.status === 200) {
                isModalAssociateActive.value = false;
                isSuccessNotifActive.value = true;
                if (item == null) {
                    serviceStore.updateTableItems = true;
                }
                setTimeout(function () {
                    isSuccessNotifActive.value = false;
                }, 5000);
            } else {
                resErrors.value.push([response.data.message]);
            }
        })
        .catch(() => {
            notifText.value = "Ocorreu um erro ao associar o item.";
            isErrorNotifActive.value = true;
            setTimeout(function () {
                isErrorNotifActive.value = false;
            }, 5000);
        });
};

const submitDissociate = () => {
    itemStore
        .dissociateItem(selected.value, selectedService.value)
        .then((response) => {
            notifText.value = response.data.message;
            if (response.status === 200) {
                isModalDissociateActive.value = false;
                items.value = items.value.filter(
                    (code) => code.id != selected.value
                );
                serviceStore.updateTableItems = true;
                isSuccessNotifActive.value = true;
                setTimeout(function () {
                    isSuccessNotifActive.value = false;
                }, 5000);
            } else {
                resErrors.value.push([response.data.message]);
            }
        })
        .catch(() => {
            notifText.value = "Ocorreu um erro ao desassociar o item.";
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
        v-model="isModalAssociateActive"
        :errors="resErrors"
        :title="selectedService == 2 ? 'Associar Objeto' : 'Associar Alimento'"
        button="success"
        :icon-title="mdiBookPlus"
        has-cancel
        has-close
        @confirm="submitAssociate"
    >
        <p v-if="selectedService == 2">
            Tem a certeza que <b>deseja adicionar</b> o objeto do menu?
        </p>
        <p v-else>
            Tem a certeza que <b>deseja adicionar</b> o alimento do menu?
        </p>
    </CardBoxModal>
    <CardBoxModal
        v-model="isModalDissociateActive"
        :errors="resErrors"
        :title="
            selectedService == 2 ? 'Desassociar Objeto' : 'Desassociar Alimento'
        "
        button="warning"
        :icon-title="mdiBookRemove"
        has-cancel
        has-close
        @confirm="submitDissociate"
    >
        <p v-if="selectedService == 2">
            Tem a certeza que <b>deseja remover</b> o objeto do menu?
        </p>
        <p v-else>
            Tem a certeza que <b>deseja remover</b> o alimento do menu?
        </p>
        <p>Poderá associar novamente o item ao serviço mais tarde.</p>
    </CardBoxModal>
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
    <CardBoxItem
        :selected="selected"
        :active="isModalActive"
        @update:active="isModalActive = $event"
        @updated="updateModal($event)"
    />
    <table class="w-full">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nome</th>
                <th v-if="props.serviceId == null">Tipo</th>
                <th>Categoria</th>
                <th>Stock</th>
                <th
                    v-if="
                        authStore.user?.role == 'A' ||
                        authStore.user?.role == 'M'
                    "
                >
                    Preço
                </th>
                <th>Ativo</th>
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
                <td data-label="Nome">
                    {{
                        item.name.length > 50
                            ? item.name.substring(0, 50) + "..."
                            : item.name
                    }}
                </td>
                <td
                    v-if="props.serviceId == null"
                    class="text-center"
                    data-label="Tipo"
                >
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
                <td class="text-center" data-label="Categoria">
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
                    class="text-center"
                    :class="
                        item.stock
                            ? 'font-semibold text-blue-500'
                            : 'text-gray-500 dark:text-slate-400'
                    "
                    data-label="Stock"
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
                    data-label="Preço"
                >
                    {{ item.price ? item.price + "€" : "N/A" }}
                </td>
                <td data-label="Ativo" class="text-center">
                    <PillTag
                        v-if="item.active == '1'"
                        class="justify-center"
                        label="Sim"
                        color="success"
                        :icon="mdiCheck"
                        outline
                    />
                    <PillTag
                        v-else
                        class="justify-center"
                        label="Não"
                        color="warning"
                        :icon="mdiClose"
                        outline
                    />
                </td>
                <td
                    class="before:hidden lg:w-1 whitespace-nowrap place-content-center"
                >
                    <BaseButtons type="justify-start lg:justify-end" no-wrap>
                        <BaseButton
                            v-if="item.active == '0' && user.role != 'E'"
                            color="success"
                            title="Adicionar ao Menu"
                            :icon="mdiBookPlus"
                            small
                            @click="
                                isModalAssociateActive = true;
                                selected = item.id;
                                selectedService = item.type == 'O' ? 2 : 3;
                            "
                        />
                        <BaseButton
                            v-else-if="item.active == '1' && user.role != 'E'"
                            color="warning"
                            title="Remover do Menu"
                            :icon="mdiBookRemove"
                            small
                            @click="
                                isModalDissociateActive = true;
                                selected = item.id;
                                selectedService = item.type == 'O' ? 2 : 3;
                            "
                        />
                        <BaseButton
                            color="info"
                            title="Editar"
                            :icon="mdiRename"
                            small
                            @click="
                                isModalActive = true;
                                selected = item.id;
                            "
                        />
                        <BaseButton
                            v-if="props.serviceId == null && user.role != 'E'"
                            color="danger"
                            title="Remover"
                            :icon="mdiTrashCan"
                            small
                            @click="
                                isModalDeleteActive = true;
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
