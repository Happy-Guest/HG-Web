<script setup>
import NotificationBarInCard from "@/components/Others/NotificationBarInCard.vue";

defineProps({
    errors: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    <NotificationBarInCard v-if="Object.keys(errors).length > 0" color="danger">
        <b>Whoops! Algo correu mal.</b>
        <span v-for="(error, key) in errors" :key="key">{{ error[0] }}</span>
    </NotificationBarInCard>
</template>
