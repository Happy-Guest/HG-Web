<script setup>
import {
    mdiLockCheck,
    mdiTextBox,
    mdiCancel,
    mdiContentSaveCheck,
    mdiForest,
    mdiCursorText,
    mdiHumanCapacityDecrease,
    mdiMapMarkerDistance,
    mdiClose,
    mdiBookPlus,
    mdiMapMarker,
    mdiEye,
} from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Sections/SectionMain.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import FormField from "@/components/Forms/FormField.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import NotificationBarInCard from "@/components/Others/NotificationBarInCard.vue";
import FormValidationErrors from "@/components/Forms/FormValidationErrors.vue";
import { onMounted, ref } from "vue";
import { useInfoStore } from "@/stores/info";
import { useAuthStore } from "@/stores/auth";
import BaseDivider from "@/components/Bases/BaseDivider.vue";

const infoStore = useInfoStore();
const user = useAuthStore().user;

const update = ref(false);
const region = ref([]);
const statusRegion = ref(false);
const resErrors = ref([]);
const notifText = ref("");

const proximityName = ref("");
const proximityDescription = ref("");
const proximityDescriptionEN = ref("");
const proximityDistance = ref("");
const proximityDirections = ref("");

const activityName = ref("");
const activityDescription = ref("");
const activityDescriptionEN = ref("");
const activityDistance = ref("");
const activityInformations = ref("");

const linkName = ref("");
const linkLink = ref("");

const form = ref({
    description: "",
    descriptionEN: "",
    proximity: [],
    activities: [],
    websites: [],
});

onMounted(() => {
    infoStore.getRegion().then((response) => {
        fillForm(response);
    });
});

const fillForm = (response) => {
    region.value = response;
    form.value.description = response.description;
    form.value.descriptionEN = response.descriptionEN;
    form.value.proximity = JSON.parse(response.proximity);
    form.value.activities = JSON.parse(response.activities);
    form.value.websites = JSON.parse(response.websites);
};

const editRegion = () => {
    infoStore
        .updateRegion({
            description: form.value.description,
            descriptionEN: form.value.descriptionEN,
            proximity: form.value.proximity ?? null,
            activities: form.value.activities ?? null,
            websites: form.value.websites ?? null,
        })
        .then((response) => {
            resErrors.value = [];
            if (response.status === 200) {
                region.value = response.data.region;
                notifText.value = response.data.message;
                update.value = false;
                statusRegion.value = true;
                clear();
                setTimeout(() => {
                    statusRegion.value = false;
                }, 5000);
            } else {
                resErrors.value = response.response.data.errors;
                statusRegion.value = false;
            }
        })
        .catch(() => {
            notifText.value = "Ocorreu um erro ao atualizar a região.";
            statusRegion.value = false;
        });
};

const clear = () => {
    proximityName.value = "";
    proximityDescription.value = "";
    proximityDescriptionEN.value = "";
    proximityDistance.value = "";
    proximityDirections.value = "";
    activityName.value = "";
    activityDescription.value = "";
    activityDescriptionEN.value = "";
    activityInformations.value = "";
    linkName.value = "";
    linkLink.value = "";
};

const cancel = () => {
    update.value = false;
    fillForm(region.value);
};

const removeProximity = (index) => {
    form.value.proximity.splice(form.value.proximity.indexOf(index), 1);
};

const addProximity = () => {
    form.value.proximity.push({
        name: proximityName.value,
        description: proximityDescription.value,
        descriptionEN: proximityDescriptionEN.value,
        distance: proximityDistance.value,
        link: proximityDirections.value ?? null,
    });
    proximityName.value = "";
    proximityDescription.value = "";
    proximityDescriptionEN.value = "";
    proximityDistance.value = "";
    proximityDirections.value = "";
};

const addActivity = () => {
    form.value.activities.push({
        name: activityName.value,
        description: activityDescription.value,
        descriptionEN: activityDescriptionEN.value,
        distance: activityDistance.value,
        link: activityInformations.value,
    });
    activityName.value = "";
    activityDescription.value = "";
    activityDescriptionEN.value = "";
    activityDistance.value = "";
    activityInformations.value = "";
};

