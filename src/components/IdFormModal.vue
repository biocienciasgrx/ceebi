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
    <!--ion-radio-group value="dni">
      <ion-list-header>
        <ion-label>{{
          translate("message.identificationTypeTitle")
        }}</ion-label>
      </ion-list-header>
      <ion-item>
        <ion-label>{{ translate("message.identificationDNI") }}</ion-label>
        <ion-radio slot="start" value="dni"></ion-radio>
      </ion-item>
      <ion-item>
        <ion-label>{{ translate("message.identificationPassport") }}</ion-label>
        <ion-radio slot="start" value="passport"></ion-radio>
      </ion-item>
      <ion-item>
        <ion-label>{{ translate("message.identificationOther") }}</ion-label>
        <ion-radio slot="start" value="other"></ion-radio>
      </ion-item>
    </!--ion-radio-group-->

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

<script setup lang="ts">
import { modalController } from "@ionic/core";
// import { toRef, defineProps } from "vue";
import { useI18n } from "vue-i18n";

console.log("hey ma friend");
console.log("Watch mi i18n", useI18n());

const dismiss = modalController.dismiss;

// const props = defineProps(["translate"]);
// const translate = toRef(props, "translate");

// console.info("ttt", translate);
</script>

<style></style>
