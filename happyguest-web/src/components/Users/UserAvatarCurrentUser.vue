<script setup>
import UserAvatar from "@/components/Users/UserAvatar.vue";

defineProps({
    userName: {
        type: String,
        default: null,
    },
    userAvatar: {
        type: String,
        default: null,
    },
});
</script>

<template>
    <UserAvatar :username="userName" api="initials" :avatar="userAvatar">
        <slot />
    </UserAvatar>
</template>
