<template>
  <ion-header translucent>
    <ion-toolbar>
      <ion-title>{{ $t("message.attendance") }}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="dismissModal()">{{
          $t("message.close")
        }}</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <div v-if="loading" class="wrapper">
      <ion-spinner></ion-spinner>
      <span>{{ $t("message.loading") }}...</span>
    </div>

    <template v-else-if="items.length > 0">
      <canvas class="confetti-canvas"></canvas>
      <div class="circ-wrapper">
        <progress-circle
          :total-steps="25"
          :completed-steps="Math.min(25, hoursDone)"
          :start-color="style.getPropertyValue('--ion-color-primary')"
          :stop-color="style.getPropertyValue('--ion-color-primary')"
          circle-color="transparent"
          :circle-width="12"
        >
          <span style="font-size: 18px">
            {{ Math.round((Math.min(25, hoursDone) / 25) * 100) }}%
          </span>
        </progress-circle>
        <span style="font-size: 20px; font-weight: 500">
          {{ $t("message.youveAssistedTo") }} {{ hoursDone }}
          {{ $t("message.outOfTotalOf") }}
        </span>
      </div>
      <ion-list>
        <ion-list-header style="font-weight: 500">
          {{ $t("message.eventsYouveAssisted") }}
        </ion-list-header>
        <template v-for="item in items" :key="item.time">
          <ion-item
            v-for="(event, index) in  (item.events as string[])"
            :key="event"
          >
            <span
              style="
                color: var(--ion-color-primary);
                margin-right: 0.4rem;
                font-weight: 700;
              "
              >{{ (item.eventHours || ["-", "-", "-"])[index] }}h</span
            >{{ event }}
          </ion-item>
        </template>
      </ion-list>
    </template>

    <div v-else class="wrapper">
      <span>{{ $t("message.noAssistance") }}</span>
    </div>
  </ion-content>
</template>

<script setup lang="ts">
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
import { collection, DocumentData, getDocs } from "firebase/firestore";
import { firestore } from "@/firebase";
import { computed, defineProps, ref, Ref } from "vue";
//@ts-expect-error
import { ProgressCircle } from "vue-progress-circle";
import confetti from "canvas-confetti";

const props = defineProps<{
  dni: string;
}>();

const style = getComputedStyle(document.body);

const dismissModal = () => modalController.dismiss();

const items: Ref<DocumentData[]> = ref([]);
const loading = ref(true);
const hoursDone = computed(
  () =>
    items.value
      .map((item) => item.hours)
      .reduce((prev, curr) => prev + curr) as number
);

// TODO Add loading
(async () => {
  const querySnapshot = await getDocs(collection(firestore, props.dni));
  querySnapshot.forEach((doc) => {
    console.log(`DOCSSSS: ${doc.id} => ${doc.data()}`);
    items.value.push(doc.data());
  });
  items.value.sort((a, b) =>
    Date.parse(a.time) < Date.parse(b.time) ? -1 : 1
  );
  loading.value = false;
  console.log(items.value);
  if (hoursDone.value >= 25 * 0.8) {
    const canvas = document.getElementsByClassName("canvas-confetti")[0];
    //@ts-expect-error I am sure canvas will not be null
    const con = confetti.create(canvas, { resize: true });

    con({
      particleCount: 250,
      spread: 45,
      origin: { y: 1 },
      gravity: 0.5,
      startVelocity: 60,
      colors: ["#24272A", "#34B6ED", "#70C1B3", "#FFE066", "#E8451E"],
    });
  }
})();
</script>

<style scoped>
.circ-wrapper {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 1rem 0rem;
  padding: 0rem 3rem;
  gap: 1rem;
}
.wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 1rem;
}

.confetti-canvas {
  position: absolute;
  z-index: 99;
  height: 100%;
  width: 100%;
}
</style>
