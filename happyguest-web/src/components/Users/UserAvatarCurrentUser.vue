<script setup>
import UserAvatar from "@/components/Users/UserAvatar.vue";

defineProps({
    userName: {
        type: String,
        default: null,
    },
});
</script>

<template>
    <UserAvatar :username="userName" api="initials">
        <slot />
    </UserAvatar>
</template>
