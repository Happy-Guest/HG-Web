<script setup>
import {
    mdiAccountPlus,
    mdiAccountGroup,
    mdiFilterMultiple,
    mdiOrderNumericDescending,
    mdiOrderNumericAscending,
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
import { onMounted, ref, watch, watchEffect } from "vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

const hasUsers = ref(false);

const selectOptionsFilter = [
    { value: "ALL", label: "Todos" },
    { value: "C", label: "Clientes" },
    { value: "M", label: "Gestores" },
    { value: "A", label: "Admins" },
    { value: "NB", label: "Ativos" },
    { value: "B", label: "Bloqueados" },
];

const selectOptionsOrder = [
    { value: "DESC", label: "Descendente" },
    { value: "ASC", label: "Ascendente" },
];

const filter = ref(selectOptionsFilter[0]);
const order = ref(selectOptionsOrder[0]);

onMounted(async () => {
    hasUsers.value = await userStore.getUsers(0, filter.value.value);
});

watch(filter, async (value) => {
    if (value.value != userStore.filterTable) {
        hasUsers.value = await userStore.getUsers(0, value.value);
        setTimeout(() => {
            userStore.filterTable = value.value;
        }, 200);
    }
});

watch(order, (value) => {
    userStore.orderTable = value.value;
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
                            class="w-48 mr-0 lg:mr-4 lg:mr-6 mb-2 lg:mb-0"
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
                            class="w-48 mr-0 lg:mr-4 lg:mr-6 mb-2 lg:mb-0"
                            :options="selectOptionsFilter"
                            :icon="mdiFilterMultiple"
                        />
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
                />
                <CardBoxComponentEmpty
                    v-else
                    message="Sem utilizadores registados..."
                />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
