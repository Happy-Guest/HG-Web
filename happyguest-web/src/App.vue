<script setup>
import { RouterView } from "vue-router";
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const authStore = useAuthStore();

onMounted(async () => {
    if (authStore.user === null) {
        await authStore.restoreToken();
    }
});

/* Firebase Notifs */
const firebaseConfig = {
    apiKey: "AIzaSyAucBbldmHvC2YxZ4d4w6W_KLaAsRuJjpA",
    authDomain: "happyguest-ipl.firebaseapp.com",
    projectId: "happyguest-ipl",
    storageBucket: "happyguest-ipl.appspot.com",
    messagingSenderId: "825950088067",
    appId: "1:825950088067:web:b7c49a380b2463779064b6",
    measurementId: "G-G7JHEECZ5T",
};

// eslint-disable-next-line no-unused-vars
const app = initializeApp(firebaseConfig);

const messaging = getMessaging();

onMessage(messaging, (payload) => {
    console.log(payload);
});

getToken(messaging, {
    vapidKey:
        "BFrd_fWqUL5Teaq3rrubjvhh5dea_zKVmgEAYSuBeerJrx3w9athL5_fcYO30xQHnuxZKvpplqtRpRR4vVaibfc",
})
    .then((currentToken) => {
        if (currentToken) {
            console.log(currentToken);
        } else {
            console.log(
                "No registration token available. Request permission to generate one."
            );
        }
    })
    .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
    });
</script>

<template>
    <RouterView />
</template>
