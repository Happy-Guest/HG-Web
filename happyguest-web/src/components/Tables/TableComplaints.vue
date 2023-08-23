<script setup>
import { computed, ref, watch, onMounted, watchEffect } from "vue";
import {
    mdiEmailFastOutline,
    mdiClose,
    mdiCheck,
    mdiClockTimeTwoOutline,
    mdiEye,
    mdiCog,
    mdiCheckCircle,
    mdiAlertCircle,
    mdiTrashCan,
} from "@mdi/js";
import BaseLevel from "@/components/Bases/BaseLevel.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import PillTag from "@/components/PillTags/PillTag.vue";
import NotificationBar from "@/components/Others/NotificationBar.vue";
import { useComplaintStore } from "@/stores/complaint";
import CardBoxAnswerComplaint from "../CardBoxsCustom/CardBoxAnswerComplaint.vue";
import CardBoxModal from "../CardBoxs/CardBoxModal.vue";
import { useRouter } from "vue-router";

const props = defineProps({
    userId: {
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
});

const router = useRouter();

const complaintStore = useComplaintStore();

const currentPage = ref(0);
const complaints = ref([]);
const numPages = computed(() => complaintStore.lastPage);
const currentPageHuman = computed(() => currentPage.value + 1);

const isModalActive = ref(false);
const isModalDeleteActive = ref(false);
const isErrorNotifActive = ref(false);
const isSuccessNotifActive = ref(false);
const selected = ref(null);
const selectedAnswer = ref(null);

const notifText = ref("");
const resErrors = ref([]);

const emit = defineEmits(["update:not-empty"]);

async function getComplaints() {
    complaints.value = await complaintStore.getComplaints(
        currentPage.value + 1,
        props.userId,
        props.filter,
        props.order
    );
    emit("update:not-empty", complaints.value.length > 0);
}

watch(currentPageHuman, async () => {
    await getComplaints();
});

watch(
    () => isModalDeleteActive.value,
    (value) => {
        if (value) {
            resErrors.value = [];
        }
    }
);

onMounted(async () => {
    if (complaintStore.updateTable != true) {
        complaintStore.clearStore();
        if (props.userId) {
            complaintStore.user = props.userId;
        }
        await getComplaints();
    }
});

async function reloadTable() {
    complaintStore.clearStore();
    setTimeout(async () => {
        await getComplaints();
        if (complaints.value.length == 0 && currentPage.value > 0) {
            currentPage.value--;
            await reloadTable();
        }
    }, 200);
}

watchEffect(async () => {
    if (complaintStore.updateTable) {
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

const isSuccessNotifUpdateActive = ref(false);

function updateModal(resComplaint) {
    isModalActive.value = false;
    isSuccessNotifUpdateActive.value = true;
    notifText.value = "Reclamação respondida com sucesso.";
    complaints.value = complaints.value.map((complaint) => {
        if (complaint.id == resComplaint.id) {
            return resComplaint;
        }
        return complaint;
    });
    setTimeout(() => {
        isSuccessNotifUpdateActive.value = false;
    }, 5000);
}

const submitDelete = (password) => {
    complaintStore
        .deleteComplaint(selected.value, password)
        .then((response) => {
            notifText.value = response.data.message;
            if (response.status === 200) {
                isModalDeleteActive.value = false;
                complaints.value = complaints.value.filter(
                    (complaint) => complaint.id != selected.value
                );
                complaintStore.updateTable = true;
                isSuccessNotifActive.value = true;
                setTimeout(function () {
                    isSuccessNotifActive.value = false;
                }, 5000);
            } else {
                resErrors.value = response.data.errors;
            }
        })
        .catch(() => {
            notifText.value = "Ocorreu um erro ao remover a reclamação.";
            isErrorNotifActive.value = true;
            setTimeout(function () {
                isErrorNotifActive.value = false;
            }, 5000);
        });
};
</script>

<template>
    <NotificationBar
        v-if="isSuccessNotifActive || isSuccessNotifUpdateActive"
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
        title="Remover Reclamação"
        button="danger"
        :icon-title="mdiTrashCan"
        has-cancel
        has-close
        has-password
        @confirm="submitDelete"
    >
        <p>Tem a certeza que <b>deseja remover</b> a reclamação?</p>
    </CardBoxModal>
    <CardBoxAnswerComplaint
        :selected="selectedAnswer"
        :active="isModalActive"
        @update:active="isModalActive = $event"
        @updated="updateModal($event)"
    />
    <table class="w-full">
        <thead>
            <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Local</th>
                <th>Estado</th>
                <th>Criada Em</th>
                <th />
            </tr>
        </thead>
        <tbody>
            <tr v-for="complaint in complaints" :key="complaint.id">
                <td
                    data-label="ID"
                    class="text-center text-gray-500 dark:text-slate-400 font-semibold"
                >
                    {{ complaint.id }}
                </td>
                <td data-label="Título">
                    {{
                        complaint.title.length > 30
                            ? complaint.title.substring(0, 30) + "..."
                            : complaint.title
                    }}
                </td>
                <td data-label="Local" class="text-center font-semibold">
                    {{
                        complaint.local.length > 20
                            ? complaint.local.substring(0, 20) + "..."
                            : complaint.local
                    }}
                </td>
                <td data-label="Estado" class="text-center">
                    <PillTag
                        v-if="complaint.status == 'P'"
                        class="justify-center"
                        label="Pendente"
                        color="info"
                        :icon="mdiClockTimeTwoOutline"
                    />
                    <PillTag
                        v-else-if="complaint.status == 'S'"
                        class="justify-center"
                        label="Resolução"
                        color="warning"
                        :icon="mdiCog"
                    />
                    <PillTag
                        v-else-if="complaint.status == 'R'"
                        class="justify-center"
                        label="Terminada"
                        color="success"
                        :icon="mdiCheck"
                    />
                    <PillTag
                        v-else
                        class="justify-center"
                        label="Anulada"
                        color="danger"
                        :icon="mdiClose"
                    />
                </td>
                <td
                    data-label="Criada Em"
                    class="text-center text-gray-500 dark:text-slate-400"
                >
                    {{ complaint.created_at }}
                </td>
                <td
                    class="before:hidden lg:w-1 whitespace-nowrap place-content-center"
                >
                    <BaseButtons type="justify-start lg:justify-end" no-wrap>
                        <BaseButton
                            color="info"
                            title="Ver Reclamação"
                            :icon="mdiEye"
                            small
                            @click="
                                router.push({
                                    name: 'complaintView',
                                    params: { id: complaint.id },
                                })
                            "
                        />
                        <BaseButton
                            color="warning"
                            title="Responder"
                            :icon="mdiEmailFastOutline"
                            small
                            @click="
                                isModalActive = true;
                                selectedAnswer = complaint.id;
                            "
                        />
                        <BaseButton
                            color="danger"
                            title="Eliminar"
                            :icon="mdiTrashCan"
                            small
                            @click="
                                isModalDeleteActive = true;
                                selected = complaint.id;
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
