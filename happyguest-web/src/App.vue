<script setup>
import { RouterView } from "vue-router";
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

onMounted(async () => {
    if (authStore.user === null)
        await authStore.restoreToken();
});
</script>

<template>
    <RouterView />
</template>
