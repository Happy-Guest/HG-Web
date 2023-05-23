<script setup>
import { mdiAccountPlus, mdiAccountGroup, mdiFilterMultiple } from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Sections/SectionMain.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import CardBoxComponentEmpty from "@/components/CardBoxs/CardBoxComponentEmpty.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import TableUsers from "@/components/Tables/TableUsers.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

const hasUsers = ref(false);

const selectOptionsFilter = [
    { value: "ALL", label: "Todos" },
    { value: "C", label: "Clientes" },
    { value: "M", label: "Gestores" },
    { value: "A", label: "Admins" },
    { value: "A", label: "Ativos" },
    { value: "B", label: "Bloqueados" },
];

const filter = ref(selectOptionsFilter[0]);

onMounted(async () => {
    hasUsers.value = await userStore.getUsers(0);
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
                <div class="flex">
                    <div class="flex mr-4 sm:mr-8">
                        <b class="my-auto mr-4">Filtrar:</b>
                        <FormControl
                            id="filter"
                            v-model="filter"
                            class="w-40"
                            :options="selectOptionsFilter"
                            :icon="mdiFilterMultiple"
                        />
                    </div>
                    <BaseButtons class="mr-0 sm:mr-10">
                        <BaseButton
                            :icon="mdiAccountPlus"
                            :to="{ name: 'register' }"
                            label="Registar"
                            color="success"
                            rounded-full
                            small
                        />
                    </BaseButtons>
                </div>
            </SectionTitleLine>
            <CardBox class="mb-6" has-table>
                <TableUsers v-if="hasUsers" />
                <CardBoxComponentEmpty
                    v-else
                    message="Sem utilizadores registados..."
                />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
