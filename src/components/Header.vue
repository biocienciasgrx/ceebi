<template>
  <ion-header :collapse="condense ? 'condense' : undefined" class="header">
    <ion-toolbar id="toolbar">
      <!-- <ion-title size="large">Tab 3</ion-title> -->
      <img :src="logoHorizontal" alt="CEEBI" slot="start" />

      <ion-buttons slot="end">
        <ion-button
          href="https://www.instagram.com/biocienciasGRX/"
          target="_blank"
        >
          <ion-icon :icon="logoInstagram"></ion-icon>
        </ion-button>
        <ion-button href="https://biociencias.es/" target="_blank">
          <ion-icon :icon="globeOutline"></ion-icon>
        </ion-button>
        <ion-button @click="link('/about')">
          <ion-icon :icon="informationCircleOutline"></ion-icon>
        </ion-button>
        <ion-button @click="link('/settings')">
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

export default {
  props: {
    condense: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  components: { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon },
  setup() {
    const router = useRouter();

    return {
      logoHorizontal,

      // Icons
      logoInstagram,
      globeOutline,
      informationCircleOutline,
      settingsOutline,

      link(to: string) {
        router.push(to);
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
