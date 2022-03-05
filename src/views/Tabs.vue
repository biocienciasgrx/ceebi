<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="qrcode" href="/code" @click="log('code')">
          <ion-icon :icon="triangle" />
          <ion-label>{{ $t("message.tabQRCode") }}</ion-label>
        </ion-tab-button>

        <ion-tab-button
          tab="schedule"
          href="/schedule"
          @click="log('schedule')"
        >
          <ion-icon :icon="ellipse" />
          <ion-label>{{ $t("message.tabSchedule") }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="news" href="/news" @click="log('schedule')">
          <ion-icon :icon="square" />
          <ion-label>{{ $t("message.tabNews") }}</ion-label>
        </ion-tab-button>

        <ion-tab-button
          tab="about"
          href="/notifications"
          @click="log('notifications')"
        >
          <ion-icon :icon="notificationsOutline" />
          <ion-label>{{ $t("message.tabNotifications") }}</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { analytics } from "@/firebase";
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
} from "@ionic/vue";
import { logEvent } from "firebase/analytics";
import {
  calendarOutline as ellipse,
  newspaperOutline as square,
  qrCodeOutline as triangle,
  notificationsOutline,
} from "ionicons/icons";

const log = (to: string) => logEvent(analytics, `navigate_${to}`);
</script>
