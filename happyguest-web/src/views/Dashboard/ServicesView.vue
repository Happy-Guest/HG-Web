<script setup>
import {
    mdiNewspaperVariant,
    mdiText,
    mdiLockCheck,
    mdiTextBox,
    mdiEmail,
    mdiPhone,
    mdiStoreClock,
    mdiClockTimeEleven,
    mdiFile,
    mdiCancel,
    mdiContentSaveCheck,
    mdiBookOpenPageVariant,
    mdiVacuum,
    mdiPaperRoll,
    mdiFoodTurkey,
    mdiSilverwareForkKnife,
    mdiSpa,
    mdiWeightLifter,
    mdiOrderNumericDescending,
    mdiOrderNumericAscending,
    mdiFilterMultiple,
    mdiBookPlus,
    mdiEye,
} from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Sections/SectionMain.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import FormField from "@/components/Forms/FormField.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import BaseDivider from "@/components/Bases/BaseDivider.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import CardBoxComponentEmpty from "@/components/CardBoxs/CardBoxComponentEmpty.vue";
import NotificationBarInCard from "@/components/Others/NotificationBarInCard.vue";
import FormValidationErrors from "@/components/Forms/FormValidationErrors.vue";
import TableItems from "@/components/Tables/TableItems.vue";
import CardBoxItem from "@/components/CardBoxsCustom/CardBoxItem.vue";
import CardBoxAssociateItem from "@/components/CardBoxsCustom/CardBoxAssociateItem.vue";
import FormCheckRadio from "@/components/Forms/FormCheckRadio.vue";
import { onMounted, ref, watch, watchEffect } from "vue";
import { useServiceStore } from "@/stores/service";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
const serverUrl = import.meta.env.VITE_SERVER_URL;

const router = useRouter();

const serviceStore = useServiceStore();
const user = useAuthStore().user;
const hasItems = ref(false);
const update = ref(false);
const service = ref([]);
const statusService = ref(false);

const isModalActiveCreate = ref(false);
const isModalAssociateCreate = ref(false);

const selectOptionsFilterObjects = [
    { value: "ALL", label: "Todos" },
    { value: "room", label: "Quarto" },
    { value: "bathroom", label: "Casa Banho" },
    { value: "other", label: "Outros" },
];

const selectOptionsFilterFood = [
    { value: "ALL", label: "Todos" },
    { value: "drink", label: "Bebidas" },
    { value: "breakfast", label: "P-Almoço" },
    { value: "lunch", label: "Almoço" },
    { value: "dinner", label: "Jantar" },
    { value: "snack", label: "Lanches" },
    { value: "dessert", label: "Sobremesas" },
    { value: "other", label: "Outros" },
];

const selectOptionsOrder = [
    { value: "DESC", label: "Descendente" },
    { value: "ASC", label: "Ascendente" },
];

const form = ref({
    email: "",
    phone: "",
    schedule: "",
    occupation: "",
    location: "",
    limit: "",
    description: "",
    descriptionEN: "",
    menu_url: null,
    menu: null,
    active: true,
});

onMounted(() => {
    serviceStore
        .getService(router.currentRoute.value.params?.id)
        .then((response) => {
            fillForm(response);
        });
});

watch(
    () => router.currentRoute.value.params?.id,
    () => {
        update.value = false;
        serviceStore
            .getService(router.currentRoute.value.params?.id)
            .then((response) => {
                fillForm(response);
            });
    }
);

const fillForm = (response) => {
    service.value = null;
    hasItems.value = false;
    service.value = response;
    form.value.email = response.email ?? "";
    form.value.phone = response.phone ?? "";
    form.value.schedule = response.schedule;
    form.value.occupation = response.occupation ?? "";
    form.value.location = response.location ?? "";
    form.value.limit = response.limit ?? "";
    form.value.description = response.description;
    form.value.descriptionEN = response.descriptionEN;
    form.value.menu_url = response.menu_url;
    form.value.active = response.active == 1 ? true : false;
    hasItems.value = response.items.length > 0;
};

