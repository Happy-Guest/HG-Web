<script setup>
import { ref, onMounted, watch } from "vue";
import {
    mdiCursorText,
    mdiFileEye,
    mdiCommentTextOutline,
    mdiEmailFastOutline,
    mdiAccountCircle,
    mdiMapMarker,
    mdiFilePlus,
    mdiContentSaveCheck,
    mdiLockReset,
    mdiAccount,
    mdiCheck,
    mdiCog,
    mdiClockTimeTwoOutline,
    mdiClose,
    mdiAccountMultiple,
    mdiCalendarRange,
} from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Sections/SectionMain.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import FormField from "@/components/Forms/FormField.vue";
import { useComplaintStore } from "@/stores/complaint";
import BaseButton from "@/components/Bases/BaseButton.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseDivider from "@/components/Bases/BaseDivider.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";
import FormCheckRadio from "@/components/Forms/FormCheckRadio.vue";
import NotificationBarInCard from "@/components/Others/NotificationBarInCard.vue";
import FormValidationErrors from "@/components/Forms/FormValidationErrors.vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

const router = useRouter();
const selected = ref(null);

const complaintStore = useComplaintStore();
const userStore = useUserStore();

const complaint = ref([]);
const anonymous = ref(false);
const resMessage = ref("");
const resErrors = ref([]);
const statusComplaint = ref(false);

onMounted(() => {
    if (router.currentRoute.value.params?.id) {
        resErrors.value = [];
        complaintStore
            .getComplaint(router.currentRoute.value.params?.id)
            .then((response) => {
                complaint.value = response;
                form.value.title = complaint.value?.title;
                form.value.date = format(complaint.value?.date, false);
                form.value.comment = complaint.value?.comment;
                form.value.local = complaint.value?.local;
                form.value.response =
                    complaint.value?.response ?? "Sem resposta";
                form.value.status = selectOptions.find(
                    (option) => option.value === complaint.value?.status
                );
                selected.value = router.currentRoute.value.params.id;
                if (complaint.value?.user) {
                    anonymous.value = false;
                    form.value.user = complaint.value?.user;
                } else {
                    anonymous.value = true;
                    form.value.user.id = "Sem ID";
                    form.value.user.name = "Anónima";
                }
            });
    } else {
        selected.value = null;
    }
});

watch(
    () => anonymous.value,
    (value) => {
        if (value) {
            form.value.user.id = "Sem ID";
            form.value.user.name = "Anónima";
        } else {
            form.value.user.id = "";
            form.value.user.name = "";
        }
    }
);

const selectOptions = [
    { id: 0, label: "Pendente", value: "P", icon: mdiClockTimeTwoOutline },
    { id: 1, label: "Resolução", value: "S", icon: mdiCog },
    { id: 2, label: "Terminada", value: "R", icon: mdiCheck },
    { id: 3, label: "Anulada", value: "C", icon: mdiClose },
];

const form = ref({
    title: "",
    date: "",
    comment: "",
    local: "",
    user: [
        {
            id: "",
            name: "",
        },
    ],
    response: "",
    status: selectOptions[0],
});

const createComplaint = () => {
    complaintStore
        .createComplaint({
            title: form.value.title,
            date: format(form.value.date, true),
            comment: form.value.comment,
            local: form.value.local,
            user_id: anonymous.value ? null : form.value.user.id,
            response: form.value.response,
            status: form.value.status.value,
        })
        .then((response) => {
            console.log(response);
            if (response.status == 201) {
                resMessage.value = response.data.message;
                statusComplaint.value = true;
                setTimeout(() => {
                    router.push({ name: "complaints" });
                }, 5000);
            } else {
                statusComplaint.value = false;
                resErrors.value = response.response.data.errors;
                form.value.password_confirmation = "";
            }
        })
        .catch(() => {
            statusComplaint.value = false;
            resMessage.value = "Ocorreu um erro a registar a reclamação.";
        });
};

const clearComplaintFields = () => {
    form.value.title = "";
    form.value.date = "";
    form.value.comment = "";
    form.value.local = "";
    form.value.user = "";
    form.value.response = "";
    form.value.status = selectOptions[0];
};

function format(date, api) {
    if (date) {
        var tzoffset = new Date().getTimezoneOffset() * 60000;
        var dateParts = null;
        var newDate = new Date();
        if (api) {
            dateParts = date.split("-");
            newDate = new Date(+dateParts[0], +dateParts[1] - 1, +dateParts[2]);
            return new Date(newDate - tzoffset)
                .toISOString()
                .slice(0, -1)
                .slice(0, 10)
                .replace(/-/g, "/");
        }
        dateParts = date.split("/");
        newDate = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
        return new Date(newDate - tzoffset)
            .toISOString()
            .slice(0, -1)
            .slice(0, 10);
    }
}

