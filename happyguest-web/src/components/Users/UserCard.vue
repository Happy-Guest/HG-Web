<script setup>
import {
    mdiCheckDecagram,
    mdiLock,
    mdiCrown,
    mdiAccountHardHat,
    mdiBriefcaseAccount,
    mdiAccountTie,
} from "@mdi/js";
import BaseLevel from "@/components/Bases/BaseLevel.vue";
import UserAvatarCurrentUser from "@/components/Users/UserAvatarCurrentUser.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import PillTag from "@/components/PillTags/PillTag.vue";

defineProps({
    userName: {
        type: String,
        default: "Nome",
    },
    userRole: {
        type: String,
        default: "Outro",
    },
    userBlocked: {
        type: Boolean,
        default: false,
    },
    currentUser: {
        type: Boolean,
        default: false,
    },
    userAvatar: {
        type: String,
        default: null,
    },
});
</script>

<template>
    <CardBox>
        <BaseLevel type="justify-around lg:justify-center">
            <UserAvatarCurrentUser
                :user-name="userName"
                :user-avatar="userAvatar"
                class="lg:mx-12 my-1 w-3/5"
            />
            <div class="space-y-3 text-center md:text-left lg:mx-12">
                <h1 v-if="currentUser" class="text-2xl">
                    Olá, <b>{{ userName }}</b
                    >!
                </h1>
                <h1 v-else class="text-2xl">
                    <b>{{ userName }}</b>
                </h1>
                <div class="flex justify-center md:block">
                    <PillTag
                        v-if="userRole === 'A'"
                        label="Administrador"
                        class="mr-4"
                        color="warning"
                        :icon="mdiCrown"
                    />
                    <PillTag
                        v-else-if="userRole === 'M'"
                        label="Gestor"
                        class="mr-4"
                        color="info"
                        :icon="mdiAccountTie"
                    />
                    <PillTag
                        v-else-if="userRole === 'C'"
                        label="Cliente"
                        class="mr-4"
                        color="contrast"
                        :icon="mdiBriefcaseAccount"
                    />
                    <PillTag
                        v-else
                        label="Outro"
                        class="mr-4"
                        color="info"
                        :icon="mdiAccountHardHat"
                    />
                    <PillTag
                        v-if="!userBlocked"
                        label="Ativo"
                        color="success"
                        :icon="mdiCheckDecagram"
                    />
                    <PillTag
                        v-else
                        label="Bloqueado"
                        color="danger"
                        :icon="mdiLock"
                    />
                </div>
            </div>
        </BaseLevel>
    </CardBox>
</template>
