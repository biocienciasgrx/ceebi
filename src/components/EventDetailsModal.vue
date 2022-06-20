<template>
  <ion-header translucent>
    <ion-toolbar>
      <ion-title>{{ event.data.title }}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="dismissModal()">{{
          $t("message.close")
        }}</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content fullscreen>
    <div class="wrapper">
      <div class="info-item">
        <ion-icon :icon="calendarOutline"></ion-icon>
        <span style="text-transform: capitalize">{{
          dayFormat(event.data.time.start_timestamp)
        }}</span>
      </div>
      <div class="info-item">
        <ion-icon :icon="timeOutline"></ion-icon>
        <span>{{ event.data.time.start }} - {{ event.data.time.end }}</span>
      </div>
      <div class="info-item">
        <ion-icon :icon="locationOutline"></ion-icon>
        <span>{{
          firstProp(event.data.locations).name || $t("message.eventNoLocation")
        }}</span>
      </div>
      <div class="info-item">
        <ion-icon :icon="pricetagOutline"></ion-icon>
        <span>{{ firstProp(event.data.categories).name }}</span>
      </div>

      <ion-text v-html="event.data.content"></ion-text>

      <ion-accordion-group v-if="speakers.length > 0">
        <ion-accordion value="colors">
          <ion-item slot="header">
            <ion-icon slot="start" :icon="peopleOutline"></ion-icon>
            <ion-label>{{ $t("message.eventSpeakers") }}</ion-label>
          </ion-item>
          <ion-list slot="content">
            <ion-item v-for="speaker in speakers" :key="speaker.id">
              <ion-avatar slot="start">
                <img :src="speaker.thumbnail" alt="" />
              </ion-avatar>
              <ion-label>{{ speaker.name }}</ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
      </ion-accordion-group>

      <ion-item
        lines="none"
        class="ion-margin-top"
        fill="outline"
        :href="event.data.permalink"
        target="_blank"
        :detail="false"
      >
        <ion-label>{{ $t("message.eventViewOnWeb") }}</ion-label>
        <ion-icon slot="end" :icon="openOutline"></ion-icon>
      </ion-item>
    </div>
  </ion-content>
</template>

<script setup lang="ts">
import { Event } from "@/types";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonList,
  IonLabel,
  IonIcon,
  IonText,
  IonAvatar,
  modalController,
} from "@ionic/vue";
import { computed, defineProps } from "vue";
import {
  locationOutline,
  timeOutline,
  pricetagOutline,
  peopleOutline,
  openOutline,
  calendarOutline,
} from "ionicons/icons";

const props = defineProps<{
  event: Event;
}>();

function dismissModal() {
  modalController.dismiss();
}

function firstProp(obj?: any): any {
  console.log("getting first prop for", obj);
  return obj !== undefined
    ? obj[Object.keys(obj)[0]]
    : {
        name: "",
      };
}

function dayFormat(timestamp: number) {
  const date = new Date(timestamp * 1000);
  console.log("date", date.toLocaleString());
  return date.toLocaleDateString([], {
    weekday: "long",
    day: "numeric",
  });
}

function objToArr<T>(obj: Record<string, T>): Array<T> {
  return Object.values(obj);
}

const speakers = computed(() => objToArr(props.event.data.speakers || {}));
</script>

<style scoped>
.wrapper {
  padding: 1.75rem 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
  height: 20px;
  margin-bottom: 16px;
}

.info-item:last-of-type {
  margin-bottom: 25px;
}

.info-item > ion-icon {
  font-size: 24px;
  --ionicon-stroke-width: 46px;
  color: var(--ion-color-primary);
}

.info-item > span {
  color: #444;
}
</style>
