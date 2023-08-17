import firebase from "firebase/app";
import "firebase/firebase-messaging";

const firebaseConfig = {
    apiKey: "AIzaSyAucBbldmHvC2YxZ4d4w6W_KLaAsRuJjpA",
    authDomain: "happyguest-ipl.firebaseapp.com",
    projectId: "happyguest-ipl",
    storageBucket: "happyguest-ipl.appspot.com",
    messagingSenderId: "825950088067",
    appId: "1:825950088067:web:b7c49a380b2463779064b6",
    measurementId: "G-G7JHEECZ5T",
};

firebase.initializeApp(firebaseConfig);

export default firebase.messaging();
