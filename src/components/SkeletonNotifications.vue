<template>
  <!-- <Header condense /> -->
  <!-- <ion-item :lines="notificationLines">
        <ion-label>Enable event notifications</ion-label>
        <ion-toggle
          :value="connected"
          @ionChange="changed($event)"
        ></ion-toggle>
      </ion-item> -->
  <ion-list lines="full">
    <ion-item v-for="i in randItems()" :key="i" detail button>
      <ion-skeleton-text
        :style="{ width: `30px`, height: '30px' }"
        slot="start"
        animated
      ></ion-skeleton-text>
      <div style="display: flex; flex-direction: column">
        <ion-skeleton-text
          :style="{ width: randTitleWidth(), height: '13px' }"
          animated
        ></ion-skeleton-text>
        <ion-skeleton-text
          :style="{ width: randBodyWidth(), height: '8px' }"
          animated
        ></ion-skeleton-text>
      </div>
    </ion-item>
  </ion-list>
</template>

<script setup lang="ts">
import { IonList, IonItem, IonSkeletonText } from "@ionic/vue";

const randItems = () => Math.floor(Math.random() * 5 + 5);
const randTitleWidth = () => `${Math.floor(Math.random() * 2 + 8)}em`;
const randBodyWidth = () => `${Math.floor(Math.random() * 4 + 10)}em`;
</script>
