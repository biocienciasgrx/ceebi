<template>
  <ion-page>
    <Header />
    <ion-content :fullscreen="true">
      <section
        class="flex-row title"
        style="background: var(--ion-color-primary-tint)"
      >
        <b>{{ $t("message.patron") }}</b>
      </section>
      <section class="flex-row title" style="background: #e5e4e2">
        🏆 &nbsp;&nbsp; {{ $t("message.platinum") }} &nbsp;&nbsp; 🏆
      </section>
      <div class="flex-row ion-margin">
        <template v-for="platino in mecenas.platino">
          <a
            class="img-link"
            v-if="imagesLoaded"
            :key="platino.nombre"
            :href="platino.web"
          >
            <img :src="platino.img" :alt="platino.nombre" height="100" />
          </a>
        </template>
      </div>

      <section class="flex-row title" style="background: #d6ac39">
        🥇 &nbsp;&nbsp; {{ $t("message.gold") }} &nbsp;&nbsp; 🥇
      </section>
      <div class="flex-row ion-margin">
        <template v-for="oro in mecenas.oro">
          <a
            class="img-link"
            v-if="imagesLoaded"
            :key="oro.nombre"
            :href="oro.web"
          >
            <img :src="oro.img" :alt="oro.nombre" height="100" />
          </a>
        </template>
      </div>
      <section class="flex-row title" style="background: #bab7b2">
        🥈 &nbsp;&nbsp; {{ $t("message.silver") }} &nbsp;&nbsp; 🥈
      </section>
      <div class="flex-row ion-margin">
        <template v-for="plata in mecenas.plata">
          <a
            class="img-link silver-smaller-link"
            v-if="imagesLoaded"
            :key="plata.nombre"
            :href="plata.web"
          >
            <img :src="plata.img" :alt="plata.nombre" height="70" />
          </a>
        </template>
      </div>
      <section class="flex-row title" style="background: #cd7f32">
        🥉 &nbsp;&nbsp; {{ $t("message.bronze") }} &nbsp;&nbsp; 🥉
      </section>
      <div class="flex-row ion-margin">
        <template v-for="bronce in mecenas.bronce">
          <a
            class="img-link silver-smaller-link"
            v-if="imagesLoaded"
            :href="bronce.web"
            :key="bronce.nombre"
          >
            <img :src="bronce.img" :alt="bronce.nombre" height="40" />
          </a>
        </template>
      </div>

      <section
        class="flex-row title"
        style="background: var(--ion-color-secondary-tint)"
      >
        <b>{{ $t("message.collaborators") }}</b>
      </section>
      <div class="flex-row ion-margin">
        <template v-for="colaborador in mecenas.colaborador">
          <a
            class="img-link silver-smaller-link"
            v-if="imagesLoaded"
            :href="colaborador.web"
            :key="colaborador.nombre"
          >
            <img :src="colaborador.img" :alt="colaborador.nombre" height="40" />
          </a>
        </template>
      </div>

      <div class="flex-row ion-margin-top">
        <p>
          {{ $t("message.developedBy") }}
          <strong>Lucas de Uña Ocampo</strong>
        </p>
      </div>
      <div class="flex-row ion-margin-bottom">
        <ion-button
          color="secondary"
          @click="goto('https://github.com/HipyCas/', 'personal_profile')"
        >
          {{ $t("message.aboutMe") }}
          <ion-icon slot="start" :md="planet" :ios="planet"></ion-icon>
        </ion-button>
        <ion-button
          fill="outline"
          color="secondary"
          @click="
            goto('https://github.com/biocienciasgrx/ceebi/', 'source_code')
          "
        >
          {{ $t("message.sourceCode") }}
          <ion-icon slot="start" :md="logoGithub" :ios="logoGithub"></ion-icon>
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  toastController,
} from "@ionic/vue";
import Header from "../components/Header.vue";
// import { trophy } from "ionicons/icons";

import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";
import { Http } from "@capacitor-community/http";

import { Mecena, Mecenas, MecenasLevel } from "@/types";
import { IMAGES_DIRECTORY, MECENAS_JSON_PATH } from "@/vars";
import { analytics, performance } from "@/firebase";

