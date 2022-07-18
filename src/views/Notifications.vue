<template>
  <ion-page>
    <Header />
    <ion-content :fullscreen="true">
      <SkeletonNotifications v-if="loading" />
      <ion-list lines="full" v-else>
        <ion-item
          v-for="notification in notifications.filter(
            (not) => not.date <= date
          )"
          :key="notification.id"
          @click="modal(notification)"
          detail
          button
        >
          <ion-icon
            slot="start"
            :md="notification.ionIcon"
            :ios="notification.ionIcon"
          ></ion-icon>
          <div style="display: flex; flex-direction: column">
            <ion-text>{{ notification.title }}</ion-text>
            <ion-note>
              {{ extractContent(notification.body || "").substring(0, 30) }}...
            </ion-note>
          </div>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, Ref } from "@vue/reactivity";

import {
  IonPage,
  IonContent,
  IonItem,
  IonIcon,
  IonList,
  IonNote,
  IonText,
  modalController,
} from "@ionic/vue";
import * as ionicons from "ionicons/icons";

import { Network } from "@capacitor/network";
import { Http } from "@capacitor-community/http";

import Header from "../components/Header.vue";
import SkeletonNotifications from "@/components/SkeletonNotifications.vue";
import NotificationModalVue from "@/components/NotificationModal.vue";

import { logEvent } from "firebase/analytics";

import { Notification, RawNotification, NotificationType } from "@/types";
import { analytics, performance } from "@/firebase";
import { trace } from "firebase/performance";

const loading = ref(true);
let notificationOpen = false;

//#region CONNECTION
const connected = ref(true);
(async () => {
  const status = await Network.getStatus();
  connected.value = status.connected;
})();
Network.addListener("networkStatusChange", (status) => {
  connected.value = status.connected;
});
//#endregion

const date = ref(new Date());

const notifications: Ref<Notification[]> = ref([]);

const loadTrace = trace(performance, "fetch_notifications");
(async () => {
  loadTrace.start();
  console.info("Notifications > Requesting");
  const res = await Http.get({
    url: "https://raw.githubusercontent.com/biocienciasgrx/ceebi/master/notificaciones.json",
  });
  console.info(res.data);
  const data = JSON.parse(res.data);
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
        // @ts-expect-error Cannot index ionicons with string, but I ensure I'm indexing with a icon name
        ionicons[`${not.icon || "paperPlane"}Outline`] ||
        ionicons.paperPlaneOutline,
    })
  );
  loading.value = false;
  loadTrace.stop();
})();

const modal = async (notification: Notification) => {
  if (!notificationOpen) {
    notificationOpen = true;
    console.info(notification);
    logEvent(analytics, `notification_${notification.id}`);
    const m = await modalController.create({
      component: NotificationModalVue,
      breakpoints: [0, 0.35, 0.65, 1],
      initialBreakpoint: 0.35,
      componentProps: notification,
    });
    m.onDidDismiss().then(() => (notificationOpen = false));
    m.present();
  }
};

const extractContent = (html: string) => {
  const span = document.createElement("span");
  span.innerHTML = html;
  return span.textContent || span.innerText;
};
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
