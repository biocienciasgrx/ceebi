<template>
  <ion-page>
    <Header id="header" />
    <!-- Date selection -->
    <ion-toolbar class="border-b" v-if="connected">
      <ion-segment
        _mode="ios"
        v-model="day"
        @ionChange="segmentChanged($event)"
      >
        <ion-segment-button value="2">
          <ion-label>M 19</ion-label>
        </ion-segment-button>
        <ion-segment-button value="3">
          <ion-label>X 20</ion-label>
        </ion-segment-button>
        <ion-segment-button value="4">
          <ion-label>J 21</ion-label>
        </ion-segment-button>
        <ion-segment-button value="5">
          <ion-label>V 22</ion-label>
        </ion-segment-button>
      </ion-segment>
    </ion-toolbar>
    <ion-content :fullscreen="true">
      <NoConnection v-if="!connected">
        {{ $t("message.scheduleGoOnline") }}
      </NoConnection>
      <div class="swiper" v-else>
        <swiper
          class="swiper"
          @swiper="setSwiperInstance"
          @slideChange="daySwiped"
          :modules="swiperModules"
          :auto-height="true"
          :grab-cursor="true"
        >
          <swiper-slide class="slide"
            ><SkeletonTimeline v-if="tuesdayLoading"></SkeletonTimeline>
            <Timeline v-else :events="tuesdayEvents"
              >Martes</Timeline
            > </swiper-slide
          ><swiper-slide class="slide">
            <SkeletonTimeline v-if="wednesdayLoading"></SkeletonTimeline>
            <Timeline v-else :events="wednesdayEvents"
              >Miercoles</Timeline
            ></swiper-slide
          ><swiper-slide class="slide">
            <SkeletonTimeline v-if="thursdayLoading"></SkeletonTimeline
            ><Timeline v-else :events="thursdayEvents"
              >Jueves</Timeline
            > </swiper-slide
          ><swiper-slide class="slide">
            <SkeletonTimeline v-if="fridayLoading"></SkeletonTimeline
            ><Timeline v-else :events="fridayEvents"
              >Viernes</Timeline
            ></swiper-slide
          >
        </swiper>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import "swiper/swiper-bundle.min.css";
// import "@ionic/vue/css/ionic-swiper.css";

import {
  IonPage,
  IonContent,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonicSlides,
} from "@ionic/vue";
import { Swiper, SwiperSlide } from "swiper/vue/swiper-vue";
import Header from "../components/Header.vue";
import Timeline from "../components/Timeline.vue";
import SkeletonTimeline from "../components/SkeletonTimeline.vue";
import NoConnection from "../components/NoConnection.vue";

import { ref } from "vue";
import { Storage } from "@capacitor/storage";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Network } from "@capacitor/network";

import { Event } from "@/types";