const notifText = ref("");
const resErrors = ref([]);

function validateSchedule() {
    resErrors.value = [];
    // Format: 00:00-00:00-00:00-00:00 or 00:00-00:00 (in pairs)
    const regex = /^(\d{1,2}:\d{2})(?:-(?:(?!.*-\1)(\d{1,2}:\d{2})))*$/;
    if (!regex.test(form.value.schedule)) {
        resErrors.value.push(["O horário não está no formato correto."]);
        return false;
    }
    // Separate by - and check if the first number is smaller than the second
    const schedule = form.value.schedule.split("-");
    for (let i = 0; i < schedule.length - 1; i++) {
        const time = schedule[i].split(":");
        const time2 = schedule[i + 1].split(":");

        // Check if the time is valid
        if (
            parseInt(time[0]) > 23 ||
            parseInt(time[1]) > 59 ||
            parseInt(time2[0]) > 23 ||
            parseInt(time2[1]) > 59
        ) {
            resErrors.value.push(["O horário não é válido."]);
            return false;
        }

        // Convert time values to integers for comparison
        const hour1 = parseInt(time[0]);
        const minute1 = parseInt(time[1]);
        const hour2 = parseInt(time2[0]);
        const minute2 = parseInt(time2[1]);

        // Check if the time is smaller than the next one
        if (hour1 > hour2 || (hour1 === hour2 && minute1 >= minute2)) {
            resErrors.value.push([
                "O horário de abertura não pode ser maior ou igual que o de fecho.",
            ]);
            return false;
        }
    }
    return true;
}

const editService = () => {
    if (!validateSchedule()) {
        return;
    }
    serviceStore
        .editService(router.currentRoute.value.params?.id, {
            name: service.value.name,
            nameEN: service.value.nameEN,
            type: service.value.type,
            email: form.value.email,
            phone: form.value.phone,
            schedule: form.value.schedule,
            occupation: form.value.occupation,
            location: form.value.location,
            limit: form.value.limit,
            description: form.value.description,
            descriptionEN: form.value.descriptionEN,
            menu: form.value.menu,
            active: form.value.active == true ? 1 : 0,
        })
        .then((response) => {
            resErrors.value = [];
            if (response.status === 200) {
                notifText.value = response.data.message;
                update.value = false;
                statusService.value = true;
                setTimeout(() => {
                    statusService.value = false;
                }, 5000);
            } else {
                resErrors.value = response.response.data.errors;
                statusService.value = false;
            }
        })
        .catch(() => {
            notifText.value = "Ocorreu um erro ao atualizar o serviço.";
            statusService.value = false;
        });
};

const cancel = () => {
    update.value = false;
    fillForm(service.value);
};

function serviceIcon() {
    switch (service.value?.id) {
        case 1:
            return mdiVacuum;
        case 2:
            return mdiPaperRoll;
        case 3:
            return mdiFoodTurkey;
        case 4:
            return mdiSilverwareForkKnife;
        case 5:
            return mdiSpa;
        case 6:
            return mdiWeightLifter;
        default:
            return mdiNewspaperVariant;
    }
}

const filter = ref(
    service.value?.type == "F"
        ? selectOptionsFilterFood[0]
        : selectOptionsFilterObjects[0]
);
const order = ref(selectOptionsOrder[0]);
const search = ref("");
const searchButton = ref(false);

watch(filter, async (value) => {
    if (value.value != serviceStore.filterTableItems) {
        hasItems.value = await serviceStore.getItemsService(
            router.currentRoute.value.params?.id,
            0,
            value.value
        );
        setTimeout(() => {
            serviceStore.filterTableItems = value.value;
        }, 200);
    }
});

watch(order, (value) => {
    serviceStore.orderTableItems = value.value;
});

watchEffect(() => {
    if (serviceStore.filterTableItems) {
        if (service.value?.type == "F") {
            filter.value = selectOptionsFilterFood.find(
                (option) => option.value === serviceStore.filterTableItems
            );
        } else {
            filter.value = selectOptionsFilterObjects.find(
                (option) => option.value === serviceStore.filterTableItems
            );
        }
    }
});

