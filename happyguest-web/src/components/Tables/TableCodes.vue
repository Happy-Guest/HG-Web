<script setup>
import { computed, ref, watch, onMounted, watchEffect } from "vue";
import {
    mdiRename,
    mdiClose,
    mdiCheck,
    mdiTrashCan,
    mdiCheckCircle,
    mdiAccountSupervisor,
    mdiCancel,
    mdiKey,
    mdiQrcode,
} from "@mdi/js";
import BaseLevel from "@/components/Bases/BaseLevel.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import PillTag from "@/components/PillTags/PillTag.vue";
import CardBoxCode from "@/components/CardBoxsCustom/CardBoxCode.vue";
import CardBoxCodeUsers from "../CardBoxsCustom/CardBoxCodeUsers.vue";
import NotificationBar from "@/components/Others/NotificationBar.vue";
import CardBoxModal from "@/components/CardBoxs/CardBoxModal.vue";
import { useCodeStore } from "@/stores/code";
import CardBoxQrCode from "../CardBoxsCustom/CardBoxQrCode.vue";

const props = defineProps({
    newCode: {
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

const codeStore = useCodeStore();

const codes = ref([]);

const currentPage = ref(0);
const numPages = computed(() => codeStore.lastPage);
const currentPageHuman = computed(() => currentPage.value + 1);

const isModalActive = ref(false);
const isModalActiveQRCode = ref(false);
const isModalDeleteActive = ref(false);
const isSuccessNotifActive = ref(false);
const isErrorNotifActive = ref(false);
const isModalUsersActive = ref(false);

const notifText = ref("");
const resErrors = ref([]);
const selected = ref(null);
const selectedClients = ref(null);
const selectedUsed = ref(null);
const selectedCode = ref(null);
const selectedId = ref(null);

const emit = defineEmits(["update:not-empty", "button:search"]);

async function getCodes() {
    codes.value = await codeStore.getCodes(
        currentPage.value + 1,
        props.filter,
        props.order,
        props.search ? props.search : null
    );
    emit("update:not-empty", codes.value.length > 0);
    emit("button:search", false);
}

watch(currentPageHuman, async () => {
    await getCodes();
});

watch(
    () => props.newCode,
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

onMounted(async () => {
    if (codeStore.updateTable != true) {
        codeStore.clearStore();
        await getCodes();
    }
});

async function reloadTable() {
    codeStore.clearStore();
    setTimeout(async () => {
        await getCodes();
        if (codes.value.length == 0 && currentPage.value > 0) {
            currentPage.value--;
            await reloadTable();
        }
    }, 200);
}

watchEffect(async () => {
    if (codeStore.updateTable) {
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

const dateSurpassed = (date) => {
    const dateParts = date.split("/");
    const dateString = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (today.getTime() == dateString.getTime()) {
        return "text-yellow-600";
    } else if (dateString < today) {
        return "text-red-600";
    } else {
        return "text-green-500";
    }
};

function updateModal(resCode, newCode) {
    isSuccessNotifActive.value = true;
    isModalActive.value = false;
    codeStore.updateTable = true;
    if (newCode) {
        notifText.value = "Código criado com sucesso!";
    } else {
        codes.value = codes.value.map((code) => {
            if (code.id == resCode.id) {
                code = resCode;
            }
            return code;
        });
        notifText.value = "Código atualizado com sucesso!";
    }
    setTimeout(() => {
        isSuccessNotifActive.value = false;
    }, 5000);
}

const submitDelete = (password) => {
    codeStore
        .deleteCode(selected.value, password)
        .then((response) => {
            notifText.value = response.data.message;
            if (response.status === 200) {
                isModalDeleteActive.value = false;
                codes.value = codes.value.filter(
                    (code) => code.id != selected.value
                );
                codeStore.updateTable = true;
                isSuccessNotifActive.value = true;
                setTimeout(function () {
                    isSuccessNotifActive.value = false;
                }, 5000);
            } else {
                resErrors.value = response.data.errors;
            }
        })
        .catch(() => {
            notifText.value = "Ocorreu um erro ao remover o código.";
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
        title="Remover Código"
        button="danger"
        :icon-title="mdiTrashCan"
        has-cancel
        has-close
        has-password
        @confirm="submitDelete"
    >
        <p>Tem a certeza que <b>deseja remover</b> o código?</p>
        <span v-if="selectedUsed == '1'">
            O código foi utilizado e vai <b>ser desassociado</b> dos clientes.
        </span>
    </CardBoxModal>
    <CardBoxCode
        :selected="selectedId"
        :active="isModalActive"
        only-view
        @update:active="isModalActive = $event"
        @updated="updateModal($event)"
    />
    <CardBoxQrCode
        :selected="selectedCode"
        :active="isModalActiveQRCode"
        @update:active="isModalActiveQRCode = $event"
    />
    <CardBoxCodeUsers
        :selected="selectedClients"
        :selected-code="selectedCode"
        :active="isModalUsersActive"
        @update:active="isModalUsersActive = $event"
    />
    <table class="w-full">
        <thead>
            <tr>
                <th>ID</th>
                <th>Código</th>
                <th>Quarto(s)</th>
                <th>Entrada</th>
                <th>Saída</th>
                <th>Estado</th>
                <th />
            </tr>
        </thead>
        <tbody>
            <tr v-for="code in codes" :key="code.id">
                <td
                    data-label="ID"
                    class="text-center text-gray-500 dark:text-slate-400 font-semibold"
                >
                    {{ code.id }}
                </td>
                <td data-label="Código" class="font-semibold">
                    {{
                        code.code.length > 25
                            ? code.code.substring(0, 25).toUpperCase() + "..."
                            : code.code.toUpperCase()
                    }}
                </td>
                <td data-label="Quarto(s)">
                    <div>
                        <PillTag
                            v-for="room in code.rooms"
                            :key="room"
                            class="justify-center ml-2 font-semibold"
                            :label="room"
                            color="info"
                            small
                        />
                    </div>
                </td>
                <td data-label="Entrada" class="text-center">
                    {{ code.entry_date }}
                </td>
                <td
                    data-label="Saída"
                    :class="dateSurpassed(code.exit_date)"
                    class="text-center"
                >
                    {{ code.exit_date }}
                </td>
                <td data-label="Estado" class="text-center">
                    <PillTag
                        v-if="code.checked_out == '1'"
                        class="justify-center"
                        label="Check-Out"
                        color="contrast"
                        :icon="mdiKey"
                    />
                    <PillTag
                        v-else-if="code.checked_out == '0'"
                        class="justify-center"
                        label="Em Check-Out"
                        color="warning"
                        :icon="mdiKey"
                    />
                    <PillTag
                        v-else-if="code.used == '1'"
                        class="justify-center"
                        label="Utilizado"
                        color="success"
                        :icon="mdiCheck"
                    />
                    <PillTag
                        v-else
                        class="justify-center"
                        label="Inutilizado"
                        color="danger"
                        :icon="mdiClose"
                    />
                </td>
                <td
                    class="before:hidden lg:w-1 whitespace-nowrap place-content-center"
                >
                    <BaseButtons type="justify-start lg:justify-end" no-wrap>
                        <BaseButton
                            color="info"
                            title="Clientes Associados"
                            :icon="
                                code.used == '1'
                                    ? mdiAccountSupervisor
                                    : mdiCancel
                            "
                            small
                            :disabled="code.used == '0'"
                            @click="
                                isModalUsersActive = true;
                                selectedClients = code.id;
                                selectedCode = code.code;
                            "
                        />
                        <BaseButton
                            color="warning"
                            title="Editar"
                            :icon="mdiRename"
                            small
                            @click="
                                isModalActive = true;
                                selectedId = code.id;
                            "
                        />
                        <BaseButton
                            color="success"
                            title="QR Code"
                            :icon="mdiQrcode"
                            small
                            @click="
                                isModalActiveQRCode = true;
                                selectedCode = code.code;
                            "
                        />
                        <BaseButton
                            color="danger"
                            title="Remover"
                            :icon="mdiTrashCan"
                            small
                            @click="
                                isModalDeleteActive = true;
                                selected = code.id;
                                selectedUsed = code.used;
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
