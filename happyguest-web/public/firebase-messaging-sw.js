importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyAucBbldmHvC2YxZ4d4w6W_KLaAsRuJjpA",
    authDomain: "vue-push-notifications-296a8.firebaseapp.com",
    projectId: "vue-push-notifications-296a8",
    storageBucket: "vue-push-notifications-296a8.appspot.com",
    messagingSenderId: "365691417480",
    appId: "1:825950088067:web:b7c49a380b2463779064b6",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Optional: Customize notification behavior
messaging.setBackgroundMessageHandler((payload) => {
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
        click_action: payload.notification.click_action,
    };

    return self.registration.showNotification(
        payload.notification.title,
        notificationOptions
    );
});