export default {
  name: "Schedule",
  components: {
    Header,
    Timeline,
    SkeletonTimeline,
    NoConnection,
    IonContent,
    IonPage,
    IonToolbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    Swiper,
    SwiperSlide,
  },
  setup() {
    function today(): number {
      const day = new Date().getDay();
      return day < 2 ||
        day > 5 ||
        new Date().getTime() <= new Date(2022, 6, 19).getTime()
        ? 2
        : day;
    }

    const swiper = ref();
    const setSwiperInstance = (_swiper: any) => {
      swiper.value = _swiper;
      _swiper.slideTo(today() - 2, 300);
    };

    const day = ref(today());

    function daySwiped() {
      console.info(swiper.value.activeIndex);
      day.value = swiper.value.activeIndex + 2;
    }

    // Get thursday events
    const tuesdayEvents = ref([]);
    const tuesdayLoading = ref(true);
    async function loadTuesday() {
      const res = await fetch(
        "https://biociencias.es/wp-json/mecexternal/v1/calendar/1565"
      );

      res.json().then((json) => {
        tuesdayEvents.value = json.content_json["2022-07-19"];
        tuesdayLoading.value = false;
      });
    }
    loadTuesday();

    // Get wednesday events
    const wednesdayEvents = ref([]);
    const wednesdayLoading = ref(true);
    async function loadWednesday() {
      const res = await fetch(
        "https://biociencias.es/wp-json/mecexternal/v1/calendar/1565"
      );

      res.json().then((json) => {
        wednesdayEvents.value = json.content_json["2022-07-20"];
        wednesdayLoading.value = false;
      });
    }
    loadWednesday();

    // Get thursday events
    const thursdayEvents = ref([]);
    const thursdayLoading = ref(true);
    async function loadThursday() {
      const res = await fetch(
        "https://biociencias.es/wp-json/mecexternal/v1/calendar/1565"
      );

      res.json().then((json) => {
        thursdayEvents.value = json.content_json["2022-07-21"];
        thursdayLoading.value = false;
      });
    }
    loadThursday();

    // Get friday events
    const fridayEvents = ref([]);
    const fridayLoading = ref(true);
    async function loadFriday() {
      const res = await fetch(
        "https://biociencias.es/wp-json/mecexternal/v1/calendar/1565"
      );

      res.json().then((json) => {
        fridayEvents.value = json.content_json["2022-07-22"];
        fridayLoading.value = false;
      });
    }
    loadFriday();

    const connected = ref(false);
    (async () => {
      const status = await Network.getStatus();
      connected.value = status.connected;
    })();
    Network.addListener("networkStatusChange", (status) => {
      connected.value = status.connected;
      if (status) {
        loadTuesday();
        loadWednesday();
        loadThursday();
        loadFriday();
      }
    });

    console.info("Schedule:92 > Setting up schedule");
    LocalNotifications.createChannel({
      id: "testchannel",
      name: "Event reminders",
      importance: 3,
      vibration: true,
    })
      .then(() => {
        Storage.get({ key: "localNotifications" }) // It is of the form wants;registered
          .then(({ value }) => {
            const split = (value == undefined ? "false;false" : value).split(
              ";"
            );
            const wants = split[0] == "true";
            const registered = split[1] == "true";
            if (wants && !registered) {
              tuesdayEvents.value.forEach((event: any) => {
                LocalNotifications.checkPermissions().then((check) => {
                  if (check.display === "granted") {
                    LocalNotifications.schedule({
                      notifications: [
                        {
                          title: `${event.name} empizeza en 10 minutos!`,
                          body: `El evento ${event.name} va a empezar en 10 minutos en ${event.location}`,
                          id: Number(event.startTime.toUTCString()),
                        },
                      ],
                    });
                  } else {
                    console.warn("Schedule:121 > Permissions not granted");
                  }
                });
              });
              Storage.set({ key: "localNotifications", value: "true;true" });
            } else {
              console.log(
                "Schedule:128 > Notifications set, take a look: ",
                JSON.stringify(LocalNotifications.getPending(), undefined, "  ")
              );
            }
          });
      })
      .catch((e) => console.warn("Schedule:134 > error creating channel", e));

    return {
      connected,

      swiper,
      setSwiperInstance,
      daySwiped,

      day,
      tuesdayLoading,
      tuesdayEvents,
      wednesdayLoading,
      wednesdayEvents,
      thursdayLoading,
      thursdayEvents,
      fridayLoading,
      fridayEvents,

      segmentChanged(event: CustomEvent): void {
        console.log("Segment changed: ", event);
        console.info(day);
        swiper.value.slideTo(day.value - 2, 300);
      },

      swiperModules: [IonicSlides],
    };
  },
};
</script>

<style scoped>
#header {
  z-index: 50;
}

.border-b {
  box-shadow: 0px 5px 15px -8px rgba(55, 55, 55, 0.5);
}

.swiper {
  min-height: 100%;
  /* overflow-y: hidden; */
}

.slide {
  min-height: 79.4vh;
  /* min-height: 100%; */
  height: max-content;
}
</style>
