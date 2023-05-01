<script setup>
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const props = defineProps({
    name: {
        type: String,
        default: "",
    },
});
</script>

<template>
    <UserAvatar :username="props.name" :avatar="authStore.user?.photo_url">
        <slot />
    </UserAvatar>
</template>
