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
        <ion-item
          v-for="notification in notifications"
          :key="notification.id"
          detail
          :_router-link="`/notifications/${notification.id}`"
          button
        >
          <ion-icon
            slot="start"
            :md="paperPlaneOutline"
            :ios="paperPlaneOutline"
          ></ion-icon>
          <div style="display: flex; flex-direction: column">
            <ion-text>{{ notification.title }}</ion-text>
            <ion-note
              >{{ (notification.body || "").substring(0, 30) }}...</ion-note
            >
          </div>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
// :_md="
//               notification.type === NotificationType.PUSH
//                 ? paperPlaneOutline
//                 : calendarClearOutline
//             "
//             :_ios="
//               notification.type === NotificationType.PUSH
//                 ? paperPlaneOutline
//                 : calendarClearOutline
//             "

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
} from "@ionic/vue";
import { warningOutline } from "ionicons/icons";

import Header from "../components/Header.vue";
import SkeletonNotifications from "@/components/SkeletonNotifications.vue";

import { paperPlaneOutline, calendarClearOutline } from "ionicons/icons";

import { Network } from "@capacitor/network";
import { Storage } from "@capacitor/storage";

import { KEY_NOTIFICATIONS } from "@/vars";
import { PushNotificationSchema } from "@capacitor/push-notifications";

const loading = ref(true);

const connected = ref(true);
(async () => {
  const status = await Network.getStatus();
  connected.value = status.connected;
})();
Network.addListener("networkStatusChange", (status) => {
  connected.value = status.connected;
});

enum NotificationType {
  PUSH,
  EVENT,
}

const notifications: Ref<PushNotificationSchema[]> = ref([]);
// {
//     type: NotificationType.PUSH,
//     title: "Inscripciones abiertas!",
//     body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, voluptatum. Nam odit ad praesentium numquam optio vero vel vitae eligendi, ipsa porro suscipit iure accusamus et cum distinctio! Repellat voluptas, minus et nulla iste velit mollitia ea quis magnam quo soluta veritatis libero commodi quibusdam neque aliquam quidem id ducimus? Tenetur nesciunt magnam ipsa quos perferendis, consectetur consequuntur sapiente id reiciendis eius. Unde nisi nobis consectetur accusamus, exercitationem, veniam quos nesciunt repellat, nihil ducimus illum quisquam reiciendis excepturi! Earum, quod omnis ea nostrum quia, ipsam alias quae officia fuga mollitia repellendus, in enim itaque adipisci. Facere dignissimos ullam eius dolor!",
//   },

(async () => {
  const { value: notificationsJSON } = await Storage.get({
    key: KEY_NOTIFICATIONS,
  });
  notifications.value = JSON.parse(notificationsJSON || "[]");
  console.info("hey ma, notifications", notifications.value);
  await new Promise((r) => setTimeout(r, 2000));
  loading.value = false;
})();

// const notificationLines = computed(() => (connected.value ? "full" : "none"));

// function changed(ev) {
//   console.info("toggle", ev);
//   connected.value = !connected.value;
//   console.info("connected? ", connected.value);
// }
</script>

<style></style>
