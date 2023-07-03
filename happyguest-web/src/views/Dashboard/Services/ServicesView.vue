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
    mdiCheckCircle,
    mdiAlertCircle,
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
import NotificationBar from "@/components/Others/NotificationBar.vue";
import FormValidationErrors from "@/components/Forms/FormValidationErrors.vue";
import { onMounted, ref, watch, watchEffect } from "vue";
import { useServiceStore } from "@/stores/service";
import { useRouter } from "vue-router";
import TableItems from "@/components/Tables/TableItems.vue";

const router = useRouter();

const serviceStore = useServiceStore();
const hasItems = ref(false);
const update = ref(false);
const service = ref([]);

const selectOptionsFilterObjects = [
    { value: "ALL", label: "Todos" },
    { value: "room", label: "Quarto" },
    { value: "bathroom", label: "Casa Banho" },
    { value: "other", label: "Outros" },
];

const selectOptionsFilterFood = [
    { value: "ALL", label: "Todos" },
    { value: "drink", label: "Bebidas" },
    { value: "breakfast", label: "P. Almoço" },
    { value: "lunch", label: "Almoço" },
    { value: "dinner", label: "Jantar" },
    { value: "snack", label: "Lanches" },
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
    hasItems.value = response.items.length > 0;
};

const notifText = ref("");
const resErrors = ref([]);
const isSuccessNotifActive = ref(false);
const isErrorNotifActive = ref(false);

const editService = () => {
    serviceStore
        .editService(router.currentRoute.value.params?.id, {
            email: form.value.email,
            phone: form.value.phone,
            schedule: form.value.schedule,
            occupation: form.value.occupation,
            location: form.value.location,
            limit: form.value.limit,
            description: form.value.description,
            descriptionEN: form.value.descriptionEN,
            menu_url: form.value.menu_url,
        })
        .then((response) => {
            resErrors.value = [];
            if (response.status === 200) {
                notifText.value = response.data.message;
                update.value = false;
                isSuccessNotifActive.value = true;
                setTimeout(function () {
                    isSuccessNotifActive.value = false;
                }, 5000);
            } else {
                resErrors.value = response.response.data.errors;
            }
        })
        .catch(() => {
            notifText.value = "Ocorreu um erro ao atualizar o serviço.";
            isErrorNotifActive.value = true;
            setTimeout(function () {
                isErrorNotifActive.value = false;
            }, 5000);
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
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLine
                :icon="serviceIcon(service?.id)"
                :title="service?.name ?? 'Serviço'"
                main
            />
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
            <CardBox class="mb-6" is-form @submit.prevent="editService">
                <FormValidationErrors :errors="resErrors" />
                <FormField flex>
                    <FormField
                        label="Nome do Serviço"
                        class="w-full md:w-2/4 mb-4 sm:mb-0"
                        label-for="name"
                        help="O nome do serviço. Obrigatório."
                    >
                        <FormControl
                            id="name"
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
                        label-for="nameEN"
                        help="O nome do serviço em inglês. Obrigatório."
                    >
                        <FormControl
                            id="nameEN"
                            :model-value="service?.nameEN"
                            :icon="mdiText"
                            name="nameEN"
                            autocomplete="nameEN"
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
                        aria-placeholder="Ex: 08:00 - 20:00"
                        help="O horário de funcionamento. Ex: 8-12-14-20. Obrigatório."
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
                        label="Limite de Pedidos (Hora)"
                        class="w-full md:w-1/4 mb-4 sm:mb-0"
                        label-for="limit"
                        help="O limite de pedidos por hora. Opcional"
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
                    v-if="service?.type == 'R' || service?.type == 'B'"
                    label="Menu"
                    help="Menu do serviço em PDF. Obrigatório"
                    label-for="menu"
                >
                    <FormControl
                        id="menu"
                        v-model="form.menu_url"
                        :icon="mdiFile"
                        name="menu"
                        type="file"
                        accept="application/pdf"
                        :disabled="!update"
                        required
                    />
                </FormField>
                <template #footer>
                    <div class="relative">
                        <BaseButtons v-if="update == false">
                            <BaseButton
                                color="success"
                                label="Alterar"
                                :icon="mdiLockCheck"
                                @click="update = true"
                            />
                        </BaseButtons>

                        <BaseButtons v-if="update == true">
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
                            class="w-48 mr-0 lg:mr-4 mb-2 lg:mb-0"
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
                            class="w-48 mr-0 lg:mr-4 mb-2 lg:mb-0"
                            :options="
                                service?.type == 'F'
                                    ? selectOptionsFilterFood
                                    : selectOptionsFilterObjects
                            "
                            :icon="mdiFilterMultiple"
                        />
                    </div>
                </div>
            </SectionTitleLine>
            <CardBox class="mb-6" has-table>
                <TableItems
                    v-if="hasItems"
                    :service-id="service?.id"
                    :filter="filter.value"
                    :order="order.value"
                />
                <CardBoxComponentEmpty
                    v-else
                    message="Sem objetos associados..."
                />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
