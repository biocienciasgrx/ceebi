<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="qrcode" href="/code">
          <ion-icon :icon="triangle" />
          <ion-label>{{ $t("message.tabQRCode") }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="schedule" href="/schedule">
          <ion-icon :icon="ellipse" />
          <ion-label>{{ $t("message.tabSchedule") }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="news" href="/news">
          <ion-icon :icon="square" />
          <ion-label>{{ $t("message.tabNews") }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="about" href="/notifications">
          <ion-icon :icon="notificationsOutline" />
          <ion-label>{{ $t("message.tabNotifications") }}</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
} from "@ionic/vue";
import {
  calendarOutline as ellipse,
  newspaperOutline as square,
  qrCodeOutline as triangle,
  notificationsOutline,
} from "ionicons/icons";
</script>