// import _mecenas from "../../mecenas.json";
import { ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";

import { logoGithub, planet } from "ionicons/icons";

import { logEvent } from "firebase/analytics";
import { trace } from "firebase/performance";
import { toast } from "@/ui";
import { useI18n } from "vue-i18n";

// const modMecenas: Mecenas = {
//   colaborador: [],
//   bronce: [],
//   plata: [],
//   oro: [],
//   platino: [],
// };
// for (const prop of Object.keys(_mecenas)) {
//   for (let i = 0; i < _mecenas[prop as MecenasLevel].length; i++)
//     //@ts-expect-error
//     _mecenas[prop as MecenasLevel][i]["finalImg"] === undefined
//       ? (modMecenas[prop as MecenasLevel][i] = {
//           ..._mecenas[prop as MecenasLevel][i],
//           finalImg: "",
//         } as Mecena)
//       : (modMecenas[prop as MecenasLevel][i] = {
//           ..._mecenas[prop as MecenasLevel][i],
//           //@ts-ignore
//           finalImg: _mecenas["finalmg"],
//         });
// }
const i18n = useI18n();

const goto = (url: string, msg: string) => {
  logEvent(analytics, "open_" + msg);
  window.location.href = url;
};

const mecenas = ref({
  colaborador: [],
  bronce: [],
  plata: [],
  oro: [],
  platino: [],
} as Mecenas);

const imagesLoaded = ref(false);
const imageLoadings = ref({
  colaborador: false,
  bronce: false,
  plata: false,
  oro: true,
  platino: false,
});

const imageExists = async (path: string) => {
  const read = await Filesystem.readdir({
    path: IMAGES_DIRECTORY,
    directory: Directory.Cache,
  });
  console.info("dirread: ", read.files, "; look for ", path);
  return read.files.includes(path);
};

const imageTrace = trace(performance, "sponsor_images_load");

(async () => {
  imageTrace.start();
  console.log("> Tracing started");
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/biocienciasgrx/ceebi/master/mecenas.json"
    );
    mecenas.value = await response.json();
    // Cache mecenas info
    Filesystem.writeFile({
      directory: Directory.Cache,
      path: MECENAS_JSON_PATH,
      encoding: Encoding.UTF8,
      data: JSON.stringify(mecenas.value),
    });
  } catch (e) {
    try {
      const { data } = await Filesystem.readFile({
        directory: Directory.Cache,
        path: MECENAS_JSON_PATH,
        encoding: Encoding.UTF8,
      });
      mecenas.value = JSON.parse(data);
    } catch (e) {
      return;
    }
  }
  console.info(" > Response JSON: ", mecenas.value);
  for (const type in mecenas.value) {
    console.info(`>> ===== ${type} =====`);
    for (let i = 0; i < mecenas.value[type as MecenasLevel].length; i++) {
      const element = mecenas.value[type as MecenasLevel][i];
      console.info(
        ">> Processing image for ",
        element.nombre,
        "with src",
        element.img
      );
      const imageCached = await imageExists(element.img.replace(/\//g, "-"));
      console.info(">> Checking for mecena ", element);
      if (imageCached) {
        console.info(">>> Image is cached, loading it");
        const { uri: imageUri } = await Filesystem.getUri({
          directory: Directory.Cache,
          path: `${IMAGES_DIRECTORY}/${element.img.replaceAll("/", "-")}`,
        });
        element.img = Capacitor.convertFileSrc(imageUri);
      } else {
        console.info(">>> Image not cached, downloading and saving");
        try {
          const imageRes = await Http.get({
            url: element.img,
            responseType: "blob",
          });
          console.info(">>> Response: ", imageRes);
          console.info(
            ">>> Is data base64?",
            /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/.test(
              imageRes.data
            )
          );
          await Filesystem.writeFile({
            directory: Directory.Cache,
            path: `${IMAGES_DIRECTORY}/${element.img.replaceAll("/", "-")}`,
            data: imageRes.data,
          });
        } catch {
          toast(i18n.t("message.errorLoadingImages"), undefined, "danger");
        }
      }
      console.info(">> Processed mecena ", element);
      console.info(">> So, this is", element.nombre, "image:", element.img);
      if (
        mecenas.value[type as MecenasLevel].indexOf(element) ===
        mecenas.value[type as MecenasLevel].length - 1
      )
        imageLoadings.value[type as MecenasLevel] = true;
      console.info(
        `[${type}] >> ${element} has index ${mecenas.value[
          type as MecenasLevel
        ].indexOf(element)} / ${
          mecenas.value[type as MecenasLevel].length - 1
        }, so colaborador images loaded? ${
          mecenas.value[type as MecenasLevel].indexOf(element) ===
          mecenas.value[type as MecenasLevel].length - 1
        }`
      );
    }
  }
})();

watch(
  imageLoadings,
  (value) => {
    let areLoaded = true;
    for (const type of Object.keys(value))
      if (!value[type as MecenasLevel]) areLoaded = false;
    imagesLoaded.value = areLoaded;
    if (areLoaded) {
      imageTrace.stop();
      console.log("> Tracing stopped");
    }
    // for (const type in mecenas) {
    //   mecenas[type as MecenasLevel].forEach(async (element) => {
    //     console.info(
    //       "About:watch<imageLoadings> >>",
    //       JSON.stringify(value),
    //       "&",
    //       imagesLoaded.value,
    //       "Here we are: ",
    //       // JSON.stringify(element),
    //       "(come from ",
    //       JSON.stringify(oldValue),
    //       ")"
    //     );
    //   });
    // }
  },
  { deep: true }
);
</script>

<style scoped>
.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1em;
  text-align: center;
}

.title {
  padding: 1em;
}

.img-link {
  text-decoration: none;
  /* color: inherit; */
  color: var(--ion-color-primary-shade);
}

.silver-smaller-link {
  max-width: 50%;
}
</style>
