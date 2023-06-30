<script setup>
import {
    mdiRoomService,
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
    mdiCube,
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
import NotificationBar from "@/components/Others/NotificationBar.vue";
import FormValidationErrors from "@/components/Forms/FormValidationErrors.vue";
import { onMounted, ref, watch } from "vue";
import { useServiceStore } from "@/stores/service";
import { useRouter } from "vue-router";
import TableItems from "@/components/Tables/TableItems.vue";

const router = useRouter();

const serviveStore = useServiceStore();
const hasItems = ref(false);
const update = ref(false);
const service = ref([]);

const form = ref({
    email: null,
    phone: null,
    schedule: "",
    occupation: null,
    location: null,
    limit: null,
    description: "",
    descriptionEN: "",
    menu_url: null,
});

onMounted(() => {
    serviveStore
        .getService(router.currentRoute.value.params?.id)
        .then((response) => {
            fillForm(response);
        });
});

watch(
    () => router.currentRoute.value.params?.id,
    () => {
        update.value = false;
        serviveStore
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
    form.value.email = response.email;
    form.value.phone = response.phone;
    form.value.schedule = response.schedule;
    form.value.occupation = response.occupation;
    form.value.location = response.location;
    form.value.limit = response.limit;
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
    serviveStore
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
            notifText.value = "Ocorreu um erro ao atualiar o serviço.";
            isErrorNotifActive.value = true;
            setTimeout(function () {
                isErrorNotifActive.value = false;
            }, 5000);
        });
};
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLine
                :icon="mdiRoomService"
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
                        help="O nome do serviço."
                    >
                        <FormControl
                            id="name"
                            :model-value="service?.name"
                            :icon="mdiText"
                            name="name"
                            autocomplete="name"
                            disabled
                        />
                    </FormField>
                    <FormField
                        label="Nome do Serviço em Inglês"
                        class="w-full md:w-2/4 mb-4 sm:mb-0"
                        label-for="nameEN"
                        help="O nome do serviço em inglês."
                    >
                        <FormControl
                            id="nameEN"
                            :model-value="service?.nameEN"
                            :icon="mdiText"
                            name="nameEN"
                            autocomplete="nameEN"
                            disabled
                        />
                    </FormField>
                </FormField>
                <BaseDivider />
                <FormField flex>
                    <FormField
                        label="Email"
                        class="w-full md:w-2/4 mb-4 sm:mb-0"
                        label-for="email"
                        help="O email do serviço. Opicional"
                    >
                        <FormControl
                            id="email"
                            v-model="form.email"
                            :icon="mdiEmail"
                            name="email"
                            autocomplete="email"
                            :disabled="!update"
                        />
                    </FormField>
                    <FormField
                        label="Nº de Telefone"
                        class="w-full md:w-2/4 mb-4 sm:mb-0"
                        label-for="phone"
                        help="O número de telefone. Opicional"
                    >
                        <FormControl
                            id="phone"
                            v-model="form.phone"
                            :icon="mdiPhone"
                            name="phone"
                            autocomplete="phone"
                            :disabled="!update"
                        />
                    </FormField>
                </FormField>
                <FormField flex>
                    <FormField
                        label="Horário de Funcionamento"
                        class="w-full md:w-2/4 mb-4 sm:mb-0"
                        aria-placeholder="Ex: 08:00 - 20:00"
                        help="O horário de funcionamento. Obrigatório"
                        label-for="schedule"
                    >
                        <FormControl
                            id="schedule"
                            v-model="form.schedule"
                            :icon="mdiStoreClock"
                            name="schedule"
                            autocomplete="schedule"
                            :disabled="!update"
                        />
                    </FormField>
                    <FormField
                        label="Limite de Pedidos (Hora)"
                        class="w-full md:w-2/4 mb-4 sm:mb-0"
                        label-for="limit"
                        help="O limite de pedidos por hora. Opicional"
                    >
                        <FormControl
                            id="limit"
                            v-model="form.limit"
                            :icon="mdiClockTimeEleven"
                            name="limit"
                            autocomplete="limit"
                            type="number"
                            :disabled="!update"
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
                        help="Ocupação do serviço. Opicional"
                    >
                        <FormControl
                            id="occupation"
                            v-model="form.occupation"
                            :icon="mdiStoreClock"
                            name="occupation"
                            autocomplete="occupation"
                            :disabled="!update"
                        />
                    </FormField>
                    <FormField
                        label="Localização"
                        class="w-full md:w-2/4 mb-4 sm:mb-0"
                        label-for="location"
                        help="Localização do serviço. Opicional"
                    >
                        <FormControl
                            id="location"
                            v-model="form.location"
                            :icon="mdiClockTimeEleven"
                            name="location"
                            autocomplete="location"
                            :disabled="!update"
                        />
                    </FormField>
                </FormField>
                <BaseDivider />
                <FormField
                    label="Descrição"
                    label-for="description"
                    help="A descrição. Obrigatória"
                >
                    <FormControl
                        id="description"
                        v-model="form.description"
                        :icon="mdiTextBox"
                        name="description"
                        autocomplete="description"
                        type="textarea"
                        :disabled="!update"
                    />
                </FormField>
                <FormField
                    label="Descrição em Inglês"
                    label-for="descriptionEN"
                    help="A descrição em Inglês. Obrigatória"
                >
                    <FormControl
                        id="description"
                        v-model="form.descriptionEN"
                        :icon="mdiTextBox"
                        name="descriptionEN"
                        autocomplete="descriptionEN"
                        type="textarea"
                        :disabled="!update"
                    />
                </FormField>
                <FormField
                    label="Menu"
                    help="Menu do Serviço em PDF. Opcional"
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
                                @click="update = false"
                            />
                        </BaseButtons>
                    </div>
                </template>
            </CardBox>
            <SectionTitleLine
                v-if="hasItems"
                :icon="mdiCube"
                title="Objetos do Serviço"
                class="mt-2"
            />
            <CardBox v-if="hasItems">
                <TableItems :service-id="service?.id" />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
