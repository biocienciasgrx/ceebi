import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { IonicVue, isPlatform } from "@ionic/vue";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/* Theme variables */
import "./theme/variables.css";

import { Device } from "@capacitor/device";
import { Storage } from "@capacitor/storage";
import { ScreenOrientation } from "@awesome-cordova-plugins/screen-orientation";
import { createI18n } from "vue-i18n";
import * as locale from "locale-codes";

import messages from "./translations";
import {
  KEY_LOCALE,
  firebaseConfig,
  FIREBASE_APP,
  FIREBASE_ANALYTICS,
} from "./vars";

//* I18n
const i18n = createI18n({
  fallbackLocale: "en",
  //@ts-ignore
  messages,
});
Storage.keys().then(({ keys }) => {
  if (!keys.includes(KEY_LOCALE))
    Device.getLanguageCode().then(({ value }) => {
      //@ts-ignore
      i18n.global.locale = locale.getByTag(value.toLowerCase())["iso639-1"];
      console.log(
        "device locale: ",
        value,
        ". Set locale: ",
        i18n.global.locale
      );
    });
  else
    Storage.get({ key: KEY_LOCALE }).then(
      //@ts-ignore
      ({ value }) => (i18n.global.locale = value) // The saved value will always be a valid locale code
    );
});
//* =====

//* Firebase
// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAnalytics = getAnalytics(firebaseApp);
console.info(firebaseAnalytics);
//* ======

//* ===== Vue
const app = createApp(App).use(IonicVue).use(i18n).use(router);
app.provide(FIREBASE_APP, firebaseApp);
app.provide(FIREBASE_ANALYTICS, firebaseAnalytics);

router.isReady().then(() => {
  if (isPlatform("mobile")) {
    // Lock orientation to vertical
    ScreenOrientation.lock(ScreenOrientation.ORIENTATIONS.PORTRAIT);
  }
  app.mount("#app");
});
//* =====
