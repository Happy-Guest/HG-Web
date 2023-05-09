<script setup>
import { mdiAccountPlus, mdiAccountGroup } from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Sections/SectionMain.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import CardBoxComponentEmpty from "@/components/CardBoxs/CardBoxComponentEmpty.vue";
import TableUsers from "@/components/Tables/TableUsers.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

const hasUsers = ref(false);

onMounted(() => {
    hasUsers.value = userStore.getUsers(0);
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
                <BaseButtons>
                    <BaseButton
                        :icon="mdiAccountPlus"
                        :to="{ name: 'register' }"
                        label="Registar"
                        color="success"
                        rounded-full
                        small
                    />
                </BaseButtons>
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
