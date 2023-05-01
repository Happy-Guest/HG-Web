<script setup>
import { mdiPlus, mdiAccountGroup } from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Sections/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/Sections/SectionTitleLineWithButton.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import CardBoxComponentEmpty from "@/components/CardBoxs/CardBoxComponentEmpty.vue";
import TableUsers from "@/components/Tables/TableUsers.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import { onMounted, ref, onUpdated } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const hasUsers = ref(false);


const checkUsers = async () => {
    setTimeout(async function () {
        hasUsers.value = await authStore.getUsers(
            0
        );
    }, 700);
};

onMounted(() => {
    checkUsers();
});

onUpdated(() => {
    checkUsers();
});
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLineWithButton
                :icon="mdiAccountGroup"
                :title="
                    'Utilizadores'"
                main
            >
                <BaseButtons>
                    <BaseButton
                       
                        :icon="mdiPlus"
                        label="Registar Utilizador"
                        color="success"
                        rounded-full
                        small
                    />
                </BaseButtons>
            </SectionTitleLineWithButton>
            <CardBox class="mb-6" has-table>
                <TableUsers
                    v-if="hasUsers"
                />
                <CardBoxComponentEmpty
                    message="Sem utilizadores registados..."
                    v-else
                />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
