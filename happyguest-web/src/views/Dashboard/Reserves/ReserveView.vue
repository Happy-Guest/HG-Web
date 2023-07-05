<script setup>
import { watch, ref, onMounted } from "vue";
import {
    mdiContentSaveCheck,
    mdiCalendarRange,
    mdiAccount,
    mdiAccountCircle,
    mdiFilePlus,
    mdiSilverwareForkKnife,
    mdiSpa,
    mdiWeightLifter,
    mdiLockReset,
    mdiTextBox,
    mdiAccountGroup,
    mdiFileEye,
    mdiAccountMultiple,
    mdiClockTimeTwoOutline,
    mdiPackageCheck,
    mdiCheck,
    mdiClose,
    mdiUpdate,
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
import FormCheckRadio from "@/components/Forms/FormCheckRadio.vue";
import { useReserveStore } from "@/stores/reserve";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();
const reserveStore = useReserveStore();
const regUser = ref(false);

const resMessage = ref("");
const resErrors = ref([]);

const selected = ref(null);
const reserve = ref([]);

onMounted(() => {
    if (router.currentRoute.value.params?.id) {
        resErrors.value = [];
        reserveStore
            .getReserve(router.currentRoute.value.params?.id)
            .then((response) => {
                reserve.value = response;
                form.value.nr_people = reserve.value.nr_people;
                form.value.time = formatDate(reserve.value.time, false);
                form.value.service = selectService.find(
                    (option) => option.value == reserve.value.service.id
                );
                form.value.comment = reserve.value.comment;
                form.value.status = selectStatus.find(
                    (option) => option.value === reserve.value.status
                );
                selected.value = router.currentRoute.value.params.id;
                if (reserve.value.user.id != null) {
                    regUser.value = false;
                    form.value.user = reserve.value.user;
                } else {
                    regUser.value = true;
                    form.value.user_name = reserve.value.user.name;
                }
            });
    } else {
        selected.value = null;
    }
});

const selectStatus = [
    { id: 0, label: "Pendente", value: "P", icon: mdiClockTimeTwoOutline },
    { id: 1, label: "Aceite", value: "A", icon: mdiPackageCheck },
    { id: 2, label: "Rejeitada", value: "R", icon: mdiCheck },
    { id: 3, label: "Cancelada", value: "C", icon: mdiClose },
];

const selectService = [
    { value: "4", label: "Reservar Mesa", icon: mdiSilverwareForkKnife },
    { value: "5", label: "Spa", icon: mdiSpa },
    { value: "6", label: "Ginásio", icon: mdiWeightLifter },
];

const form = ref({
    user: [
        {
            id: null,
            name: "",
        },
    ],
    user_name: null,
    nr_people: "",
    time: "",
    status: selectStatus[0],
    service: selectService[0],
    comment: null,
});

const clear = () => {
    form.value.user.id = "";
    form.value.user.name = "";
    form.value.user_name = "";
    form.value.nr_people = "";
    form.value.time = "";
    form.value.service = selectService[0];
    form.value.status = selectStatus[0];
    form.value.comment = null;
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

const statusReserve = ref(false);

const registerReserve = async () => {
    reserveStore
        .registerReserve({
            user_id: form.value.user.id,
            user_name: form.value.user_name,
            nr_people: form.value.nr_people,
            time: formatDate(form.value.time, true),
            status: form.value.status.value,
            service_id: form.value.service.value,
            comment: form.value.comment,
        })
        .then((response) => {
            resMessage.value = response.data.message;
            if (response.status == 201) {
                resMessage.value = response.data.message;
                statusReserve.value = true;
                reserveStore.updateTable = true;
                setTimeout(() => {
                    router.push({ name: "reserves" });
                }, 5000);
            } else {
                statusReserve.value = false;
                resErrors.value = response.data.errors;
            }
        })
        .catch(() => {
            resMessage.value = "Ocorreu um erro ao registar uma reserva.";
        });
};

const updateStatus = () => {
    statusReserve.value = null;
    reserveStore
        .updateStatus(reserve.value.id, {
            comment: form.value.comment,
            status: form.value.status.value,
        })
        .then((response) => {
            if (response.status == 200) {
                resMessage.value = response.data.message;
                statusReserve.value = true;
                reserve.value.status = response.data.reserve.status;
                reserve.value.response = response.data.reserve.response;
                reserveStore.updateTable = true;
                setTimeout(() => {
                    statusReserve.value = null;
                }, 5000);
            } else {
                statusReserve.value = false;
                resErrors.value = response.data.errors;
            }
        })
        .catch(() => {
            statusReserve.value = false;
            resMessage.value =
                "Ocorreu um erro ao atualizar o estado da reserva.";
        });
};

const clearStatus = () => {
    form.value.response = reserve.value.response ?? "Sem Comentário";
    form.value.status = selectStatus.find(
        (option) => option.value === reserve.value.status
    );
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
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLine
                :title="
                    selected ? 'Reserva ➯ ' + reserve?.id : 'Registar Reserva'
                "
                :icon="selected ? mdiFileEye : mdiFilePlus"
                main
            >
                <FormCheckRadio
                    v-model="regUser"
                    class="font-semibold mr-8"
                    name="regUser-switch"
                    type="switch"
                    label="Utilizador Não Registado"
                    input-value="registerUser"
                    :disabled="selected ? true : false"
                    :class="selected ? 'cursor-not-allowed opacity-80' : ''"
                />
            </SectionTitleLine>
            <CardBox is-form class="my-auto" @submit.prevent="registerReserve">
                <FormValidationErrors
                    v-if="statusReserve == false"
                    :errors="resErrors"
                />
                <Transition name="fade">
                    <NotificationBarInCard v-if="statusReserve" color="success">
                        <b>{{ resMessage }}</b>
                    </NotificationBarInCard>
                </Transition>
                <FormField v-if="!regUser" flex>
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
                <FormField
                    v-else
                    label="Nome Cliente"
                    help="O nome do cliente. Obrigatório."
                    class="w-full"
                    label-for="clientName"
                >
                    <FormControl
                        id="clientName"
                        v-model="form.user_name"
                        :icon="mdiAccountCircle"
                        name="Client"
                        :disabled="selected ? true : false"
                        required
                    />
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
                            disabled
                        />
                    </FormField>
                    <FormField
                        label="Estado"
                        help="O estado da reserva. Obrigatório."
                        label-for="status"
                        no-margin
                    >
                        <FormControl
                            id="status"
                            v-model="form.status"
                            :options="selectStatus"
                            :icon="form.status.icon"
                            required
                        />
                    </FormField>
                </FormField>
                <FormField>
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
                        label="Número de Pessoas"
                        help="O número de Pessoas. Obrigatório."
                        class="w-full mb-4 sm:mb-0"
                        label-for="nr_people"
                    >
                        <FormControl
                            id="nr_people"
                            v-model="form.nr_people"
                            type="number"
                            :icon="mdiAccountGroup"
                            name="nr_people"
                            :disabled="selected ? true : false"
                        />
                    </FormField>
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
                                @click="clear"
                            />
                        </BaseButtons>
                        <BaseButtons v-if="selected">
                            <BaseButton
                                color="warning"
                                label="Atualizar"
                                :icon="mdiUpdate"
                                @click="updateStatus"
                            />
                            <BaseButton
                                color="info"
                                label="Repor"
                                outline
                                :icon="mdiLockReset"
                                @click="clearStatus"
                            />
                        </BaseButtons>
                    </div>
                </template>
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
