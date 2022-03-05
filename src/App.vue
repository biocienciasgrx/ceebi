<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import {
  IonApp,
  IonRouterOutlet,
  isPlatform,
  alertController,
  toastController,
} from "@ionic/vue";
import { onMounted } from "vue";

import { LocalNotifications } from "@capacitor/local-notifications";
import {
  PushNotifications,
  Token,
  PushNotificationSchema,
  ActionPerformed,
} from "@capacitor/push-notifications";
import { SplashScreen } from "@capacitor/splash-screen";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Storage } from "@capacitor/storage";
import {
  AppUpdate,
  AppUpdateAvailability,
  FlexibleUpdateInstallStatus,
} from "@robingenz/capacitor-app-update";

import { analytics } from "@/firebase";

import {
  FIREBASE_ANALYTICS,
  IMAGES_DIRECTORY,
  KEY_NOTIFICATIONS,
} from "@/vars";

import { Analytics, logEvent } from "firebase/analytics";

//* CREATE IMAGE DIR
Filesystem.mkdir({
  path: IMAGES_DIRECTORY,
  directory: Directory.Cache,
}).catch((e) =>
  e.message === "Current directory does already exist." ? {} : console.error(e)
);

//* LOCAL NOTIFICATIONS
console.info("App:21 > Setting upd");
LocalNotifications.requestPermissions().then((res) =>
  console.log("App:23 > local permissions: ", res.display)
);

//* PUSH NOTIFICATIONS
if (isPlatform("capacitor")) {
  PushNotifications.addListener("registration", async (token: Token) => {
    console.log("===== FIREBASE TOKEN: " + token.value + " =====");
  }).catch((e) => console.warn(">>>> FIREBASE REGISTRATION ERROR: " + e));

  PushNotifications.requestPermissions().then((res) => {
    console.log("App:26 push permissions: ", res.receive);
    if (res.receive === "granted") PushNotifications.register();
  });

  PushNotifications.addListener(
    "pushNotificationReceived",
    async (notification: PushNotificationSchema) => {
      console.log("PUSH >>>> Push received: " + JSON.stringify(notification));
      // Show notification in case you don't have the app open
      LocalNotifications.schedule({
        notifications: [
          {
            title: notification.title || "",
            body: notification.body || "",
            id: Date.now(),
            extra: notification.data,
            // smallIcon: "@mipmap/push_icon",
          },
        ],
      })
        .then((res) =>
          console.info("PUSH >>>> Scheduled: ", JSON.stringify(res))
        )
        .catch((e) =>
          console.warn("PUSH >>> ERROR while setting local notification: " + e)
        );
      // Save notification
      const { value: notificationsJSON } = await Storage.get({
        key: KEY_NOTIFICATIONS,
      });
      const notifications: PushNotificationSchema[] = JSON.parse(
        notificationsJSON || ""
      );
      console.info("PUSH >>>> Saving notification");
      notifications.push(notification);
      Storage.set({
        key: KEY_NOTIFICATIONS,
        value: JSON.stringify(notifications),
      })
        .catch((e) => console.error("PUSH >>>> Error while saving push: " + e))
        .then(() => console.info("PUSH >>>> Successfully saved notification"));
    }
  );

  PushNotifications.addListener(
    "pushNotificationActionPerformed",
    async (notification: ActionPerformed) => {
      const data = notification.notification.data;
      console.log(
        "PUSH >>>> Action performed: " +
          JSON.stringify(notification.notification)
      );
      if (data) {
        console.info("PUSH >>> data " + JSON.stringify(data));
      }
    }
  );
}

//* FIREBASE ANALYTICS
// const analytics = inject(FIREBASE_ANALYTICS) as Analytics;
console.info("Injected analytics: ", analytics);
logEvent(analytics, "vue_app_setup");

//* CHECK FOR UPDATE
(async () => {
  const {
    updateAvailability,
    flexibleUpdateAllowed,
    immediateUpdateAllowed,
    availableVersion,
    currentVersion,
  } = await AppUpdate.getAppUpdateInfo();
  if (updateAvailability !== AppUpdateAvailability.UPDATE_AVAILABLE) {
    return;
  }
  const alert = await alertController.create({
    header: "App update available",
    message:
      "We recommend you to update the application.\nCurrent version: " +
      currentVersion +
      ". New version: " +
      availableVersion,
    buttons: [
      {
        text: "Later",
        role: "cancel",
      },
      {
        text: "Update",
        handler: () => {
          if (flexibleUpdateAllowed) {
            AppUpdate.startFlexibleUpdate();
            AppUpdate.addListener(
              "onFlexibleUpdateStateChange",
              ({ installStatus }) => {
                if (installStatus === FlexibleUpdateInstallStatus.INSTALLED)
                  toastController
                    .create({
                      message: "App updated, restart to apply updates",
                      buttons: [
                        {
                          text: "Update",
                          handler: () => AppUpdate.completeFlexibleUpdate(),
                        },
                      ],
                    })
                    .then((toast) => toast.present());
              }
            );
          } else if (immediateUpdateAllowed) {
            AppUpdate.performImmediateUpdate();
          } else {
            AppUpdate.openAppStore();
          }
        },
      },
    ],
  });
  alert.present();
})();

//* HIDE SPLASHSCREEN ON MOUNTED
onMounted(SplashScreen.hide);
</script>
