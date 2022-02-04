<template>
  <ion-page>
    <Header
      ><ion-toolbar>
        <ion-buttons slot="start">
          <!-- <ion-button @click="link('/settings')">Back</ion-button> -->
          <ion-button router-link="/settings" router-direction="back">
            <ion-icon
              :md="caretBackCircleOutline"
              :ios="caretBackCircleOutline"
              slot="icon-only"
            ></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>
          {{ $t("message.settingsIdentificationChange") }}
        </ion-title>
      </ion-toolbar>
    </Header>
    <ion-content class="ion-padding-top">
      <ion-radio-group v-model="documentType">
        <ion-list-header>
          <ion-title>{{ $t("message.identificationTypeTitle") }}</ion-title>
        </ion-list-header>
        <ion-item>
          <ion-label>{{ $t("message.identificationDNI") }}</ion-label>
          <ion-radio slot="start" value="dni"></ion-radio>
        </ion-item>
        <ion-item>
          <ion-label>{{ $t("message.identificationNIE") }}</ion-label>
          <ion-radio slot="start" value="nie"></ion-radio>
        </ion-item>
        <ion-item>
          <ion-label>{{
            $t("message.identificationPassportOrOther")
          }}</ion-label>
          <ion-radio slot="start" value="passport-other"></ion-radio>
        </ion-item>
      </ion-radio-group>
      <ion-list-header>
        <ion-title class="ion-margin-top">
          {{ $t("message.identificationDocumentIdentifier") }}
        </ion-title>
      </ion-list-header>
      <form @submit.prevent="saveId()" @keyup.enter="saveId()">
        <ion-item
          counter
          class="ion-margin"
          :_color="inputStatus"
          :style="{
            /*'--border-color':
              inputStatus === InputStatus.NONE
                ? undefined
                : `var(--ion-color-${inputStatus})`,*/
            '--highlight-color-focused':
              inputStatus === InputStatus.NONE
                ? undefined
                : `var(--ion-color-${inputStatus})`,
          }"
        >
          <!-- <ion-label position="stacked"></ion-label> -->
          <ion-input
            required
            v-model="documentID"
            type="text"
            autocapitalize="characters"
            _AutoCapitalizeNotWorking
            maxlength="9"
            :placeholder="placeholder"
            :color="inputStatus"
            @keydown="inputID($event)"
          ></ion-input>
          <ion-note slot="helper" :color="inputStatus">{{
            inputHelpText
          }}</ion-note>
          <!-- * Not setting a slot sets it to the right top of the input in smaller font size -->
        </ion-item>
        <ion-button size="block" class="ion-margin" type="submit"
          >Save</ion-button
        >
        <ion-button
          router-link="/settings"
          router-direction="back"
          size="block"
          class="ion-margin"
          fill="outline"
          color="danger"
          >Cancel</ion-button
        >
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { Storage } from "@capacitor/storage";
import {
  useIonRouter,
  IonPage,
  IonContent,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonRadioGroup,
  IonListHeader,
  IonItem,
  IonLabel,
  IonRadio,
  IonInput,
  IonNote,
  toastController,
} from "@ionic/vue";
import { watch } from "vue";
import { computed, ref, Ref } from "@vue/reactivity";
import {
  caretBackCircleOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
} from "ionicons/icons";
import { useI18n } from "vue-i18n";
import Header from "../components/Header.vue";

import { KEY_ID } from "@/vars";

const i18n = useI18n();

enum InputStatus {
  NONE = "",
  OK = "success",
  ERROR = "danger",
}

const router = useIonRouter();

function link(to: string) {
  console.log("hey go here", to);
  router.push(to);
}

const documentType: Ref<"dni" | "nie" | "passport-other"> = ref("dni");

const placeholder = computed(() =>
  documentType.value === "dni" ? "85020821X" : "Z6846261V"
);

const documentID = ref("");
Storage.get({
  key: KEY_ID,
}).then(({ value }) => (documentID.value = value === null ? "" : value));

