<template>
  <ion-page>
    <Header />
    <ion-content>
      <ion-title class="ion-margin-top title" style="font-size: 30px">{{
        $t("message.settingsTitle")
      }}</ion-title>
      <!-- Interface -->
      <ion-card class="first-card">
        <ion-card-header
          ><ion-card-title>
            {{ $t("message.settingsInterfaceTitle") }}
          </ion-card-title></ion-card-header
        >
        <ion-card-content>
          <ion-item lines="inset">
            <ion-label>{{ $t("message.localeSelection") }}</ion-label>
            <ion-select
              v-model="$i18n.locale"
              interface="popover"
              :value="
                $i18n.locale && $i18n.availableLocales.includes($i18n.locale)
                  ? $i18n.locale
                  : $i18n.fallbackLocale
              "
            >
              <ion-select-option
                v-for="locale in $i18n.availableLocales.sort((a, b) =>
                  getLocaleName(a).localeCompare(getLocaleName(b))
                )"
                :key="`locale-${locale}`"
                :value="locale"
                >{{ getLocaleName(locale) }}</ion-select-option
              >
            </ion-select>
          </ion-item>
          <div>
            <ion-item
              lines="inset"
              button
              :detail="false"
              @click.self="darkMode = !darkMode"
            >
              <ion-label @click="darkMode = !darkMode">{{
                $t("message.darkMode")
              }}</ion-label>
              <ion-toggle v-model="darkMode"></ion-toggle>
            </ion-item>
          </div>
        </ion-card-content>
      </ion-card>
      <!-- Identification -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{
            $t("message.settingsIdentificationTitle")
          }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item
            _href="/id-change"
            button
            detail
            lines="inset"
            @click="link('/id-change')"
          >
            <ion-label>{{
              $t("message.settingsIdentificationChange")
            }}</ion-label>
          </ion-item>
        </ion-card-content>
      </ion-card>
      <!-- Notifications -->
      <ion-card>
        <ion-card-header
          ><ion-card-title>
            {{ $t("message.settingsNotificationsTitle") }}
          </ion-card-title></ion-card-header
        >
        <ion-card-content>
          <ion-item
            lines="inset"
            button
            @click.self="eventRemindersOn = !eventRemindersOn"
            detail="false"
          >
            <ion-label @click="eventRemindersOn = !eventRemindersOn">{{
              $t("message.settingsEventRemindersToggle")
            }}</ion-label>
            <ion-toggle v-model="eventRemindersOn"></ion-toggle>
          </ion-item>
          <ion-item lines="inset">
            <ion-label class="label">{{
              $t("message.settingsEventRemindersChooseTime")
            }}</ion-label>
            <ion-select
              v-model="eventRemindersTime"
              interface="popover"
              :disabled="!eventRemindersOn"
            >
              <ion-select-option value="0">{{
                $t("message.settingsEventsRemindersTime0")
              }}</ion-select-option>
              <ion-select-option
                v-for="time in [1, 3, 5, 10, 15, 20, 30, 45, 60]"
                :key="time"
                :value="time"
                >{{ time }} {{ $t("message.minutes") }}</ion-select-option
              >
            </ion-select>
          </ion-item>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonToggle,
  useIonRouter,
} from "@ionic/vue";
import { useI18n } from "vue-i18n";
import Header from "../components/Header.vue";
import * as locale from "locale-codes";
import { ref, watch, onMounted } from "vue";
import { codeWorkingOutline } from "ionicons/icons";
import { Storage } from "@capacitor/storage";
import { KEY_LOCALE, KEY_DARK_MODE } from "@/vars";
import { setUserProperties } from "firebase/analytics";
import { analytics } from "@/firebase";
import { toast, toggleDarkMode } from "@/ui";
import { getDarkMode, isDarkMode, setDarkMode } from "@/darkMode";

const router = useIonRouter();
const i18n = useI18n();

const link = (to: string) => router.push(to);

/*
const formModal = defineComponent({
  setup() {
    console.log("hey ma friend");
    console.log("Watch mi i18n", useI18n());

    const dismiss = modalController.dismiss;
  },
  template: `<ion-header translucent>
    <ion-toolbar>
      <ion-title>${i18n.t("message.settingsIdentificationChange")}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="dismiss()">${"Close"}</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content fullscreen>
    <ion-radio-group value="dni">
      <ion-list-header>
        <ion-label>${i18n.t("message.identificationTypeTitle")}</ion-label>
      </ion-list-header>
      <ion-item>
        <ion-label>${i18n.t("message.identificationDNI")}</ion-label>
        <ion-radio slot="start" value="dni"></ion-radio>
      </ion-item>
      <ion-item>
        <ion-label>P</ion-label>
        <ion-radio slot="start" value="passport"></ion-radio>
      </ion-item>
      <ion-item>
        <ion-label>Other</ion-label>
        <ion-radio slot="start" value="other"></ion-radio>
      </ion-item>
    </ion-radio-group>
  </ion-content>`,
});*/

watch(i18n.locale, (value) => {
  Storage.set({
    key: KEY_LOCALE,
    value,
  });
  setUserProperties(analytics, {
    locale: value,
  });
});

const getLocaleName = (tag: string): string => locale.getByTag(tag).name;

const darkMode = ref(getDarkMode());
const darkModeInProgress = async () =>
  toast(i18n.t("message.workingOnDarkMode"), codeWorkingOutline);

watch(darkMode, (val) => {
  toggleDarkMode(val);
  setDarkMode(val);
  Storage.set({
    key: KEY_DARK_MODE,
    value: val.toString(),
  });
}); // TODO Not properly loagin or saving value

watch(isDarkMode, (val) => (darkMode.value = val));

const eventRemindersOn = ref(false);
const eventRemindersTime = ref(15);

watch(eventRemindersOn, (value) => {
  setUserProperties(analytics, {
    eventRemindersOn: value,
  });
});

watch(eventRemindersTime, (value) => {
  setUserProperties(analytics, {
    eventRemindersTime: value,
  });
});

// Initial user property set
setUserProperties(analytics, {
  locale: i18n.locale.value,
  eventRemindersOn: eventRemindersOn.value,
  eventRemindersTime: eventRemindersTime.value,
});

onMounted(() => {
  // watch(document.body.classList, () => {
  //   console.log("heyyyyy :((()))");
  //   darkMode.value = document.body.classList.contains("dark");
  // });
  // new MutationObserver(
  //   () => (darkMode.value = document.body.classList.contains("dark"))
  // ).observe(document.body, {
  //   attributes: true,
  //   attributeFilter: ["class"],
  // });
});
</script>

<style scoped>
.title.ios {
  position: absolute !important;
  top: 0;
  left: 0;
  display: block;
  overflow: visible;
  padding: 0;
}

.title.ios > * {
  overflow-x: visible;
}

.first-card.ios {
  margin-top: 5em;
}

ion-label {
  white-space: normal !important;
}
</style>
