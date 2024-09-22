// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDCkO7s1NgB9nINqxpQgtKEo0HkauftOCo",
    authDomain: "recieasy.firebaseapp.com",
    projectId: "recieasy",
    storageBucket: "recieasy.appspot.com",
    messagingSenderId: "305797389165",
    appId: "1:305797389165:web:b6857dbcda811fa2f59864",
    measurementId: "G-X9KJLGS5YY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, createUserWithEmailAndPassword };