<template>
  <ion-header translucent>
    <ion-toolbar>
      <ion-title>{{ title }}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="dismissModal()">{{
          $t("message.close")
        }}</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content fullscreen>
    <div class="ion-padding">
      <ion-text class="block" v-html="body"></ion-text>
      <ion-text color="medium" class="block smaller ion-margin-top"
        >Sent on {{ date.toLocaleString() }}</ion-text
      >
    </div>
    <ion-item
      v-for="button in buttons || []"
      :key="(button.icon || 'undef') + button.text"
      @click="open(button.link)"
      button
      lines="full"
    >
      <ion-icon
        v-if="button.icon !== undefined"
        slot="start"
        class="ion-margin-right"
        :color="button.iconColor"
        :md="getIcon(button.icon)"
        :ios="getIcon(button.icon)"
      ></ion-icon>
      <ion-text :color="button.color">{{ button.text }}</ion-text>
    </ion-item>
  </ion-content>
</template>

<script setup lang="ts">
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonText,
  IonItem,
  IonIcon,
  modalController,
} from "@ionic/vue";
import * as ionicons from "ionicons/icons";

import { defineProps, inject } from "@vue/runtime-core";

import { ButtonSettings } from "@/types";
import { Browser } from "@capacitor/browser";
import { Analytics, logEvent } from "firebase/analytics";
import { FIREBASE_ANALYTICS } from "@/vars";

const props = defineProps<{
  id: string;
  title: string;
  body: string;
  date: Date;
  buttons?: ButtonSettings[];
}>();

const analytics = inject(FIREBASE_ANALYTICS) as Analytics;

const dismissModal = () => {
  modalController.dismiss();
};

// @ts-expect-error
const getIcon = (name: string): string => ionicons[`${name}Outline`];

const open = (url: string, buttonId?: string) => {
  if (buttonId !== undefined)
    logEvent(analytics, `notification_${props.id}_${buttonId}`);
  Browser.open({ url });
};
</script>

<style scoped>
.block {
  display: block;
}

.smaller {
  font-size: smaller;
}
</style>
