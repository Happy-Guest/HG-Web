import { inject, ref } from "vue";
import { defineStore } from "pinia";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { createToaster } from "@meforma/vue-toaster";

export const useMainStore = defineStore("main", () => {
    const axios = inject("axios");

    const toast = createToaster();
    const showNotifs = ref(true);

    function setNotifs(value, showToast) {
        showNotifs.value = value;
        localStorage.setItem("showNotifs", value);
        if (value) {
            if (showToast) {
                toast.success("Notificações ativadas!", {
                    dismissible: true,
                    duration: 2000,
                });
            }
            setupNotifications();
        } else if (showToast) {
            toast.error("Notificações desativadas!", {
                dismissible: true,
                duration: 2000,
            });
        }
    }

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
        if (!showNotifs.value) {
            return;
        }
        try {
            return await axios.post("users/token", { token });
        } catch (error) {
            return error;
        }
    }

    /* Firebase Notifs */
    async function setupNotifications() {
        if (!showNotifs.value) {
            return;
        }
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
            toast.success(payload.notification.body, {
                dismissible: true,
                duration: 8000,
            });
        });

        getToken(messaging, {
            vapidKey:
                "BHn3Zcn2jjOXa22zaRsMBP-4oTKYyej317RKwmgp-5_OCv02Pg-8s0NE4vE11rWjc3BMB9yFg3fWpJE2BJBGjbY",
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
        showNotifs,
        setNotifs,
        getHomeStatistics,
        getHomeGraph,
        sendNotifToken,
        setupNotifications,
    };
});
