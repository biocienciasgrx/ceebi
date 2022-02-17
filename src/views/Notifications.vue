<template>
  <ion-page>
    <Header />
    <ion-content :fullscreen="true">
      <!-- <Header condense /> -->
      <!-- <ion-item :lines="notificationLines">
        <ion-label>Enable event notifications</ion-label>
        <ion-toggle
          :value="connected"
          @ionChange="changed($event)"
        ></ion-toggle>
      </ion-item> -->
      <ion-item v-if="!connected" color="warning" lines="none">
        <ion-icon :icon="warningOutline" slot="start"></ion-icon>
        <ion-label
          >You are not connected, push notifications won't work</ion-label
        >
      </ion-item>

      <SkeletonNotifications v-if="loading" />
      <ion-list lines="full" v-else>
        <template
          v-for="notification in notifications.filter(
            (not) => not.date <= date
          )"
          :key="notification.id"
        >
          <ion-item @click="modal(notification)" detail button>
            <ion-icon
              slot="start"
              :md="notification.ionIcon"
              :ios="notification.ionIcon"
            ></ion-icon>
            <div style="display: flex; flex-direction: column">
              <ion-text>{{ notification.title }}</ion-text>
              <ion-note
                >{{
                  extractContent(notification.body || "").substring(0, 30)
                }}...</ion-note
              >
            </div>
          </ion-item>
        </template>
      </ion-list>
      <div
        class="container"
        v-if="notifications.filter((not) => not.date <= date).length === 0"
      >
        <ion-icon
          :md="notificationsOffOutline"
          :ios="notificationsOffOutline"
          size="large"
        ></ion-icon>
        <ion-note>{{ $t("message.noNotificationsYet") }}</ion-note>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, Ref } from "@vue/reactivity";

import {
  IonPage,
  IonContent,
  IonItem,
  IonLabel,
  IonIcon,
  IonList,
  IonNote,
  IonText,
  modalController,
} from "@ionic/vue";
import { warningOutline, notificationsOffOutline } from "ionicons/icons";
import * as ionicons from "ionicons/icons";
// import { paperPlaneOutline, calendarClearOutline } from "ionicons/icons";

import { Network } from "@capacitor/network";
import { Http } from "@capacitor-community/http";

import Header from "../components/Header.vue";
import SkeletonNotifications from "@/components/SkeletonNotifications.vue";
import NotificationModalVue from "@/components/NotificationModal.vue";

import { FIREBASE_ANALYTICS } from "@/vars";
import { Notification, RawNotification, NotificationType } from "@/types";
import { Analytics, logEvent } from "firebase/analytics";
import { inject } from "@vue/runtime-core";

const loading = ref(true);

const connected = ref(true);
(async () => {
  const status = await Network.getStatus();
  connected.value = status.connected;
})();
Network.addListener("networkStatusChange", (status) => {
  connected.value = status.connected;
});

const analytics = inject(FIREBASE_ANALYTICS) as Analytics;

const date = ref(new Date());

const notifications: Ref<Notification[]> = ref([]);
(async () => {
  console.info("Notifications > Requesting");
  const res = await Http.get({
    url: "https://raw.githubusercontent.com/biocienciasgrx/ceebi/master/notificaciones.json",
  });
  console.info(res.data);
  const data = JSON.parse(res.data);
  // const res = await fetch(
  //   "https://raw.githubusercontent.com/biocienciasgrx/ceebi/master/notificaciones.json"
  // );
  // console.info(res.c);
  // const data: RawNotification[] = await res.json();
  notifications.value = data.map(
    (not: RawNotification): Notification => ({
      ...not,
      type: NotificationType.PUSH,
      date: new Date(
        not.schedule.year || 2022,
        not.schedule.month === undefined ? 6 : not.schedule.month - 1,
        not.schedule.day || 0,
        not.schedule.hour || 0,
        not.schedule.minutes || 0,
        not.schedule.seconds || 0
      ),
      ionIcon:
        // @ts-expect-error
        ionicons[`${not.icon || "paperPlane"}Outline`] ||
        ionicons.paperPlaneOutline,
    })
  );
  loading.value = false;
})();

const modal = async (notification: Notification) => {
  console.info(notification);
  logEvent(analytics, `notification_${notification.id}`);
  const m = await modalController.create({
    component: NotificationModalVue,
    breakpoints: [0, 0.35, 0.65, 1],
    initialBreakpoint: 0.35,
    componentProps: notification,
  });
  m.present();
};

const extractContent = (html: string) => {
  const span = document.createElement("span");
  span.innerHTML = html;
  return span.textContent || span.innerText;
};

// (async () => {
//   const { value: notificationsJSON } = await Storage.get({
//     key: KEY_NOTIFICATIONS,
//   });
//   notifications.value = JSON.parse(notificationsJSON || "[]");
//   console.info("hey ma, notifications", notifications.value);
//   await new Promise((r) => setTimeout(r, 2000));
//   loading.value = false;
// })();
</script>

<style scoped>
.container {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.container > ion-icon {
  margin-bottom: 0.2em;
}

.container > ion-note {
  margin-top: 0.3em;
}
</style>
