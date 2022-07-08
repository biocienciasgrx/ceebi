// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyAzeQ3iQTY9mYBbacYdWbCUCfWiWlIXA_8",
  authDomain: "ceebi-client.firebaseapp.com",
  projectId: "ceebi-client",
  storageBucket: "ceebi-client.appspot.com",
  messagingSenderId: "349028882075",
  appId: "1:349028882075:web:2d4fe842b9485ef1a2d83e",
  measurementId: "G-QEWRLGY5SV",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const performance = getPerformance(app);
export const firestore = getFirestore(app);
