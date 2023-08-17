import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyAucBbldmHvC2YxZ4d4w6W_KLaAsRuJjpA",
    authDomain: "vue-push-notifications-296a8.firebaseapp.com",
    projectId: "vue-push-notifications-296a8",
    storageBucket: "vue-push-notifications-296a8.appspot.com",
    messagingSenderId: "365691417480",
    appId: "1:825950088067:web:b7c49a380b2463779064b6",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Export the messaging instance
export { messaging as firebaseMessaging, getToken };

// Register the service worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
            console.log(
                "Service Worker registered with scope:",
                registration.scope
            );
        })
        .catch((error) => {
            console.error("Service Worker registration failed:", error);
        });
}
