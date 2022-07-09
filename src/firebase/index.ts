// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyA0zQcup3Kqg41rRebY9DIgN1jN1_SHyPE",
	authDomain: "monopoly-cash-29.firebaseapp.com",
	projectId: "monopoly-cash-29",
	storageBucket: "monopoly-cash-29.appspot.com",
	messagingSenderId: "467514172954",
	appId: "1:467514172954:web:7448634ad80cb0b14653a3",
	measurementId: "G-FVJS5MM57B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const DB = getFirestore(app);
