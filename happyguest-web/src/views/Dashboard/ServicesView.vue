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
import { onMounted, ref, watch } from "vue";
import { useServiceStore } from "@/stores/service";
import { useRouter } from "vue-router";
import TableItems from "@/components/Tables/TableItems.vue";

const router = useRouter();

const serviveStore = useServiceStore();
const hasItems = ref(false);

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

const editService = () => {
    console.log(form.value);
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
        .then(() => {
            console.log("Serviço editado");
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
            <CardBox class="mb-6" is-form @submit.prevent="editService">
                <FormField flex>
                    <FormField
                        label="Nome do Serviço"
                        class="w-full md:w-2/4 mb-4 sm:mb-0"
                        label-for="name"
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
                    >
                        <FormControl
                            id="email"
                            v-model="form.email"
                            :icon="mdiEmail"
                            name="email"
                            autocomplete="email"
                        />
                    </FormField>
                    <FormField
                        label="Nº de Telefone"
                        class="w-full md:w-2/4 mb-4 sm:mb-0"
                        label-for="phone"
                    >
                        <FormControl
                            id="phone"
                            v-model="form.phone"
                            :icon="mdiPhone"
                            name="phone"
                            autocomplete="phone"
                        />
                    </FormField>
                </FormField>
                <FormField flex>
                    <FormField
                        label="Horário de Funcionamento"
                        class="w-full md:w-2/4 mb-4 sm:mb-0"
                        help="Ex: 8-12-14-18"
                        label-for="schedule"
                    >
                        <FormControl
                            id="schedule"
                            v-model="form.schedule"
                            :icon="mdiStoreClock"
                            name="schedule"
                            autocomplete="schedule"
                        />
                    </FormField>
                    <FormField
                        label="Limite de Pedidos (Hora)"
                        class="w-full md:w-2/4 mb-4 sm:mb-0"
                        label-for="limit"
                    >
                        <FormControl
                            id="limit"
                            v-model="form.limit"
                            :icon="mdiClockTimeEleven"
                            name="limit"
                            autocomplete="limit"
                            type="number"
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
                    >
                        <FormControl
                            id="occupation"
                            v-model="form.occupation"
                            :icon="mdiStoreClock"
                            name="occupation"
                            autocomplete="occupation"
                        />
                    </FormField>
                    <FormField
                        label="Localização"
                        class="w-full md:w-2/4 mb-4 sm:mb-0"
                        label-for="location"
                    >
                        <FormControl
                            id="location"
                            v-model="form.location"
                            :icon="mdiClockTimeEleven"
                            name="location"
                            autocomplete="location"
                        />
                    </FormField>
                </FormField>
                <BaseDivider />
                <FormField label="Descrição" label-for="description">
                    <FormControl
                        id="description"
                        v-model="form.description"
                        :icon="mdiTextBox"
                        name="description"
                        autocomplete="description"
                        type="textarea"
                    />
                </FormField>
                <FormField
                    label="Descrição em Inglês"
                    label-for="descriptionEN"
                >
                    <FormControl
                        id="description"
                        v-model="form.descriptionEN"
                        :icon="mdiTextBox"
                        name="descriptionEN"
                        autocomplete="descriptionEN"
                        type="textarea"
                    />
                </FormField>
                <FormField
                    label="Menu"
                    help="Menu do Serviço em PDF"
                    label-for="menu"
                >
                    <FormControl
                        id="menu"
                        v-model="form.menu_url"
                        :icon="mdiFile"
                        name="menu"
                        type="file"
                        accept="application/pdf"
                    />
                </FormField>
                <template #footer>
                    <BaseButtons>
                        <BaseButton
                            type="submit"
                            color="success"
                            label="Alterar"
                            :icon="mdiLockCheck"
                        />
                    </BaseButtons>
                </template>
            </CardBox>
            <CardBox v-if="hasItems">
                <TableItems :service-id="service?.id" />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
