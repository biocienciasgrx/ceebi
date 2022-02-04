<template>
  <ion-header translucent>
    <ion-toolbar>
      <ion-title> Change ID </ion-title>
      <ion-buttons slot="end">
        <ion-button @click="dismiss()"></ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content fullscreen>
    <ion-radio-group value="dni">
      <ion-list-header>
        <ion-label>Tipo de documento</ion-label>
      </ion-list-header>
      <ion-item>
        <ion-label>DNI Español</ion-label>
        <ion-radio slot="start" value="dni"></ion-radio>
      </ion-item>
      <ion-item>
        <ion-label>Pasaporte</ion-label>
        <ion-radio slot="start" value="passport"></ion-radio>
      </ion-item>
      <ion-item>
        <ion-label>Otro</ion-label>
        <ion-radio slot="start" value="other"></ion-radio>
      </ion-item>
    </ion-radio-group>
  </ion-content>
</template>

<script lang="ts">
import { modalController } from "@ionic/core";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  setup() {
    return {
      dismiss: modalController.dismiss,
    };
  },
});
</script>

<style></style>
