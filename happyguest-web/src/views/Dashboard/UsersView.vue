<script setup>
import {
    mdiAccountPlus,
    mdiAccountGroup,
    mdiFilterMultiple,
    mdiOrderNumericDescending,
    mdiOrderNumericAscending,
    mdiMagnify,
} from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Sections/SectionMain.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import CardBoxComponentEmpty from "@/components/CardBoxs/CardBoxComponentEmpty.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import TableUsers from "@/components/Tables/TableUsers.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import { ref, watch, watchEffect } from "vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

const hasUsers = ref(true);

const selectOptionsFilter = [
    { value: "ALL", label: "Todos" },
    { value: "C", label: "Clientes" },
    { value: "E", label: "Funcionários" },
    { value: "M", label: "Gestores" },
    { value: "A", label: "Admins" },
    { value: "NB", label: "Ativos" },
    { value: "B", label: "Bloqueados" },
    { value: "D", label: "Eliminados" },
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
    if (value.value != userStore.filterTable) {
        userStore.filterTable = value.value;
        hasUsers.value = true;
    }
});

watch(order, (value) => {
    if (value.value != userStore.orderTable) {
        userStore.orderTable = value.value;
    }
});

watchEffect(() => {
    if (userStore.filterTable) {
        filter.value = selectOptionsFilter.find(
            (option) => option.value === userStore.filterTable
        );
    }
});

watchEffect(() => {
    if (userStore.orderTable) {
        order.value = selectOptionsOrder.find(
            (option) => option.value === userStore.orderTable
        );
    }
});

watch(searchButton, (value) => {
    if (value) {
        hasUsers.value = true;
    }
});
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLine
                :icon="mdiAccountGroup"
                :title="'Utilizadores'"
                main
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
                            :options="selectOptionsFilter"
                            :icon="mdiFilterMultiple"
                        />
                        <div class="flex justify-center">
                            <FormControl
                                id="search"
                                v-model="search"
                                class="w-36 mr-0 lg:mr-4 mb-2 lg:mb-0"
                                title="Pesquise por Nome ou Email"
                                :icon="mdiMagnify"
                                :placeholder="'Pesquisar'"
                                @keyup.enter="searchButton = true"
                                @focusout="searchButton = true"
                            />
                        </div>
                        <BaseButtons class="justify-center">
                            <BaseButton
                                :icon="mdiAccountPlus"
                                :to="{ name: 'register' }"
                                label="Registar"
                                class="mt-2 lg:mt-0"
                                color="success"
                                rounded-full
                                small
                            />
                        </BaseButtons>
                    </div>
                </div>
            </SectionTitleLine>
            <CardBox class="mb-6" has-table>
                <TableUsers
                    v-if="hasUsers"
                    :filter="filter.value"
                    :order="order.value"
                    :search="search"
                    :search-button="searchButton"
                    @update:not-empty="hasUsers = $event"
                    @button:search="searchButton = $event"
                />
                <CardBoxComponentEmpty
                    v-else
                    message="Sem utilizadores registados..."
                />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
