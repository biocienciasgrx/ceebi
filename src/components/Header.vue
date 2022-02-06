<template>
  <ion-header :collapse="condense ? 'condense' : undefined" class="header">
    <ion-toolbar id="toolbar">
      <!-- <ion-title size="large">Tab 3</ion-title> -->
      <img :src="logoHorizontal" alt="CEEBI" slot="start" />

      <ion-buttons slot="end">
        <ion-button
          @click="
            goto('https://www.instagram.com/biocienciasGRX/', 'instagram')
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

<script lang="ts">
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
import logoHorizontal from "../../public/assets/logo_horizontal.png";
import { useRouter } from "vue-router";
import { FIREBASE_ANALYTICS } from "@/vars";
import { inject } from "@vue/runtime-core";
import { logEvent } from "firebase/analytics";

export default {
  props: {
    condense: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  components: { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon },
  // inject: [FIREBASE_ANALYTICS],
  setup() {
    const router = useRouter();

    const analytics = inject(FIREBASE_ANALYTICS);

    return {
      // analytics,
      goto: (url: string, msg: string) => {
        //@ts-expect-error
        logEvent(analytics, "open_" + msg);
        window.location.href = url;
      },

      logoHorizontal,

      // Icons
      logoInstagram,
      globeOutline,
      informationCircleOutline,
      settingsOutline,

      link(url: string, name: string) {
        //@ts-expect-error
        logEvent(analytics, "navigate_" + name);
        router.push(url);
      },
    };
  },
};
</script>

<style scoped>
header {
  z-index: 40;
}

#toolbar {
  padding: 10px 20px;
}

#toolbar > img {
  height: 50px;
}
</style>
