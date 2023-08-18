importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
    "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

firebase.initializeApp({
    apiKey: "AIzaSyAucBbldmHvC2YxZ4d4w6W_KLaAsRuJjpA",
    authDomain: "happyguest-ipl.firebaseapp.com",
    projectId: "happyguest-ipl",
    storageBucket: "happyguest-ipl.appspot.com",
    messagingSenderId: "825950088067",
    appId: "1:825950088067:web:b7c49a380b2463779064b6",
    measurementId: "G-G7JHEECZ5T",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "/logo.png",
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
