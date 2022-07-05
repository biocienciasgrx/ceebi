export const IMAGES_DIRECTORY = "images";
export const MECENAS_JSON_PATH = "mecenas.json";

//* Storage keys
export const STORAGE_PREFIX = "ceebi";
// TODO Manually type these so it doesn't run the sum each time the file is imported
export const KEY_ID = STORAGE_PREFIX + "ID";
export const KEY_LOCALE = STORAGE_PREFIX + "Locale";
export const KEY_NOTIFICATIONS = STORAGE_PREFIX + "Notifications";
export const KEY_DARK_MODE = STORAGE_PREFIX + "DarkMode";

//* MEC Properties for events
export const EVENT_ICON_FIELD_LABEL = "Icono";

//* Firebase
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyAzeQ3iQTY9mYBbacYdWbCUCfWiWlIXA_8",
  authDomain: "ceebi-client.firebaseapp.com",
  projectId: "ceebi-client",
  storageBucket: "ceebi-client.appspot.com",
  messagingSenderId: "349028882075",
  appId: "1:349028882075:web:2d4fe842b9485ef1a2d83e",
  measurementId: "G-QEWRLGY5SV",
};

//* Provide/Inject
export const FIREBASE_APP = "firebaseApp";
export const FIREBASE_ANALYTICS = "firebaseAnalytics";
export const FIREBASE_PERFORMANCE = "firebasePerformance";
