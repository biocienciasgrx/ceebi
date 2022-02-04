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

      <ion-list lines="full">
        <ion-item
          v-for="notification in notifications"
          :key="notifications.indexOf(notification)"
          detail
          :_router-link="`/notifications/${notification.id}`"
          button
        >
          <ion-icon
            slot="start"
            :md="
              notification.type === NotificationType.PUSH
                ? paperPlaneOutline
                : calendarClearOutline
            "
            :ios="
              notification.type === NotificationType.PUSH
                ? paperPlaneOutline
                : calendarClearOutline
            "
          ></ion-icon>
          <div style="display: flex; flex-direction: column">
            <ion-text>{{ notification.title }}</ion-text>
            <ion-note>{{ notification.body.substring(0, 30) }}...</ion-note>
          </div>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "@vue/reactivity";

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

import { paperPlaneOutline, calendarClearOutline } from "ionicons/icons";

import { Network } from "@capacitor/network";

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

const notifications = ref([
  {
    id: 0,
    type: NotificationType.PUSH,
    title: "Inscripciones abiertas!",
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, voluptatum. Nam odit ad praesentium numquam optio vero vel vitae eligendi, ipsa porro suscipit iure accusamus et cum distinctio! Repellat voluptas, minus et nulla iste velit mollitia ea quis magnam quo soluta veritatis libero commodi quibusdam neque aliquam quidem id ducimus? Tenetur nesciunt magnam ipsa quos perferendis, consectetur consequuntur sapiente id reiciendis eius. Unde nisi nobis consectetur accusamus, exercitationem, veniam quos nesciunt repellat, nihil ducimus illum quisquam reiciendis excepturi! Earum, quod omnis ea nostrum quia, ipsam alias quae officia fuga mollitia repellendus, in enim itaque adipisci. Facere dignissimos ullam eius dolor!",
  },
  {
    id: 1,
    type: NotificationType.EVENT,
    title: "Evento 1 empieza en 15 minutos!", // Time should be loaded from settings and inserted here, maybe using vuex/pinia is a good option?
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, voluptatum. Nam odit ad praesentium numquam optio vero vel vitae eligendi, ipsa porro suscipit iure accusamus et cum distinctio! Repellat voluptas, minus et nulla iste velit mollitia ea quis magnam quo soluta veritatis libero commodi quibusdam neque aliquam quidem id ducimus? Tenetur nesciunt magnam ipsa quos perferendis, consectetur consequuntur sapiente id reiciendis eius. Unde nisi nobis consectetur accusamus, exercitationem, veniam quos nesciunt repellat, nihil ducimus illum quisquam reiciendis excepturi! Earum, quod omnis ea nostrum quia, ipsam alias quae officia fuga mollitia repellendus, in enim itaque adipisci. Facere dignissimos ullam eius dolor!",
  },
  {
    id: 2,
    type: NotificationType.EVENT,
    title: "Evento 1 empieza en 15 minutos!", // Time should be loaded from settings and inserted here, maybe using vuex/pinia is a good option?
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, voluptatum. Nam odit ad praesentium numquam optio vero vel vitae eligendi, ipsa porro suscipit iure accusamus et cum distinctio! Repellat voluptas, minus et nulla iste velit mollitia ea quis magnam quo soluta veritatis libero commodi quibusdam neque aliquam quidem id ducimus? Tenetur nesciunt magnam ipsa quos perferendis, consectetur consequuntur sapiente id reiciendis eius. Unde nisi nobis consectetur accusamus, exercitationem, veniam quos nesciunt repellat, nihil ducimus illum quisquam reiciendis excepturi! Earum, quod omnis ea nostrum quia, ipsam alias quae officia fuga mollitia repellendus, in enim itaque adipisci. Facere dignissimos ullam eius dolor!",
  },
  {
    id: 3,
    type: NotificationType.EVENT,
    title: "Evento 1 empieza en 15 minutos!", // Time should be loaded from settings and inserted here, maybe using vuex/pinia is a good option?
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, voluptatum. Nam odit ad praesentium numquam optio vero vel vitae eligendi, ipsa porro suscipit iure accusamus et cum distinctio! Repellat voluptas, minus et nulla iste velit mollitia ea quis magnam quo soluta veritatis libero commodi quibusdam neque aliquam quidem id ducimus? Tenetur nesciunt magnam ipsa quos perferendis, consectetur consequuntur sapiente id reiciendis eius. Unde nisi nobis consectetur accusamus, exercitationem, veniam quos nesciunt repellat, nihil ducimus illum quisquam reiciendis excepturi! Earum, quod omnis ea nostrum quia, ipsam alias quae officia fuga mollitia repellendus, in enim itaque adipisci. Facere dignissimos ullam eius dolor!",
  },
  {
    type: NotificationType.EVENT,
    title: "Evento 1 empieza en 15 minutos!", // Time should be loaded from settings and inserted here, maybe using vuex/pinia is a good option?
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, voluptatum. Nam odit ad praesentium numquam optio vero vel vitae eligendi, ipsa porro suscipit iure accusamus et cum distinctio! Repellat voluptas, minus et nulla iste velit mollitia ea quis magnam quo soluta veritatis libero commodi quibusdam neque aliquam quidem id ducimus? Tenetur nesciunt magnam ipsa quos perferendis, consectetur consequuntur sapiente id reiciendis eius. Unde nisi nobis consectetur accusamus, exercitationem, veniam quos nesciunt repellat, nihil ducimus illum quisquam reiciendis excepturi! Earum, quod omnis ea nostrum quia, ipsam alias quae officia fuga mollitia repellendus, in enim itaque adipisci. Facere dignissimos ullam eius dolor!",
  },
  {
    type: NotificationType.PUSH,
    title: "Inscripciones abiertas!",
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, voluptatum. Nam odit ad praesentium numquam optio vero vel vitae eligendi, ipsa porro suscipit iure accusamus et cum distinctio! Repellat voluptas, minus et nulla iste velit mollitia ea quis magnam quo soluta veritatis libero commodi quibusdam neque aliquam quidem id ducimus? Tenetur nesciunt magnam ipsa quos perferendis, consectetur consequuntur sapiente id reiciendis eius. Unde nisi nobis consectetur accusamus, exercitationem, veniam quos nesciunt repellat, nihil ducimus illum quisquam reiciendis excepturi! Earum, quod omnis ea nostrum quia, ipsam alias quae officia fuga mollitia repellendus, in enim itaque adipisci. Facere dignissimos ullam eius dolor!",
  },
  {
    type: NotificationType.EVENT,
    title: "Evento 1 empieza en 15 minutos!", // Time should be loaded from settings and inserted here, maybe using vuex/pinia is a good option?
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, voluptatum. Nam odit ad praesentium numquam optio vero vel vitae eligendi, ipsa porro suscipit iure accusamus et cum distinctio! Repellat voluptas, minus et nulla iste velit mollitia ea quis magnam quo soluta veritatis libero commodi quibusdam neque aliquam quidem id ducimus? Tenetur nesciunt magnam ipsa quos perferendis, consectetur consequuntur sapiente id reiciendis eius. Unde nisi nobis consectetur accusamus, exercitationem, veniam quos nesciunt repellat, nihil ducimus illum quisquam reiciendis excepturi! Earum, quod omnis ea nostrum quia, ipsam alias quae officia fuga mollitia repellendus, in enim itaque adipisci. Facere dignissimos ullam eius dolor!",
  },
  {
    type: NotificationType.PUSH,
    title: "Inscripciones abiertas!",
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, voluptatum. Nam odit ad praesentium numquam optio vero vel vitae eligendi, ipsa porro suscipit iure accusamus et cum distinctio! Repellat voluptas, minus et nulla iste velit mollitia ea quis magnam quo soluta veritatis libero commodi quibusdam neque aliquam quidem id ducimus? Tenetur nesciunt magnam ipsa quos perferendis, consectetur consequuntur sapiente id reiciendis eius. Unde nisi nobis consectetur accusamus, exercitationem, veniam quos nesciunt repellat, nihil ducimus illum quisquam reiciendis excepturi! Earum, quod omnis ea nostrum quia, ipsam alias quae officia fuga mollitia repellendus, in enim itaque adipisci. Facere dignissimos ullam eius dolor!",
  },
  {
    type: NotificationType.EVENT,
    title: "Evento 1 empieza en 15 minutos!", // Time should be loaded from settings and inserted here, maybe using vuex/pinia is a good option?
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, voluptatum. Nam odit ad praesentium numquam optio vero vel vitae eligendi, ipsa porro suscipit iure accusamus et cum distinctio! Repellat voluptas, minus et nulla iste velit mollitia ea quis magnam quo soluta veritatis libero commodi quibusdam neque aliquam quidem id ducimus? Tenetur nesciunt magnam ipsa quos perferendis, consectetur consequuntur sapiente id reiciendis eius. Unde nisi nobis consectetur accusamus, exercitationem, veniam quos nesciunt repellat, nihil ducimus illum quisquam reiciendis excepturi! Earum, quod omnis ea nostrum quia, ipsam alias quae officia fuga mollitia repellendus, in enim itaque adipisci. Facere dignissimos ullam eius dolor!",
  },
  {
    type: NotificationType.EVENT,
    title: "Evento 1 empieza en 15 minutos!", // Time should be loaded from settings and inserted here, maybe using vuex/pinia is a good option?
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, voluptatum. Nam odit ad praesentium numquam optio vero vel vitae eligendi, ipsa porro suscipit iure accusamus et cum distinctio! Repellat voluptas, minus et nulla iste velit mollitia ea quis magnam quo soluta veritatis libero commodi quibusdam neque aliquam quidem id ducimus? Tenetur nesciunt magnam ipsa quos perferendis, consectetur consequuntur sapiente id reiciendis eius. Unde nisi nobis consectetur accusamus, exercitationem, veniam quos nesciunt repellat, nihil ducimus illum quisquam reiciendis excepturi! Earum, quod omnis ea nostrum quia, ipsam alias quae officia fuga mollitia repellendus, in enim itaque adipisci. Facere dignissimos ullam eius dolor!",
  },
  {
    type: NotificationType.PUSH,
    title: "Inscripciones abiertas!",
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, voluptatum. Nam odit ad praesentium numquam optio vero vel vitae eligendi, ipsa porro suscipit iure accusamus et cum distinctio! Repellat voluptas, minus et nulla iste velit mollitia ea quis magnam quo soluta veritatis libero commodi quibusdam neque aliquam quidem id ducimus? Tenetur nesciunt magnam ipsa quos perferendis, consectetur consequuntur sapiente id reiciendis eius. Unde nisi nobis consectetur accusamus, exercitationem, veniam quos nesciunt repellat, nihil ducimus illum quisquam reiciendis excepturi! Earum, quod omnis ea nostrum quia, ipsam alias quae officia fuga mollitia repellendus, in enim itaque adipisci. Facere dignissimos ullam eius dolor!",
  },
  {
    type: NotificationType.PUSH,
    title: "Inscripciones abiertas!",
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, voluptatum. Nam odit ad praesentium numquam optio vero vel vitae eligendi, ipsa porro suscipit iure accusamus et cum distinctio! Repellat voluptas, minus et nulla iste velit mollitia ea quis magnam quo soluta veritatis libero commodi quibusdam neque aliquam quidem id ducimus? Tenetur nesciunt magnam ipsa quos perferendis, consectetur consequuntur sapiente id reiciendis eius. Unde nisi nobis consectetur accusamus, exercitationem, veniam quos nesciunt repellat, nihil ducimus illum quisquam reiciendis excepturi! Earum, quod omnis ea nostrum quia, ipsam alias quae officia fuga mollitia repellendus, in enim itaque adipisci. Facere dignissimos ullam eius dolor!",
  },
  {
    type: NotificationType.PUSH,
    title: "Inscripciones abiertas!",
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, voluptatum. Nam odit ad praesentium numquam optio vero vel vitae eligendi, ipsa porro suscipit iure accusamus et cum distinctio! Repellat voluptas, minus et nulla iste velit mollitia ea quis magnam quo soluta veritatis libero commodi quibusdam neque aliquam quidem id ducimus? Tenetur nesciunt magnam ipsa quos perferendis, consectetur consequuntur sapiente id reiciendis eius. Unde nisi nobis consectetur accusamus, exercitationem, veniam quos nesciunt repellat, nihil ducimus illum quisquam reiciendis excepturi! Earum, quod omnis ea nostrum quia, ipsam alias quae officia fuga mollitia repellendus, in enim itaque adipisci. Facere dignissimos ullam eius dolor!",
  },
  {
    type: NotificationType.PUSH,
    title: "Inscripciones abiertas!",
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, voluptatum. Nam odit ad praesentium numquam optio vero vel vitae eligendi, ipsa porro suscipit iure accusamus et cum distinctio! Repellat voluptas, minus et nulla iste velit mollitia ea quis magnam quo soluta veritatis libero commodi quibusdam neque aliquam quidem id ducimus? Tenetur nesciunt magnam ipsa quos perferendis, consectetur consequuntur sapiente id reiciendis eius. Unde nisi nobis consectetur accusamus, exercitationem, veniam quos nesciunt repellat, nihil ducimus illum quisquam reiciendis excepturi! Earum, quod omnis ea nostrum quia, ipsam alias quae officia fuga mollitia repellendus, in enim itaque adipisci. Facere dignissimos ullam eius dolor!",
  },
]);

// const notificationLines = computed(() => (connected.value ? "full" : "none"));

// function changed(ev) {
//   console.info("toggle", ev);
//   connected.value = !connected.value;
//   console.info("connected? ", connected.value);
// }
</script>

<style></style>
