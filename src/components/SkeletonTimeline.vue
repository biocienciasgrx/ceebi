<template>
  <div id="vertical-bar"></div>
  <section class="events">
    <article v-for="i in 6" :key="i" class="event">
      <div class="event__icon">
        <ion-skeleton-text
          animated
          style="width: 20px; height: 20px"
        ></ion-skeleton-text>
      </div>
      <div class="event__header">
        <p class="event__start-time">
          <ion-skeleton-text style="width: 2em"></ion-skeleton-text>
        </p>
        <h3 class="event__title" style="width: 10em">
          <ion-skeleton-text></ion-skeleton-text>
        </h3>
      </div>
      <p class="event__presenter">
        <ion-skeleton-text animated style="width: 9em"></ion-skeleton-text>
      </p>
      <p class="event__description">
        <ion-skeleton-text
          v-for="i in randItems()"
          :key="i"
          animated
          :style="{ width: randWidth() }"
        ></ion-skeleton-text>
      </p>
    </article>
  </section>
</template>

<script setup lang="ts">
import { IonSkeletonText } from "@ionic/vue";

const randItems = () => Math.floor(Math.random() * 2 + 1);
const randWidth = () => `${Math.floor(Math.random() * 3 + 10)}em`;
</script>

<style scoped>
#vertical-bar {
  /* --header-height: 8.25em; */
  /* top: calc(var(--header-height) + 2em + 40px); */
  left: 2em;
  top: 0;
  /* position: absolute; */
  position: absolute;
  /* z-index: -10; */
  width: 10px;
  height: 100%;
  /* height: 100px; TODO Height should depend on items height  */
  background: var(--ion-color-secondary-shade);
}

.events {
  padding: 2em;
}

.event {
  padding-left: 30px;
  /* margin-top: -15px; */
  padding-top: 5px;
}

.event__icon {
  position: absolute;
  left: calc(2em + 30px / 2 * -1);
  background-color: var(--ion-color-secondary-tint);
  border-radius: 9999px;
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  color: black;
}

.event__header {
  margin: 3px 0;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.25em;
  font-size: 1.5rem;
}

.event__header > * {
  margin: 0;
}

.event__start-time {
  font-weight: bolder;
  color: var(--ion-color-primary-shade);
}

.event__title {
  font-weight: 1000;
  margin-bottom: 0;
}

.event__presenter {
  font-size: 1rem;
  font-weight: bolder;
  color: #888;
  margin: 0;
}

.event__description {
  margin-top: 0.5m;
  color: #111;
}
</style>
