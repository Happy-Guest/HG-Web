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
    isProfile: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <UserAvatar
        :username="userName"
        api="initials"
        :avatar="userAvatar"
        :is-profile="isProfile"
    >
        <slot />
    </UserAvatar>
</template>
