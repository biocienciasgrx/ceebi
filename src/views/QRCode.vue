<template>
  <ion-page>
    <Header />
    <ion-content :fullscreen="true">
      <div class="center-content">
        <canvas v-if="idSet" id="qrcode" height="300" width="300"></canvas>
        <template v-else>
          <ion-label>{{ $t("message.qrcodeIdNotSet") }}</ion-label>
          <ion-button class="ion-margin-top" router-link="/id-change">{{
            $t("message.qrcodeSetId")
          }}</ion-button>
        </template>
        <!-- TODO Comprobar letra DNI con el algoritmo de comprobación: dni_del_numero / 23 -> tomas resto -->
      </div>
    </ion-content>
  </ion-page>
  <!-- TODO Include DNI configuration as button and modal here -->
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonLabel,
  IonButton,
  onIonViewWillEnter,
  onIonViewWillLeave,
  onIonViewDidEnter,
  isPlatform,
} from "@ionic/vue";
import Header from "../components/Header.vue";

import { ScreenBrightness } from "@capacitor-community/screen-brightness";
import QRCode from "qrcode";
import { ref } from "@vue/reactivity";
import { Storage } from "@capacitor/storage";
import { onMounted } from "@vue/runtime-core";
import { KEY_ID } from "@/vars";

const showQR = ref(false);
const idSet = ref(true);

const dni = ref("");

function genCode() {
  console.log(
    "QRCode:genCode:96 > Pre-generation. DNI value: ",
    dni.value,
    ". HTML element: ",
    document.getElementById("qrcode")
  );
  QRCode.toCanvas(document.getElementById("qrcode"), dni.value.toUpperCase(), {
    scale: Math.min(screen.width / 25, 12),
    margin: 2,
  })
    .then(() => {
      console.info("SUCCESS");
      showQR.value = true;
    })
    .catch((e: any) => console.error("error ::", e));
}

const main = async () => {
  const { keys } = await Storage.keys();

  console.info(
    "keysssssss",
    keys,
    "\nDoes them include it though?",
    keys.includes(KEY_ID)
  );
  idSet.value = keys.includes(KEY_ID);

  console.log("is id set?", idSet.value);
  if (idSet.value) {
    const { value } = await Storage.get({
      key: KEY_ID,
    });
    dni.value = value === null ? "" : value;
    console.info(
      "got a ceebiID value: ",
      value,
      " yet dni.value ",
      dni.value,
      ". For your info, idSet? ",
      idSet.value
    );
    if (dni.value) {
      showQR.value = true;
      genCode();
    } else {
      idSet.value = false;
    }
  }
};

main();

//* BRIGHTNESS
const brightness = ref(0);
(async () => {
  if (isPlatform("capacitor")) {
    const { brightness: _brightness } = await ScreenBrightness.getBrightness();
    brightness.value = _brightness;
  }
})();
onIonViewWillEnter(async () => {
  if (isPlatform("capacitor"))
    ({ brightness: brightness.value } = await ScreenBrightness.getBrightness());
  main(); // Check for ID and load QR if needed
});
onIonViewWillLeave(() => {
  if (isPlatform("capacitor"))
    ScreenBrightness.setBrightness({
      brightness: brightness.value,
    });
});
onIonViewDidEnter(() => {
  if (isPlatform("capacitor"))
    ScreenBrightness.setBrightness({
      brightness: 1,
    });
});
//* ===========
</script>

<style scoped>
.center-content {
  top: 0;
  height: 100vh;
  width: 100vw;
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
