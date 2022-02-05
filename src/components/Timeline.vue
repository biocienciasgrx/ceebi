<template>
  <div id="vertical-bar"></div>
  <section class="events">
    <article
      v-for="event in events"
      :key="event.ID"
      class="event ion-activatable"
    >
      <div class="event__icon">
        <ion-icon :icon="icon(event)"></ion-icon>
      </div>
      <div class="event__header">
        <p class="event__start-time">
          {{ event.data.time.start }}
        </p>
        <h3 class="event__title">{{ event.data.title }}</h3>
        <ion-ripple-effect></ion-ripple-effect>
      </div>
      <p class="event__presenter">
        {{ presenters(event) }}
        {{
          keys(event.data.locations).length &&
          keys(event.data.speakers).length > 0
            ? "-"
            : ""
        }}
        {{ firstProp(event.data.locations).name }}
      </p>
      <p class="event__description">{{ event.data.post.post_excerpt }}</p>
    </article>
  </section>
</template>

<script lang="ts">
import { IonIcon, IonRippleEffect, onIonViewDidEnter } from "@ionic/vue";
import * as ionicons from "ionicons/icons";

// import { Event, EventType } from "@/scripts/events";
import { Event } from "@/types";
import { EVENT_ICON_FIELD_LABEL } from "@/vars";

import { PropType } from "@vue/runtime-core";

export default {
  props: {
    events: {
      type: Array as PropType<Array<Event>>,
      required: true,
    },
  },
  components: { IonIcon, IonRippleEffect },
  // @ts-ignore TS7006
  setup(props) {
    function firstProp(obj?: any): any {
      console.log("getting first prop for", obj);
      return obj !== undefined
        ? obj[Object.keys(obj)[0]]
        : {
            name: "",
          };
    }

    console.info("setting up");
    console.info("events", props.events);
    props.events.forEach((ev: Event) => {
      console.info("event", ev);
    });

    onIonViewDidEnter(() => {
      console.info("events", props.events);
      props.events.forEach((ev: Event) => {
        console.info("event", ev);
      });
    });

    return {
      // icon(type: EventType): string {
      //   switch (type) {
      //     case EventType.Conferencia:
      //       return megaphoneOutline;
      //     case EventType.Microcharla:
      //       return chatbubbleEllipsesOutline;
      //     case EventType.Taller:
      //       return buildOutline;
      //     case EventType.ForoEmpresas:
      //       return briefcaseOutline;
      //     case EventType.Break:
      //       return cafeOutline;
      //     case EventType.ComidaEventual:
      //       return restaurantOutline;
      //     case EventType.Social:
      //       return peopleOutline;
      //   }
      //   return helpOutline;
      // },
      icon(event: Event): string {
        //@ts-expect-error
        return ionicons[
          `${
            (
              event.data.fields.find(
                (el) => el.label === EVENT_ICON_FIELD_LABEL
              ) || {
                value: "",
              }
            ).value
          }Outline`
        ];
      },
      // displayMinutes(event: Event): string {
      //   const mins = event.startTime.getMinutes();
      //   if (mins < 10) return "0" + mins;
      //   return mins.toString();
      // },
      firstProp,
      keys: (obj?: Record<string, any>): string[] =>
        obj === undefined ? [] : Object.keys(obj),
      presenters(event: Event): string {
        console.info(
          "??? presenters event",
          event.data.title,
          "data",
          event.data.speakers
        );
        return Object.values(event.data.speakers || {})
          .map((speaker) => speaker.name)
          .join(", ");
      },
    };
  },
};
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
  /* height: 100%; */
  height: 200vh;
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
  position: relative;
}

.event__icon {
  position: absolute;
  left: calc(30px / 2 * -1);
  background-color: var(--ion-color-secondary-tint);
  border-radius: 9999px;
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  color: #111;
}

.event__header {
  margin: 3px 0;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: baseline;
  gap: 0.25em;
  font-size: 1.5rem;
  position: relative;
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
  margin-top: 0.2em;
  color: #111;
}
</style>
