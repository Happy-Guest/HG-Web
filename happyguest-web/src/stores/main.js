import { inject } from "vue";
import { defineStore } from "pinia";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { createToaster } from "@meforma/vue-toaster";

export const useMainStore = defineStore("main", () => {
    const axios = inject("axios");

    async function getHomeStatistics() {
        try {
            return await axios.get("stats/home");
        } catch (error) {
            return error;
        }
    }

    async function getHomeGraph() {
        try {
            return await axios.get("stats/graph");
        } catch (error) {
            return error;
        }
    }

    async function sendNotifToken(token) {
        try {
            return await axios.post("users/token", { token });
        } catch (error) {
            return error;
        }
    }

    /* Firebase Notifs */
    async function setupNotifications() {
        const firebaseConfig = {
            apiKey: "AIzaSyAucBbldmHvC2YxZ4d4w6W_KLaAsRuJjpA",
            authDomain: "happyguest-ipl.firebaseapp.com",
            projectId: "happyguest-ipl",
            storageBucket: "happyguest-ipl.appspot.com",
            messagingSenderId: "825950088067",
            appId: "1:825950088067:web:b7c49a380b2463779064b6",
            measurementId: "G-G7JHEECZ5T",
        };

        const toast = createToaster();

        // eslint-disable-next-line no-unused-vars
        const app = initializeApp(firebaseConfig);

        const messaging = getMessaging();

        onMessage(messaging, (payload) => {
            toast.success(payload.notification.body);
        });

        getToken(messaging, {
            vapidKey:
                "BFrd_fWqUL5Teaq3rrubjvhh5dea_zKVmgEAYSuBeerJrx3w9athL5_fcYO30xQHnuxZKvpplqtRpRR4vVaibfc",
        })
            .then((currentToken) => {
                if (currentToken) {
                    sendNotifToken(currentToken);
                }
            })
            .catch((err) => {
                console.log("An error occurred while retrieving token. ", err);
            });
    }

    return {
        getHomeStatistics,
        getHomeGraph,
        sendNotifToken,
        setupNotifications,
    };
});