watchEffect(() => {
    if (serviceStore.orderTableItems) {
        order.value = selectOptionsOrder.find(
            (option) => option.value === serviceStore.orderTableItems
        );
    }
});

const onFileChange = (e) => {
    if (e.target.files.length > 0) {
        form.value.menu = e.target.files[0];
    } else {
        form.value.menu = null;
    }
};

function open(menu_url) {
    window.open(`${serverUrl}/storage/services/` + menu_url, "_blank");
}
</script>

<template>
    <LayoutAuthenticated>
        <CardBoxItem
            :active="isModalActiveCreate"
            @update:active="isModalActiveCreate = $event"
        />
        <CardBoxAssociateItem
            :active="isModalAssociateCreate"
            :service-id="service?.id"
            @update:active="isModalAssociateCreate = $event"
        />
        <SectionMain>
            <SectionTitleLine
                :icon="serviceIcon(service?.id)"
                :title="service?.name ?? 'Serviço'"
                main
            >
                <FormCheckRadio
                    v-model="form.active"
                    class="font-semibold mr-8"
                    name="anon-switch"
                    type="switch"
                    label="Ativo"
                    input-value="active"
                    :disabled="!update"
                    :class="!update ? 'cursor-not-allowed opacity-80' : ''"
                />
            </SectionTitleLine>
            <CardBox class="mb-6" is-form @submit.prevent="editService">
                <FormValidationErrors
                    v-if="statusService == false"
                    :errors="resErrors"
                />
                <Transition name="fade">
                    <NotificationBarInCard v-if="statusService" color="success">
                        <b>{{ notifText }}</b>
                    </NotificationBarInCard>
                </Transition>
                <FormField flex>
                    <FormField
                        label="Nome do Serviço"
                        class="w-full md:w-2/4 mb-4 sm:mb-0"
                        label-for="nameService"
                        help="O nome do serviço. Obrigatório."
                    >
                        <FormControl
                            id="nameService"
                            :model-value="service?.name"
                            :icon="mdiText"
                            name="name"
                            autocomplete="name"
                            disabled
                            required
                        />
                    </FormField>
                    <FormField
                        label="Nome do Serviço (Inglês)"
                        class="w-full md:w-2/4 mb-4 sm:mb-0"
                        label-for="nameServiceEN"
                        help="O nome do serviço em inglês. Obrigatório."
                    >
                        <FormControl
                            id="nameServiceEN"
                            :model-value="service?.nameEN"
                            :icon="mdiText"
                            name="nameEN"
                            autocomplete="name"
                            disabled
                            required
                        />
                    </FormField>
                </FormField>
                <BaseDivider />
                <FormField flex>
                    <FormField
                        label="Email"
                        class="w-full md:w-2/4 mb-4 sm:mb-0"
                        label-for="email"
                        help="O email do serviço. Opcional"
                    >
                        <FormControl
                            id="email"
                            v-model="form.email"
                            :icon="mdiEmail"
                            name="email"
                            autocomplete="email"
                            :disabled="!update"
                            :placeholder="
                                form.email.length === 0 ? 'Não definido' : ''
                            "
                        />
                    </FormField>
                    <FormField
                        label="Nº Telefone"
                        class="w-full md:w-2/4 mb-4 sm:mb-0"
                        label-for="phone"
                        help="O número de telefone do serviço. Opcional"
                    >
                        <FormControl
                            id="phone"
                            v-model="form.phone"
                            :icon="mdiPhone"
                            name="phone"
                            autocomplete="phone"
                            :disabled="!update"
                            :placeholder="
                                form.phone.length === 0 ? 'Não definido' : ''
                            "
                        />
                    </FormField>
                </FormField>
                <FormField flex>
                    <FormField
                        label="Horário de Funcionamento"
                        class="w-full md:w-3/4 mb-4 sm:mb-0"
                        help="O horário de funcionamento. Ex: 8:30-12:00-14:00-20:15 ou 9:30-21:00. Sempre em pares. Obrigatório."
                        label-for="schedule"
                    >
                        <FormControl
                            id="schedule"
                            v-model="form.schedule"
                            :icon="mdiStoreClock"
                            name="schedule"
                            autocomplete="schedule"
                            :disabled="!update"
                            required
                        />
                    </FormField>
                    <FormField
                        :label="
                            service.type == 'R'
                                ? 'Limite de Pessoas (Reserva)'
                                : 'Limite de Pedidos (Hora)'
                        "
                        class="w-full md:w-1/4 mb-4 sm:mb-0"
                        label-for="limit"
                        :help="
                            service.type == 'R'
                                ? 'O limite de pessoas por reserva. Opcional'
                                : 'O limite de pedidos por hora. Opcional'
                        "
                    >
                        <FormControl
                            id="limit"
                            v-model="form.limit"
                            :icon="mdiClockTimeEleven"
                            name="limit"
                            autocomplete="limit"
                            type="number"
                            :disabled="!update"
                            :placeholder="
                                form.limit.length === 0 ? 'Não definido' : ''
                            "
                        />
                    </FormField>
                </FormField>
                <FormField
                    v-if="service?.type == 'R' || service?.type == 'O'"
                    flex
                >
                    <FormField
                        label="Ocupação"
                        class="w-full md:w-2/4 mb-4 sm:mb-0"
                        label-for="occupation"
                        help="A ocupação do serviço. Opcional"
                    >
                        <FormControl
                            id="occupation"
                            v-model="form.occupation"
                            :icon="mdiStoreClock"
                            name="occupation"
                            autocomplete="occupation"
                            :disabled="!update"
                            :placeholder="
                                form.occupation.length === 0
                                    ? 'Não definida'
                                    : ''
                            "
                        />
                    </FormField>
                    <FormField
                        label="Localização"
                        class="w-full md:w-2/4 mb-4 sm:mb-0"
                        label-for="location"
                        help="A localização do serviço. Opcional"
                    >
                        <FormControl
                            id="location"
                            v-model="form.location"
                            :icon="mdiClockTimeEleven"
                            name="location"
                            autocomplete="location"
                            :disabled="!update"
                            :placeholder="
                                form.location.length === 0 ? 'Não definida' : ''
                            "
                        />
                    </FormField>
                </FormField>
                <BaseDivider />
                <FormField
                    label="Descrição"
                    label-for="description"
                    help="A descrição do serviço. Obrigatória"
                >
                    <FormControl
                        id="description"
                        v-model="form.description"
                        :icon="mdiTextBox"
                        name="description"
                        autocomplete="description"
                        type="textarea"
                        :disabled="!update"
                        required
                    />
                </FormField>
                <FormField
                    label="Descrição (Inglês)"
                    label-for="descriptionEN"
                    help="A descrição do serviço em inglês. Obrigatória"
                >
                    <FormControl
                        id="descriptionEN"
                        v-model="form.descriptionEN"
                        :icon="mdiTextBox"
                        name="descriptionEN"
                        autocomplete="descriptionEN"
                        type="textarea"
                        :disabled="!update"
                        required
                    />
                </FormField>
                <FormField
                    v-if="
                        service?.type == 'R' ||
                        service?.type == 'B' ||
                        service?.type == 'F'
                    "
                    flex
                >
                    <FormField
                        label="Menu"
                        help="Menu do serviço em PDF. Obrigatório"
                        label-for="menu"
                        class="w-10/12 md:w-11/12 mb-4 sm:mb-0"
                    >
                        <FormControl
                            id="menu"
                            :icon="mdiFile"
                            name="menu"
                            type="file"
                            accept="application/pdf"
                            :disabled="!update"
                            :required="
                                form.menu_url == null || form.menu_url == ''
                            "
                            @change="onFileChange"
                        />
                    </FormField>
                    <BaseButtons class="w-1/12" type="justify-center" no-wrap>
                        <BaseButton
                            :color="
                                form.menu_url == null || form.menu_url == ''
                                    ? 'danger'
                                    : 'info'
                            "
                            :icon="mdiEye"
                            :title="
                                form.menu_url == null || form.menu_url == ''
                                    ? 'Não Existe Menu Atual'
                                    : 'Ver Menu Atual'
                            "
                            class="w-10 h-10 flex-initial mt-3"
                            outline
                            rounded-full
                            :disabled="
                                form.menu_url == null || form.menu_url == ''
                            "
                            @click="open(form.menu_url)"
                        />
                    </BaseButtons>
                </FormField>
                <template #footer>
                    <div class="relative">
                        <BaseButtons v-if="update == false && user.role != 'E'">
                            <BaseButton
                                color="success"
                                label="Alterar"
                                :icon="mdiLockCheck"
                                @click="update = true"
                            />
                        </BaseButtons>

                        <BaseButtons v-if="update == true && user.role != 'E'">
                            <BaseButton
                                type="submit"
                                color="success"
                                label="Confirmar"
                                :icon="mdiContentSaveCheck"
                            />
                            <BaseButton
                                color="info"
                                label="Cancelar"
                                outline
                                :icon="mdiCancel"
                                @click="cancel()"
                            />
                        </BaseButtons>
                        <span
                            class="static text-zinc-500 right-0 bottom-0 mb-4 text-center sm:text-right sm:absolute"
                            >Última Atualização: {{ service?.updated_at }}</span
                        >
                    </div>
                </template>
            </CardBox>
            <SectionTitleLine
                v-if="hasItems"
                :icon="mdiBookOpenPageVariant"
                :title="
                    service?.id == 2
                        ? 'Menu de Objetos'
                        : service?.id == 3
                        ? 'Menu de Alimentos'
                        : 'Menu do Serviço'
                "
                class="mt-2"
            >
                <div class="flex mr-0 sm:mr-12 lg:mr-8">
                    <div class="flex flex-col lg:flex-row">
                        <b class="my-auto mr-4">Ordenar:</b>
                        <FormControl
                            id="order"
                            v-model="order"
                            class="w-44 mr-0 lg:mr-4 mb-2 lg:mb-0"
                            :options="selectOptionsOrder"
                            :icon="
                                order.value === 'DESC'
                                    ? mdiOrderNumericDescending
                                    : mdiOrderNumericAscending
                            "
                        />
                        <b class="my-auto mr-4">Filtrar:</b>
                        <FormControl
                            id="filter"
                            v-model="filter"
                            class="w-44 mr-0 lg:mr-4 mb-2 lg:mb-0"
                            :options="
                                service?.type == 'F'
                                    ? selectOptionsFilterFood
                                    : selectOptionsFilterObjects
                            "
                            :icon="mdiFilterMultiple"
                        />
                        <FormControl
                            id="search"
                            v-model="search"
                            class="w-36 mr-0 lg:mr-4 mb-2 lg:mb-0"
                            :icon="mdiMagnify"
                            :placeholder="'Pesquisar'"
                            @keyup.enter="searchButton = true"
                            @focusout="searchButton = true"
                        />
                        <BaseButtons
                            v-if="user.role != 'E'"
                            class="justify-center"
                        >
                            <BaseButton
                                :icon="mdiBookPlus"
                                label="Adicionar"
                                class="mt-2 lg:mt-0"
                                color="success"
                                rounded-full
                                small
                                @click="isModalAssociateCreate = true"
                            />
                        </BaseButtons>
                    </div>
                </div>
            </SectionTitleLine>
            <CardBox
                v-if="service?.id == 2 || service?.id == 3"
                class="mb-6"
                has-table
            >
                <TableItems
                    v-if="hasItems"
                    :service-id="service?.id"
                    :filter="filter.value"
                    :order="order.value"
                    :search="search"
                    :search-button="searchButton"
                    @button:search="searchButton = $event"
                />
                <CardBoxComponentEmpty
                    v-else
                    message="Sem objetos associados..."
                />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>

<style>
.fade-leave-active {
    transition: all 1s ease;
}
.fade-leave-to {
    opacity: 0;
}
</style>
