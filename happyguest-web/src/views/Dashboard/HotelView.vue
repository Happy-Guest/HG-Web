<script setup>
import {
    mdiLockCheck,
    mdiTextBox,
    mdiEmail,
    mdiPhone,
    mdiCancel,
    mdiContentSaveCheck,
    mdiMapMarker,
    mdiSitemap,
    mdiHumanCapacityDecrease,
    mdiInformationVariant,
    mdiHuman,
    mdiHomeAnalytics,
    mdiStarBoxMultiple,
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
import NotificationBarInCard from "@/components/Others/NotificationBarInCard.vue";
import FormValidationErrors from "@/components/Forms/FormValidationErrors.vue";
import { onMounted, ref } from "vue";
import { useInfoStore } from "@/stores/info";

const infoStore = useInfoStore();
const update = ref(false);
const hotel = ref([]);
const statusHotel = ref(false);
const resErrors = ref([]);
const notifText = ref("");

const form = ref({
    email: "",
    phone: "",
    address: "",
    capacity: null,
    website: null,
    policies: null,
    policiesEN: null,
    access: null,
    accessEN: null,
    description: "",
    descriptionEN: "",
    commodities: null,
    commoditiesEN: null,
});

onMounted(() => {
    infoStore.getHotel().then((response) => {
        fillForm(response);
    });
});

const fillForm = (response) => {
    hotel.value = response;
    form.value.email = response.email;
    form.value.phone = response.phone;
    form.value.address = response.address;
    form.value.capacity = response.capacity;
    form.value.website = response.website;
    form.value.policies = response.policies;
    form.value.policiesEN = response.policiesEN;
    form.value.access = response.access;
    form.value.accessEN = response.accessEN;
    form.value.description = response.description;
    form.value.descriptionEN = response.descriptionEN;
    form.value.commodities = response.commodities;
    form.value.commoditiesEN = response.commoditiesEN;
};

const editHotel = () => {
    infoStore
        .updateHotel({
            email: form.value.email,
            phone: form.value.phone,
            address: form.value.address,
            capacity: form.value.capacity,
            website: form.value.website,
            policies: form.value.policies,
            policiesEN: form.value.policiesEN,
            access: form.value.access,
            accessEN: form.value.accessEN,
            description: form.value.description,
            descriptionEN: form.value.descriptionEN,
            commodities: form.value.commodities,
            commoditiesEN: form.value.commoditiesEN,
        })
        .then((response) => {
            resErrors.value = [];
            if (response.status === 200) {
                hotel.value = response.data.hotel;
                notifText.value = response.data.message;
                update.value = false;
                statusHotel.value = true;
                setTimeout(() => {
                    statusHotel.value = false;
                }, 5000);
            } else {
                resErrors.value = response.response.data.errors;
                statusHotel.value = false;
            }
        })
        .catch(() => {
            notifText.value = "Ocorreu um erro ao atualizar o hotel.";
            statusHotel.value = false;
        });
};

const cancel = () => {
    update.value = false;
    fillForm(hotel.value);
};
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLine :icon="mdiHomeAnalytics" title="Hotel" main />

            <CardBox class="mb-6" is-form @submit.prevent="editHotel">
                <FormValidationErrors
                    v-if="statusHotel == false"
                    :errors="resErrors"
                />
                <Transition name="fade">
                    <NotificationBarInCard v-if="statusHotel" color="success">
                        <b>{{ notifText }}</b>
                    </NotificationBarInCard>
                </Transition>
                <FormField flex>
                    <FormField
                        label="Email"
                        class="w-full md:w-2/4 mb-4 sm:mb-0"
                        label-for="email"
                        help="O email principal do hotel. Obrigatório"
                    >
                        <FormControl
                            id="email"
                            v-model="form.email"
                            :icon="mdiEmail"
                            name="email"
                            :disabled="!update"
                            autocomplete="email"
                            required
                        />
                    </FormField>
                    <FormField
                        label="Nº Telefone"
                        class="w-full md:w-2/4 mb-4 sm:mb-0"
                        label-for="phone"
                        help="O número de telefone principal do hotel. Obrigatório"
                    >
                        <FormControl
                            id="phone"
                            v-model="form.phone"
                            :icon="mdiPhone"
                            name="phone"
                            :disabled="!update"
                            autocomplete="phone"
                            required
                        />
                    </FormField>
                </FormField>
                <FormField flex>
                    <FormField
                        label="Morada"
                        class="w-full md:w-2/4 mb-4 sm:mb-0"
                        label-for="address"
                        help="A Morada do hotel. Obrigatória"
                    >
                        <FormControl
                            id="address"
                            v-model="form.address"
                            :icon="mdiMapMarker"
                            name="address"
                            :disabled="!update"
                            autocomplete="address"
                            required
                        />
                    </FormField>
                    <FormField
                        label="Capacidade"
                        class="w-full md:w-2/4 mb-4 sm:mb-0"
                        label-for="capacity"
                        help="A capacidade do hotel. Opcional"
                    >
                        <FormControl
                            id="capacity"
                            v-model="form.capacity"
                            :icon="mdiHumanCapacityDecrease"
                            name="capacity"
                            :disabled="!update"
                            autocomplete="capacity"
                            :placeholder="
                                form.capacity == null ? 'Não definido' : ''
                            "
                        />
                    </FormField>
                </FormField>
                <FormField
                    label="Website"
                    class="w-full"
                    label-for="website"
                    help="O website do hotel. Opcional"
                >
                    <FormControl
                        id="website"
                        v-model="form.website"
                        :icon="mdiSitemap"
                        name="website"
                        :disabled="!update"
                        autocomplete="website"
                        :placeholder="
                            form.website == null ? 'Não definido' : ''
                        "
                    />
                </FormField>
                <BaseDivider />
                <FormField
                    label="Comodidades"
                    class="w-full"
                    label-for="commodities"
                    help="As comodidades do hotel. Separadas por vírgula. Opcionais"
                >
                    <FormControl
                        id="commodities"
                        v-model="form.commodities"
                        :icon="mdiStarBoxMultiple"
                        type="textarea"
                        name="commodities"
                        :disabled="!update"
                        autocomplete="commodities"
                        :placeholder="
                            form.commodities == null ? 'Não definidas' : ''
                        "
                    />
                </FormField>
                <FormField
                    label="Comodidades (Inglês)"
                    class="w-full"
                    label-for="commoditiesEN"
                    help="As comodidades do hotel em inglês. Separadas por vírgula. Opcionais"
                >
                    <FormControl
                        id="commoditiesEN"
                        v-model="form.commoditiesEN"
                        :icon="mdiStarBoxMultiple"
                        type="textarea"
                        name="commoditiesEN"
                        :disabled="!update"
                        autocomplete="commoditiesEN"
                        :placeholder="
                            form.commoditiesEN == null ? 'Não definidas' : ''
                        "
                        :required="form.commodities != null"
                    />
                </FormField>
                <BaseDivider />
                <FormField
                    label="Descrição"
                    label-for="description"
                    help="Uma descrição do hotel. Obrigatória"
                >
                    <FormControl
                        id="description"
                        v-model="form.description"
                        :icon="mdiTextBox"
                        name="description"
                        :disabled="!update"
                        autocomplete="description"
                        type="textarea"
                        required
                    />
                </FormField>
                <FormField
                    label="Descrição (Inglês)"
                    label-for="descriptionEN"
                    help="Uma descrição do hotel em inglês. Obrigatória"
                >
                    <FormControl
                        id="descriptionEN"
                        v-model="form.descriptionEN"
                        :icon="mdiTextBox"
                        name="descriptionEN"
                        :disabled="!update"
                        autocomplete="descriptionEN"
                        type="textarea"
                        required
                    />
                </FormField>
                <BaseDivider />
                <FormField
                    label="Políticas do Hotel"
                    class="w-full"
                    label-for="policies"
                    help="As politicas do hotel. Separadas por vírgula. Opcionais"
                >
                    <FormControl
                        id="policies"
                        v-model="form.policies"
                        :icon="mdiInformationVariant"
                        type="textarea"
                        name="policies"
                        :disabled="!update"
                        autocomplete="policies"
                        :placeholder="
                            form.policies == null ? 'Não definidas' : ''
                        "
                    />
                </FormField>
                <FormField
                    label="Políticas do Hotel (Inglês)"
                    class="w-full"
                    label-for="policiesEN"
                    help="As politicas do hotel em inglês. Separadas por vírgula. Opcionais"
                >
                    <FormControl
                        id="policiesEN"
                        v-model="form.policiesEN"
                        :icon="mdiInformationVariant"
                        type="textarea"
                        name="policiesEN"
                        :disabled="!update"
                        autocomplete="policiesEN"
                        :placeholder="
                            form.policiesEN == null ? 'Não definidas' : ''
                        "
                        :required="form.policies != null"
                    />
                </FormField>
                <BaseDivider />
                <FormField
                    label="Informações de Acesso"
                    class="w-full"
                    label-for="access"
                    help="As informações de acesso ao hotel. Separadas por vírgula. Opcionais"
                >
                    <FormControl
                        id="access"
                        v-model="form.access"
                        :icon="mdiHuman"
                        type="textarea"
                        name="access"
                        :disabled="!update"
                        autocomplete="access"
                        :placeholder="
                            form.access == null ? 'Não definidas' : ''
                        "
                    />
                </FormField>
                <FormField
                    label="Informações de Acesso (Inglês)"
                    class="w-full"
                    label-for="accessEN"
                    help="As informações de acesso ao hotel em inglês. Separadas por vírgula. Opcionais"
                >
                    <FormControl
                        id="accessEN"
                        v-model="form.accessEN"
                        :icon="mdiHuman"
                        type="textarea"
                        name="accessEN"
                        :disabled="!update"
                        autocomplete="accessEN"
                        :placeholder="
                            form.accessEN == null ? 'Não definidas' : ''
                        "
                        :required="form.access != null"
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
                            >Última Atualização: {{ hotel?.updated_at }}</span
                        >
                    </div>
                </template>
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
