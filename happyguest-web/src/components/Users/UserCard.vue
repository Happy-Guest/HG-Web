<script setup>
import {
    mdiCrown,
    mdiAccountHardHat,
} from "@mdi/js";
import BaseLevel from "@/components/Bases/BaseLevel.vue";
import UserAvatarCurrentUser from "@/components/Users/UserAvatarCurrentUser.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import PillTag from "@/components/PillTags/PillTag.vue";

const props = defineProps({
    user: {
        required: true,
    },
    currentUser: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <CardBox>
        <BaseLevel type="justify-around lg:justify-center">
            <UserAvatarCurrentUser
                class="lg:mx-12 w-44"
                :name="props.user?.name"
                profile
            />
            <div class="space-y-3 text-center md:text-left lg:mx-12">
                <h1 v-if="props.currentUser" class="text-2xl">
                    Olá, <b>{{ props.user?.name }}</b
                    >!
                </h1>
                <h1 v-else class="text-2xl">
                    <b>{{ props.user?.name }}</b>
                </h1>
                <div
                    v-if="props.user?.role == 'M'"
                    class="flex justify-center md:block"
                >
                    <PillTag
                        v-if="props.user?.role == 'M'"
                        label="Administrador"
                        class="mr-4"
                        color="warning"
                        :icon="mdiCrown"
                    />
                    <PillTag
                        v-else
                        label="Cliente"
                        class="mr-4"
                        color="info"
                        :icon="mdiAccountHardHat"
                    />
                    
                </div>
                
            </div>
        </BaseLevel>
    </CardBox>
</template>
