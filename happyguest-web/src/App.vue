<script setup>
import { RouterView } from "vue-router";
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useMainStore } from "@/stores/main";

const authStore = useAuthStore();
const mainStore = useMainStore();

onMounted(async () => {
    if (authStore.user === null) {
        await authStore.restoreToken().then(async () => {
            if (authStore.user !== null) {
                mainStore.setupNotifications();
            }
        });
    }
});
</script>

<template>
    <RouterView />
</template>
