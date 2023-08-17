<script setup>
import { RouterView } from "vue-router";
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { getToken } from "./firebase";

const authStore = useAuthStore();

onMounted(async () => {
    if (authStore.user === null) {
        await authStore.restoreToken();
    }
    getToken({
        vapidKey:
            "BHaw89imnck-FuuF4m8njC96lHikDSrDkwXKUMZa8d8Z2UYNiCg5E7Rm_2ObXGBAq0YnpPMJDDtj1BBwD1SGlWU",
    }).then((token) => {
        console.log(token);
    });
});
</script>

<template>
    <RouterView />
</template>
