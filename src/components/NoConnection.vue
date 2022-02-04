<template>
  <div class="container">
    <ion-icon :icon="wifiOutline" size="large"></ion-icon>
    {{ $t("message.noConnection") }}
    <ion-note><slot></slot></ion-note>
  </div>
</template>

<script setup lang="ts">
import { IonIcon, IonNote } from "@ionic/vue";
import { wifiOutline } from "ionicons/icons";
</script>

<style>
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
