<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet, isPlatform } from "@ionic/vue";
import { onMounted, toHandlerKey } from "vue";

import { LocalNotifications } from "@capacitor/local-notifications";
import {
  PushNotifications,
  Token,
  PushNotificationSchema,
  ActionPerformed,
} from "@capacitor/push-notifications";
import { SplashScreen } from "@capacitor/splash-screen";
import { Filesystem, Directory } from "@capacitor/filesystem";

import { IMAGES_DIRECTORY } from "@/vars";

PushNotifications.addListener("registration", async (token: Token) => {
  console.log("===== FIREBASE TOKEN: " + token.value + " =====");
}).catch((e) => console.warn(">>>> FIREBASE REGISTRATION ERROR: " + e));

Filesystem.mkdir({
  path: IMAGES_DIRECTORY,
  directory: Directory.Cache,
}).catch((e) =>
  e.message === "Current directory does already exist." ? {} : console.error(e)
);

console.info("App:21 > Setting upd");
LocalNotifications.requestPermissions().then((res) =>
  console.log("App:23 > local permissions: ", res.display)
);
if (isPlatform("capacitor"))
  PushNotifications.requestPermissions().then((res) => {
    console.log("App:26 push permissions: ", res.receive);
    if (res.receive === "granted") PushNotifications.register();
  });

PushNotifications.addListener(
  "pushNotificationReceived",
  async (notification: PushNotificationSchema) => {
    console.log("PUSH >>>> Push received: " + JSON.stringify(notification));
  }
);

PushNotifications.addListener(
  "pushNotificationActionPerformed",
  async (notification: ActionPerformed) => {
    const data = notification.notification.data;
    console.log(
      "PUSH >>>> Action performed: " + JSON.stringify(notification.notification)
    );
    if (data) {
      console.info("PUSH >>> data " + JSON.stringify(data));
    }
  }
);

onMounted(SplashScreen.hide);
</script>
