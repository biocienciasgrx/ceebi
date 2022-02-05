<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet, isPlatform } from "@ionic/vue";
import { onMounted } from "vue";

import { LocalNotifications } from "@capacitor/local-notifications";
import { PushNotifications } from "@capacitor/push-notifications";
import { SplashScreen } from "@capacitor/splash-screen";
import { Filesystem, Directory } from "@capacitor/filesystem";

import { IMAGES_DIRECTORY } from "@/vars";

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

onMounted(SplashScreen.hide);
</script>
