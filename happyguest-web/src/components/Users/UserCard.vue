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
    userType: {
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
    type: {
        type: String,
        default: "user",
    },
});
</script>

<template>
    <CardBox>
        <BaseLevel type="justify-around lg:justify-center">
            <UserAvatarCurrentUser
                :user-name="userName"
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
                <div
                    v-if="type === 'user'"
                    class="flex justify-center md:block"
                >
                    <PillTag
                        v-if="userType === 'A'"
                        label="Administrador"
                        class="mr-4"
                        color="warning"
                        :icon="mdiCrown"
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
                <div v-if="type === 'employee'">
                    <PillTag
                        label="Empregado"
                        color="warning"
                        class="mr-4"
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
                        label="Inativo"
                        color="danger"
                        :icon="mdiLock"
                    />
                </div>
                <div v-if="type === 'client'">
                    <PillTag
                        label="Cliente"
                        color="success"
                        :icon="mdiBriefcaseAccount"
                    />
                </div>
                <div v-if="type === 'supplier'">
                    <PillTag
                        label="Fornecedor"
                        color="info"
                        :icon="mdiAccountTie"
                    />
                </div>
            </div>
        </BaseLevel>
    </CardBox>
</template>
