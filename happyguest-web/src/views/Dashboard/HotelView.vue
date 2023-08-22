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
    mdiBookPlus,
    mdiClose,
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
import { useAuthStore } from "@/stores/auth";

const infoStore = useInfoStore();
const user = useAuthStore().user;

const update = ref(false);
const hotel = ref([]);
const statusHotel = ref(false);
const resErrors = ref([]);
const notifText = ref("");

const access = ref("");
const accessEN = ref("");
const policy = ref("");
const policyEN = ref("");
const commodity = ref("");
const commodityEN = ref("");

const form = ref({
    email: "",
    phone: "",
    address: "",
    capacity: null,
    website: null,
    policies: [],
    accesses: [],
    description: "",
    descriptionEN: "",
    commodities: [],
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
    form.value.policies = JSON.parse(response.policies);
    form.value.accesses = JSON.parse(response.accesses);
    form.value.description = response.description;
    form.value.descriptionEN = response.descriptionEN;
    form.value.commodities = JSON.parse(response.commodities);
};

const editHotel = () => {
    infoStore
        .updateHotel({
            email: form.value.email,
            phone: form.value.phone,
            address: form.value.address,
            capacity: form.value.capacity,
            website: form.value.website,
            policies: form.value.policies ?? null,
            accesses: form.value.accesses ?? null,
            description: form.value.description,
            descriptionEN: form.value.descriptionEN,
            commodities: form.value.commodities ?? null,
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

const add = (array, value1, value2) => {
    array.push({
        name: value1,
        nameEN: value2,
    });
};

const remove = (array, index) => {
    array.splice(array.indexOf(index), 1);
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
                            autocomplete="cap"
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
                <FormField v-if="update" flex>
                    <FormField
                        label="Comodidade"
                        class="w-full mb-4 sm:mb-0"
                        label-for="commodity"
                        help="A comodidade do hotel. Obrigatória"
                    >
                        <FormControl
                            id="commodity"
                            v-model="commodity"
                            :icon="mdiStarBoxMultiple"
                            type="text"
                            name="commodity"
                            :disabled="!update"
                            autocomplete="commodity"
                        />
                    </FormField>
                    <FormField
                        label="Comodidade (Inglês)"
                        class="w-full mb-4 sm:mb-0"
                        label-for="commodityEN"
                        help="A comodidade do hotel em inglês. Obrigatória"
                    >
                        <FormControl
                            id="commodityEN"
                            v-model="commodityEN"
                            :icon="mdiStarBoxMultiple"
                            type="text"
                            name="commodityEN"
                            :disabled="!update"
                            autocomplete="commoditiesEN"
                        />
                    </FormField>
                    <BaseButtons>
                        <BaseButton
                            color="success"
                            class="w-10 h-10 mt-3"
                            :icon="mdiBookPlus"
                            small
                            outline
                            rounded-full
                            :disabled="
                                !update ||
                                commodity.trim() === '' ||
                                commodityEN.trim() === ''
                            "
                            title="Adicionar Comodidade"
                            @click="
                                add(form.commodities, commodity, commodityEN),
                                    (commodity = ''),
                                    (commodityEN = '')
                            "
                        />
                    </BaseButtons>
                </FormField>
                <table v-if="form.commodities.length != 0" class="w-full -mt-3">
                    <thead>
                        <tr>
                            <th class="w-1/2">Comodidades</th>
                            <th class="w-1/2">Comodidades (Inglês)</th>
                            <th v-if="update"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(tableCommodity, index) in form.commodities"
                            :key="index"
                        >
                            <td data-label="Nome">{{ tableCommodity.name }}</td>
                            <td
                                data-label="Nome (Inglês)"
                                class="text-gray-500 dark:text-slate-400"
                            >
                                {{ tableCommodity.nameEN }}
                            </td>
                            <td
                                v-if="update"
                                class="before:hidden lg:w-1 whitespace-nowrap place-content-center"
                            >
                                <BaseButtons
                                    type="justify-start lg:justify-end"
                                    no-wrap
                                >
                                    <BaseButton
                                        color="danger"
                                        :icon="mdiClose"
                                        small
                                        title="Remover Comodidade"
                                        @click="
                                            remove(
                                                form.commodities,
                                                tableCommodity
                                            )
                                        "
                                    />
                                </BaseButtons>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
                <FormField v-if="update" flex>
                    <FormField
                        label="Política do Hotel"
                        class="w-full md:w-2/4 mb-4 sm:mb-0"
                        label-for="policies"
                        help="A politica do hotel. Obrigatória"
                    >
                        <FormControl
                            id="policies"
                            v-model="policy"
                            :icon="mdiInformationVariant"
                            type="text"
                            name="policies"
                            :disabled="!update"
                            autocomplete="policies"
                        />
                    </FormField>
                    <FormField
                        label="Política do Hotel (Inglês)"
                        class="w-full md:w-2/4 mb-4 sm:mb-0"
                        label-for="policiesEN"
                        help="A politica do hotel em inglês. Obrigatória"
                    >
                        <FormControl
                            id="policiesEN"
                            v-model="policyEN"
                            :icon="mdiInformationVariant"
                            type="text"
                            name="policiesEN"
                            :disabled="!update"
                            autocomplete="policiesEN"
                        />
                    </FormField>
                    <BaseButtons>
                        <BaseButton
                            color="success"
                            class="w-10 h-10 mt-3"
                            :icon="mdiBookPlus"
                            small
                            outline
                            rounded-full
                            :disabled="
                                !update ||
                                policy.trim() === '' ||
                                policyEN.trim() === ''
                            "
                            title="Adicionar Política"
                            @click="
                                add(form.policies, policy, policyEN),
                                    (policy = ''),
                                    (policyEN = '')
                            "
                        />
                    </BaseButtons>
                </FormField>
                <table v-if="form.policies.length != 0" class="w-full -mt-3">
                    <thead>
                        <tr>
                            <th class="w-1/2">Políticas do Hotel</th>
                            <th class="w-1/2">Políticas do Hotel (Inglês)</th>
                            <th v-if="update"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(tablePolicy, index) in form.policies"
                            :key="index"
                        >
                            <td data-label="Nome">{{ tablePolicy.name }}</td>
                            <td
                                data-label="Nome (Inglês)"
                                class="text-gray-500 dark:text-slate-400"
                            >
                                {{ tablePolicy.nameEN }}
                            </td>
                            <td
                                v-if="update"
                                class="before:hidden lg:w-1 whitespace-nowrap place-content-center"
                            >
                                <BaseButtons
                                    type="justify-start lg:justify-end"
                                    no-wrap
                                >
                                    <BaseButton
                                        color="danger"
                                        :icon="mdiClose"
                                        small
                                        title="Remover Política"
                                        @click="
                                            remove(form.policies, tablePolicy)
                                        "
                                    />
                                </BaseButtons>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <BaseDivider />
                <FormField v-if="update" flex>
                    <FormField
                        label="Informação de Acesso"
                        class="w-full md:w-2/4 mb-4 sm:mb-0"
                        label-for="access"
                        help="A informação de acesso ao hotel. Obrigatória"
                    >
                        <FormControl
                            id="access"
                            v-model="access"
                            :icon="mdiHuman"
                            type="text"
                            name="access"
                            :disabled="!update"
                            autocomplete="access"
                        />
                    </FormField>
                    <FormField
                        label="Informação de Acesso (Inglês)"
                        class="w-full md:w-2/4 mb-4 sm:mb-0"
                        label-for="accessEN"
                        help="A informação de acesso ao hotel em inglês. Obrigatória"
                    >
                        <FormControl
                            id="accessEN"
                            v-model="accessEN"
                            :icon="mdiHuman"
                            type="text"
                            name="accessEN"
                            :disabled="!update"
                            autocomplete="accessEN"
                        />
                    </FormField>
                    <BaseButtons>
                        <BaseButton
                            color="success"
                            class="w-10 h-10 mt-3"
                            :icon="mdiBookPlus"
                            small
                            outline
                            rounded-full
                            :disabled="
                                !update ||
                                access.trim() === '' ||
                                accessEN.trim() === ''
                            "
                            title="Adicionar Acesso"
                            @click="
                                add(form.accesses, access, accessEN),
                                    (access = ''),
                                    (accessEN = '')
                            "
                        />
                    </BaseButtons>
                </FormField>
                <table v-if="form.accesses.length != 0" class="w-full -mt-3">
                    <thead>
                        <tr>
                            <th class="w-1/2">Informações de Acesso</th>
                            <th class="w-1/2">
                                Informações de Acesso (Inglês)
                            </th>
                            <th v-if="update"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(tableAccess, index) in form.accesses"
                            :key="index"
                        >
                            <td data-label="Nome">{{ tableAccess.name }}</td>
                            <td
                                data-label="Nome (Inglês)"
                                class="text-gray-500 dark:text-slate-400"
                            >
                                {{ tableAccess.nameEN }}
                            </td>
                            <td
                                v-if="update"
                                class="before:hidden lg:w-1 whitespace-nowrap place-content-center"
                            >
                                <BaseButtons
                                    type="justify-start lg:justify-end"
                                    no-wrap
                                >
                                    <BaseButton
                                        color="danger"
                                        :icon="mdiClose"
                                        small
                                        title="Remover Acesso"
                                        @click="
                                            remove(form.accesses, tableAccess)
                                        "
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
                            >Última Atualização: {{ hotel?.updated_at }}</span
                        >
                    </div>
                </template>
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
