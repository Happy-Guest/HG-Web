<script setup>
import {
    mdiFolderKey,
    mdiOrderNumericDescending,
    mdiOrderNumericAscending,
    mdiFilePlus,
    mdiFilterMultiple,
    mdiMagnify,
} from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Sections/SectionMain.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";
import CardBoxComponentEmpty from "@/components/CardBoxs/CardBoxComponentEmpty.vue";
import TableCheckouts from "@/components/Tables/TableCheckouts.vue";
import CardBoxRegisterCheckout from "@/components/CardBoxsCustom/CardBoxRegisterCheckout.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import { ref, watch, watchEffect } from "vue";
import { useCheckoutStore } from "@/stores/checkout";

const checkoutStore = useCheckoutStore();

const hascheckouts = ref(true);
const newCheckout = ref(null);

const isModalActiveRegister = ref(false);

const selectOptionsFilter = [
    { value: "ALL", label: "Todos" },
    { value: "V", label: "Validados" },
    { value: "NV", label: "Não Validados" },
];

const selectOptionsOrder = [
    { value: "DESC", label: "Descendente" },
    { value: "ASC", label: "Ascendente" },
];

const filter = ref(selectOptionsFilter[0]);
const order = ref(selectOptionsOrder[0]);
const search = ref("");
const searchButton = ref(false);

watch(filter, async (value) => {
    if (value.value != checkoutStore.filterTable) {
        checkoutStore.filterTable = value.value;
        hascheckouts.value = true;
    }
});

watch(order, (value) => {
    if (value.value != checkoutStore.orderTable) {
        checkoutStore.orderTable = value.value;
    }
});

watchEffect(() => {
    if (checkoutStore.filterTable) {
        filter.value = selectOptionsFilter.find(
            (option) => option.value === checkoutStore.filterTable
        );
    }
});

watchEffect(() => {
    if (checkoutStore.orderTable) {
        order.value = selectOptionsOrder.find(
            (option) => option.value === checkoutStore.orderTable
        );
    }
});

watch(searchButton, (value) => {
    if (value) {
        hascheckouts.value = true;
    }
});
</script>

<template>
    <LayoutAuthenticated>
        <CardBoxRegisterCheckout
            :active="isModalActiveRegister"
            @update:active="isModalActiveRegister = $event"
            @updated="newCheckout = $event"
        />
        <SectionMain>
            <SectionTitleLine :icon="mdiFolderKey" :title="'Check-Outs'" main>
                <div class="flex mr-0 sm:mr-12 lg:mr-8">
                    <div class="flex flex-col lg:flex-row">
                        <b class="my-auto mr-4">Ordenar:</b>
                        <FormControl
                            id="order"
                            v-model="order"
                            class="w-44 mr-0 lg:mr-6 mb-2 lg:mb-0"
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
                            class="w-44 mr-0 lg:mr-6 mb-2 lg:mb-0"
                            :options="selectOptionsFilter"
                            :icon="mdiFilterMultiple"
                        />
                        <FormControl
                            id="search"
                            v-model="search"
                            class="w-36 mr-0 lg:mr-4 mb-2 lg:mb-0"
                            title="Pesquise por nome cliente"
                            :icon="mdiMagnify"
                            :placeholder="'Pesquisar'"
                            @keyup.enter="searchButton = true"
                            @focusout="searchButton = true"
                        />
                        <BaseButtons class="justify-center">
                            <BaseButton
                                :icon="mdiFilePlus"
                                label="Registar"
                                class="mt-2 lg:mt-0"
                                color="success"
                                rounded-full
                                small
                                @click="isModalActiveRegister = true"
                            />
                        </BaseButtons>
                    </div>
                </div>
            </SectionTitleLine>
            <CardBox class="mb-6" has-table>
                <TableCheckouts
                    v-if="hascheckouts"
                    :new-checkout="newCheckout"
                    :filter="filter.value"
                    :order="order.value"
                    :search="search"
                    :search-button="searchButton"
                    @update:not-empty="hascheckouts = $event"
                    @button:search="searchButton = $event"
                />
                <CardBoxComponentEmpty
                    v-else
                    message="Sem check-outs registados..."
                />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