const prevID = ref(documentID.value);
const inputID = (ev: KeyboardEvent) => {
  console.info(">>>> inputID ev: ", ev.key, "; prev id", prevID.value);
  // @ts-ignore
  const value = ev.target.value;
  const key = ev.key;
  console.info(
    "value.length < 9 && !/\\d/.test(value.slice(-1))? ",
    value.length < 9,
    " (",
    value.length,
    ") && ",
    !/\d/.test(value.slice(-1)),
    " (",
    value.slice(-1),
    ") = ",
    value.length < 9 && !/\d/.test(value.slice(-1))
  );
  // return "o";
  if (key === "Backspace" || key === "Delete") return true;
  if (value.length < 8 && /\d/.test(key)) {
    return true;
  }
  if (value.length === 8 && /[a-zA-Z]/.test(key)) {
    return true;
  }
  ev.preventDefault();
};
watch(documentID, (value, oldValue) => {
  documentID.value = value.toUpperCase();
  prevID.value = documentID.value;
});

function validateDNI(dni: string): boolean {
  const matchLetter = (() => {
    switch (parseInt(dni.substring(0, 8)) % 23) {
      case 0:
        return "T";
      case 1:
        return "R";
      case 2:
        return "W";
      case 3:
        return "A";
      case 4:
        return "G";
      case 5:
        return "M";
      case 6:
        return "Y";
      case 7:
        return "F";
      case 8:
        return "P";
      case 9:
        return "D";
      case 10:
        return "X";
      case 11:
        return "B";
      case 12:
        return "N";
      case 13:
        return "J";
      case 14:
        return "Z";
      case 15:
        return "S";
      case 16:
        return "Q";
      case 17:
        return "V";
      case 18:
        return "H";
      case 19:
        return "L";
      case 20:
        return "C";
      case 21:
        return "K";
      case 22:
        return "E";
    }
  })();
  return dni.charAt(8) === matchLetter;
}

const inputStatus = ref(InputStatus.NONE);
const inputHelpText = ref("");
const saveId = () => {
  console.info("to save ", documentID.value);
  let haveErrors = false;
  switch (documentType.value) {
    case "dni":
      if (documentID.value.length != 9) {
        haveErrors = true;
        inputHelpText.value = i18n.t("message.identificationHelpTextLengthDNI");
      } else if (!/[0-9]{8}[A-Za-z]{1}/.test(documentID.value)) {
        haveErrors = true;
        inputHelpText.value = i18n.t(
          "message.identificationHelpTextWrongFormatDNI"
        );
      } else if (!validateDNI(documentID.value)) {
        haveErrors = true;
        inputHelpText.value = i18n.t(
          "message.identificationHelpTextInvalidDNI"
        );
      }
      break;
    case "nie": {
      const fakeDNI = (() => {
        switch (documentID.value.charAt(0)) {
          case "X":
            return "0" + documentID.value.substring(1);
          case "Y":
            return "1" + documentID.value.substring(1);
          case "Z":
            return "2" + documentID.value.substring(1);
        }
        return documentID.value;
      })();
      if (documentID.value.length != 9) {
        haveErrors = true;
        inputHelpText.value = i18n.t("message.identificationHelpTextLengthNIE");
      } else if (!/[XYZxyz]{1}[0-9]{7}[A-Za-z]{1}/.test(documentID.value)) {
        haveErrors = true;
        inputHelpText.value = i18n.t(
          "message.identificationHelpTextWrongFormatNIE"
        );
      } else if (!validateDNI(fakeDNI)) {
        haveErrors = true;
        inputHelpText.value = i18n.t(
          "message.identificationHelpTextInvalidNIE"
        );
      }
    }
  }
  if (haveErrors) inputStatus.value = InputStatus.ERROR;
  else
    Storage.set({
      key: KEY_ID,
      value: documentID.value,
    })
      .then(() => {
        toastController
          .create({
            color: "success",
            message: "Successfully updated ID",
            icon: checkmarkCircleOutline,
            duration: 2000,
          })
          .then((toast) => toast.present());
        router.push("/settings");
      })
      .catch((e) =>
        toastController
          .create({
            color: "danger",
            message: `Error while saving: ${e}`,
            icon: closeCircleOutline,
            duration: 2000,
          })
          .then((toast) => toast.present())
      );
};
</script>

<style></style>