const removeActivity = (index) => {
    form.value.activities.splice(form.value.activities.indexOf(index), 1);
};

const addLink = () => {
    form.value.websites.push({
        name: linkName.value,
        link: linkLink.value,
    });
    linkName.value = "";
    linkLink.value = "";
};

const removeLink = (index) => {
    form.value.websites.splice(form.value.websites.indexOf(index), 1);
};

const openLink = (link) => {
    window.open(link, "_blank");
};
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLine :icon="mdiForest" title="Região" main />

            <CardBox class="mb-6" is-form @submit.prevent="editRegion">
                <FormValidationErrors
                    v-if="statusRegion == false"
                    :errors="resErrors"
                />
                <Transition name="fade">
                    <NotificationBarInCard v-if="statusRegion" color="success">
                        <b>{{ notifText }}</b>
                    </NotificationBarInCard>
                </Transition>
                <FormField
                    label="Descrição"
                    label-for="description"
                    help="Uma descrição da região. Obrigatória"
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
                    help="Uma descrição da região em inglês. Obrigatória"
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
                <BaseDivider v-if="form.proximity.length != 0 || update" />
                <div v-if="update">
                    <FormField
                        label="Pontos de Interesse"
                        help="O nome do ponto de interesse. Obrigatório."
                        label-for="name"
                    >
                        <FormControl
                            id="name"
                            v-model="proximityName"
                            :icon="mdiCursorText"
                            name="name"
                        />
                    </FormField>
                    <FormField flex>
                        <FormField
                            label="Descrição"
                            label-for="description"
                            class="w-full md:w-2/4 mb-4 sm:mb-0"
                            help="Uma descrição do ponto de interesse. Obrigatória"
                        >
                            <FormControl
                                id="description"
                                v-model="proximityDescription"
                                :icon="mdiTextBox"
                                name="description"
                                autocomplete="description"
                                type="textarea"
                            />
                        </FormField>
                        <FormField
                            label="Descrição (Inglês)"
                            label-for="descriptionEN"
                            class="w-full md:w-2/4 mb-4 sm:mb-0"
                            help="Uma descrição do ponto de interesse em inglês. Obrigatória"
                        >
                            <FormControl
                                id="descriptionEN"
                                v-model="proximityDescriptionEN"
                                :icon="mdiTextBox"
                                name="descriptionEN"
                                autocomplete="descriptionEN"
                                type="textarea"
                            />
                        </FormField>
                    </FormField>
                    <FormField flex>
                        <FormField
                            label="Distância"
                            label-for="distance"
                            class="w-full md:w-7/12"
                            help="A distância ao ponto de interesse. Obrigatória"
                        >
                            <FormControl
                                id="distance"
                                v-model="proximityDistance"
                                :icon="mdiMapMarkerDistance"
                                name="distance"
                                autocomplete="distance"
                            />
                        </FormField>
                        <FormField
                            label="Link para Direções"
                            label-for="directions"
                            class="w-full md:w-6/12"
                            help="O link para direções no Google Maps. Opcional"
                        >
                            <FormControl
                                id="directions"
                                v-model="proximityDirections"
                                :icon="mdiHumanCapacityDecrease"
                                name="directions"
                                autocomplete="directions"
                            />
                        </FormField>
                        <BaseButtons>
                            <BaseButton
                                color="success"
                                class="w-10 h-10 -mt-3"
                                :icon="mdiBookPlus"
                                small
                                outline
                                rounded-full
                                :disabled="
                                    !update ||
                                    proximityName.trim() === '' ||
                                    proximityDescription.trim() === '' ||
                                    proximityDescriptionEN.trim() === '' ||
                                    proximityDistance.trim() === ''
                                "
                                title="Adicionar Proximidade"
                                @click="addProximity()"
                            />
                        </BaseButtons>
                    </FormField>
                </div>
                <table v-if="form.proximity.length != 0" class="w-full -mt-3">
                    <thead>
                        <tr>
                            <th>Pontos de Interesse</th>
                            <th>Descrição</th>
                            <th>Distância</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(proxim, index) in form.proximity"
                            :key="index"
                        >
                            <td data-label="Nome">
                                {{ proxim.name }}
                            </td>
                            <td
                                class="text-gray-500 dark:text-slate-400"
                                data-label="Descrição"
                            >
                                {{ proxim.description }}
                            </td>
                            <td
                                data-label="Distância"
                                class="text-center text-gray-500 dark:text-slate-400 font-semibold"
                            >
                                {{ proxim.distance }}
                            </td>
                            <td
                                class="before:hidden lg:w-1 whitespace-nowrap place-content-center"
                            >
                                <BaseButtons
                                    type="justify-start lg:justify-end"
                                    no-wrap
                                >
                                    <BaseButton
                                        color="info"
                                        :icon="mdiMapMarker"
                                        :disabled="!proxim.link"
                                        small
                                        title="Ver no Mapa"
                                        @click="openLink(proxim.link)"
                                    />
                                    <BaseButton
                                        v-if="update"
                                        color="danger"
                                        :icon="mdiClose"
                                        small
                                        title="Remover Ponto de Interesse"
                                        @click="removeProximity(proxim)"
                                    />
                                </BaseButtons>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <BaseDivider v-if="form.activities.length != 0 || update" />
                <div v-if="update">
                    <FormField
                        label="Nome da Atividade"
                        help="O nome da atividade. Obrigatório."
                        label-for="name"
                    >
                        <FormControl
                            id="name"
                            v-model="activityName"
                            :icon="mdiCursorText"
                            name="name"
                        />
                    </FormField>
                    <FormField flex>
                        <FormField
                            label="Descrição"
                            label-for="description"
                            class="w-full md:w-2/4 mb-4 sm:mb-0"
                            help="Uma descrição da atividade. Obrigatória"
                        >
                            <FormControl
                                id="description"
                                v-model="activityDescription"
                                :icon="mdiTextBox"
                                name="description"
                                autocomplete="description"
                                type="textarea"
                            />
                        </FormField>
                        <FormField
                            label="Descrição (Inglês)"
                            label-for="descriptionEN"
                            class="w-full md:w-2/4 mb-4 sm:mb-0"
                            help="Uma descrição da atividade em inglês. Obrigatória"
                        >
                            <FormControl
                                id="descriptionEN"
                                v-model="activityDescriptionEN"
                                :icon="mdiTextBox"
                                name="descriptionEN"
                                autocomplete="descriptionEN"
                                type="textarea"
                            />
                        </FormField>
                    </FormField>
                    <FormField flex>
                        <FormField
                            label="Distância"
                            label-for="distance"
                            class="w-full md:w-7/12"
                            help="A distância a atividade. Obrigatória"
                        >
                            <FormControl
                                id="distance"
                                v-model="activityDistance"
                                :icon="mdiMapMarkerDistance"
                                name="distance"
                                autocomplete="distance"
                            />
                        </FormField>
                        <FormField
                            label="Link para Informações"
                            label-for="informations"
                            class="w-full md:w-6/12"
                            help="O link para informações sobre a atividade. Opcional"
                        >
                            <FormControl
                                id="informations"
                                v-model="activityInformations"
                                :icon="mdiHumanCapacityDecrease"
                                name="informations"
                                autocomplete="informations"
                            />
                        </FormField>
                        <BaseButtons>
                            <BaseButton
                                color="success"
                                class="w-10 h-10 -mt-3"
                                :icon="mdiBookPlus"
                                small
                                outline
                                rounded-full
                                :disabled="
                                    !update ||
                                    activityName.trim() === '' ||
                                    activityDescription.trim() === '' ||
                                    activityDescriptionEN.trim() === '' ||
                                    activityDistance.trim() === ''
                                "
                                title="Adicionar Atividade"
                                @click="addActivity()"
                            />
                        </BaseButtons>
                    </FormField>
                </div>
                <table v-if="form.activities.length != 0" class="w-full -mt-3">
                    <thead>
                        <tr>
                            <th>Atividades</th>
                            <th>Descrição</th>
                            <th>Distância</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(activity, index) in form.activities"
                            :key="index"
                        >
                            <td data-label="Nome">
                                {{ activity.name }}
                            </td>
                            <td
                                data-label="Descrição"
                                class="text-gray-500 dark:text-slate-400"
                            >
                                {{ activity.description }}
                            </td>
                            <td
                                data-label="Distância"
                                class="text-center text-gray-500 dark:text-slate-400 font-semibold"
                            >
                                {{ activity.distance }}
                            </td>
                            <td
                                class="before:hidden lg:w-1 whitespace-nowrap place-content-center"
                            >
                                <BaseButtons
                                    type="justify-start lg:justify-end"
                                    no-wrap
                                >
                                    <BaseButton
                                        color="info"
                                        :icon="mdiEye"
                                        :disabled="!activity.link"
                                        small
                                        title="Ver Informações"
                                        @click="openLink(activity.link)"
                                    />
                                    <BaseButton
                                        v-if="update"
                                        color="danger"
                                        :icon="mdiClose"
                                        small
                                        title="Remover Atividade"
                                        @click="removeActivity(activity)"
                                    />
                                </BaseButtons>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <BaseDivider v-if="form.websites.length != 0 || update" />
                <div v-if="update">
                    <FormField
                        label="Nome do Website"
                        help="O nome do website de informações. Obrigatório."
                        label-for="name"
                    >
                        <FormControl
                            id="name"
                            v-model="linkName"
                            :icon="mdiCursorText"
                            name="name"
                        />
                    </FormField>
                    <FormField flex>
                        <FormField
                            label="Link"
                            label-for="link"
                            class="w-full"
                            help="O link para o website de informações. Obrigatório"
                        >
                            <FormControl
                                id="link"
                                v-model="linkLink"
                                :icon="mdiHumanCapacityDecrease"
                                name="link"
                                autocomplete="link"
                            />
                        </FormField>
                        <BaseButtons>
                            <BaseButton
                                color="success"
                                class="w-10 h-10 mb-6"
                                :icon="mdiBookPlus"
                                small
                                outline
                                rounded-full
                                :disabled="
                                    !update ||
                                    linkName.trim() === '' ||
                                    linkLink.trim() === ''
                                "
                                title="Adicionar Link"
                                @click="addLink()"
                            />
                        </BaseButtons>
                    </FormField>
                </div>
                <table v-if="form.websites.length != 0" class="w-full">
                    <thead>
                        <tr>
                            <th>Websites de Informações</th>
                            <th v-if="update"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(link, index) in form.websites" :key="index">
                            <td data-label="Nome">
                                {{ link.name }}
                            </td>
                            <td
                                class="before:hidden lg:w-1 whitespace-nowrap place-content-center"
                            >
                                <BaseButtons
                                    type="justify-start lg:justify-end"
                                    no-wrap
                                >
                                    <BaseButton
                                        color="info"
                                        :icon="mdiEye"
                                        :disabled="!link.link"
                                        small
                                        title="Ver Website"
                                        @click="openLink(link.link)"
                                    />
                                    <BaseButton
                                        v-if="update"
                                        color="danger"
                                        :icon="mdiClose"
                                        small
                                        title="Remover Website"
                                        @click="removeLink(link)"
                                    />
                                </BaseButtons>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <template #footer>
                    <div class="relative">
                        <BaseButtons
                            v-if="
                                (update == false && user.role == 'A') ||
                                user.role == 'M'
                            "
                        >
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
                            class="static text-zinc-500 right-0 bottom-0 text-center sm:text-right sm:absolute"
                            :class="
                                user.role == 'A' || user.role == 'M'
                                    ? 'mb-2'
                                    : 'mb-0'
                            "
                            >Última Atualização: {{ region?.updated_at }}</span
                        >
                    </div>
                </template>
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