watch(
    () => form.value.user.id,
    (value) => {
        if (value && !anonymous.value) {
            userStore.loadUserById(value).then((response) => {
                if (response.role && response.role != "C")
                    form.value.user.name = "Utilizador não é cliente!";
                else if (response.id) form.value.user.name = response.name;
                else form.value.user.name = "Utilizador não encontrado!";
            });
        }
    }
);
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLine
                :title="
                    selected
                        ? 'Reclamação ➯ ' + complaint?.id
                        : 'Registar Reclamação'
                "
                :icon="selected ? mdiFileEye : mdiFilePlus"
                main
            >
                <FormCheckRadio
                    v-model="anonymous"
                    class="font-semibold mr-12 mt-2"
                    name="anon-switch"
                    type="switch"
                    label="Anónima"
                    input-value="anonymous"
                    :disabled="selected ? true : false"
                    :class="selected ? 'cursor-not-allowed opacity-80' : ''"
                />
            </SectionTitleLine>
            <CardBox is-form class="my-auto" @submit.prevent="createComplaint">
                <FormValidationErrors
                    v-if="statusComplaint == false"
                    :errors="resErrors"
                />
                <Transition name="fade">
                    <NotificationBarInCard
                        v-if="statusComplaint"
                        color="success"
                    >
                        <b>{{ resMessage }}</b>
                    </NotificationBarInCard>
                </Transition>

                <FormField flex>
                    <FormField
                        label="Título"
                        help="O título da reclamação. Obrigatório."
                        class="w-full md:w-2/3 mb-4 sm:mb-0"
                        label-for="title"
                        no-margin
                    >
                        <FormControl
                            id="title"
                            v-model="form.title"
                            :icon="mdiCursorText"
                            name="title"
                            :disabled="selected ? true : false"
                            required
                        />
                    </FormField>
                    <FormField
                        label="Data"
                        help="A data da ocorrência. Obrigatório."
                        class="w-full md:w-1/3"
                        label-for="date"
                    >
                        <FormControl
                            id="date"
                            v-model="form.date"
                            type="date"
                            :icon="mdiCalendarRange"
                            name="date"
                            :disabled="selected ? true : false"
                            required
                        />
                    </FormField>
                </FormField>

                <FormField>
                    <FormField
                        label="Estado"
                        help="O estado da reclamação. Obrigatório."
                        label-for="status"
                        no-margin
                    >
                        <FormControl
                            id="status"
                            v-model="form.status"
                            :options="selectOptions"
                            :icon="form.status.icon"
                            :disabled="selected ? true : false"
                            required
                        />
                    </FormField>
                    <FormField
                        label="Local"
                        help="O local da ocorrência. Obrigatório."
                        label-for="local"
                    >
                        <FormControl
                            id="local"
                            v-model="form.local"
                            :icon="mdiMapMarker"
                            name="local"
                            :disabled="selected ? true : false"
                            required
                        />
                    </FormField>
                </FormField>
                <FormField
                    label="Comentário"
                    help="O comentário da reclamação. Obrigatório."
                    label-for="comment"
                >
                    <FormControl
                        id="comment"
                        v-model="form.comment"
                        :icon="mdiCommentTextOutline"
                        name="comment"
                        type="textarea"
                        :disabled="selected ? true : false"
                        required
                    />
                </FormField>

                <BaseDivider />

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
                            :disabled="selected ? true : false || anonymous"
                            :required="anonymous ? false : true"
                            :class="
                                selected
                                    ? 'w-full'
                                    : 'w-10/12 flex flex-initial'
                            "
                        />
                        <BaseButtons v-if="!selected">
                            <BaseButton
                                color="info"
                                class="w-12 h-12 sm:w-12 sm:h-12 my-auto flex-initial"
                                :icon="mdiAccountMultiple"
                                small
                                outline
                                rounded-full
                                title="Ver Clientes"
                                @click="router.push({ name: 'users' })"
                            />
                        </BaseButtons>
                    </FormField>
                    <FormField
                        label="Nome Cliente"
                        help="O nome do cliente selecionado. Opcional"
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

                <BaseDivider />

                <FormField
                    label="Ficheiro(s)"
                    help="O(s) ficheiro(s) da reclamação. Opcional."
                    label-for="files"
                >
                    <FormControl
                        id="files"
                        v-model="form.file"
                        :icon="mdiEmailFastOutline"
                        name="files"
                        type="file"
                        :disabled="selected ? true : false"
                        multiple
                    />
                </FormField>

                <BaseDivider />

                <FormField
                    label="Resposta"
                    help="A resposta da reclamação. Apenas para funcionários certificados. Opcional."
                    label-for="response"
                >
                    <FormControl
                        id="response"
                        v-model="form.response"
                        :icon="mdiEmailFastOutline"
                        name="response"
                        :type="form.response ? 'textarea' : 'text'"
                        :disabled="selected ? true : false"
                    />
                </FormField>

                <template #footer>
                    <div class="relative" :class="selected ? 'mt-4' : ''">
                        <span
                            v-if="selected"
                            class="static text-zinc-500 right-0 bottom-0 mb-1 text-center sm:text-right sm:absolute"
                            >Criada Em: {{ complaint.created_at }}<br />Última
                            Atualização: {{ complaint.updated_at }}</span
                        >
                        <BaseButtons v-if="!selected">
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
                                @click="clearComplaintFields"
                            />
                        </BaseButtons>
                    </div>
                </template>
            </CardBox>

            <SectionTitleLine
                v-if="selected"
                :icon="mdiEmailFastOutline"
                title="
                    Responder Reclamação
                "
            />

            <CardBox v-if="selected" is-form class="my-auto">
                <FormField
                    label="Estado"
                    help="Selecione o estado da reclamação. Obrigatório."
                    label-for="status"
                >
                    <FormControl
                        id="status"
                        v-model="form.status"
                        :options="selectOptions"
                        :icon="form.status.icon"
                    />
                </FormField>
                <FormField
                    label="Resposta"
                    help="Registe a resposta da reclamação. Obrigatório."
                    label-for="response"
                >
                    <FormControl
                        id="response"
                        v-model="form.response"
                        :icon="mdiEmailFastOutline"
                        name="response"
                        type="textarea"
                    /> </FormField
            ></CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
