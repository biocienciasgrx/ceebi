<template>
  <ion-header :collapse="condense ? 'condense' : undefined">
    <ion-toolbar id="toolbar">
      <!-- <ion-title size="large">Tab 3</ion-title> -->
      <img :src="logoHorizontal" alt="CEEBI" slot="start" />

      <ion-buttons slot="end">
        <ion-button
          @click="
            goto('https://www.instagram.com/biocienciasgrx/', 'instagram')
          "
        >
          <ion-icon :icon="logoInstagram"></ion-icon>
        </ion-button>
        <ion-button @click="goto('https://biociencias.es/', 'webpage')">
          <ion-icon :icon="globeOutline"></ion-icon>
        </ion-button>
        <ion-button @click="link('/about', 'about')">
          <ion-icon :icon="informationCircleOutline"></ion-icon>
        </ion-button>
        <ion-button @click="link('/settings', 'settings')">
          <ion-icon :icon="settingsOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
    <slot></slot>
  </ion-header>
</template>

<script setup lang="ts">
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import {
  logoInstagram,
  globeOutline,
  informationCircleOutline,
  settingsOutline,
} from "ionicons/icons";
// @ts-ignore
import logoHorizontalNegro from "../../public/assets/logo_horizontal.png";
import logoHorizontalBlanco from "../../public/assets/logo_horizontal_blanco.png";
import { useRouter } from "vue-router";
// import { FIREBASE_ANALYTICS } from "@/vars";
// import { inject } from "@vue/runtime-core";
import { logEvent } from "firebase/analytics";
import { FirebaseCrashlytics } from "@capacitor-community/firebase-crashlytics";
import { computed, onMounted, ref } from "vue";
import { analytics } from "@/firebase";
import { toggleDarkMode } from "@/ui";
import { getDarkMode, isDarkMode } from "@/darkMode";

defineProps<{
  condense?: boolean;
}>();

const router = useRouter();

// const analytics = inject(FIREBASE_ANALYTICS);

// analytics,
const goto = (url: string, msg: string) => {
  logEvent(analytics, "open_" + msg);
  window.location.href = url;
};

const logoHorizontal = computed(() =>
  isDarkMode.value ? logoHorizontalBlanco : logoHorizontalNegro
);

function link(url: string, name: string) {
  logEvent(analytics, "navigate_" + name);
  router.push(url);
}

// TODO Destroy mutation observer when doc gets destroyed
</script>

<style scoped>
#toolbar {
  padding: 10px 20px;
  padding-top: max(env(safe-area-inset-top, 10px), 10px);
}

#toolbar > img {
  height: 50px;
}
</style>
