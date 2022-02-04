<template>
  <ion-page>
    <Header />
    <ion-content :fullscreen="true">
      <section
        class="flex-row title"
        style="background: var(--ion-color-primary-tint)"
      >
        <b>MECENAS</b>
      </section>
      <section class="flex-row title" style="background: #e5e4e2">
        🏆 &nbsp;&nbsp; Platino &nbsp;&nbsp; 🏆
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
        🥇 &nbsp;&nbsp; Oro &nbsp;&nbsp; 🥇
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
        🥈 &nbsp;&nbsp; Plata &nbsp;&nbsp; 🥈
      </section>
      <div class="flex-row ion-margin">
        <template v-for="plata in mecenas.plata">
          <a
            class="img-link"
            v-if="imagesLoaded"
            :key="plata.nombre"
            :href="plata.web"
          >
            <img :src="plata.img" :alt="plata.nombre" height="70" />
          </a>
        </template>
      </div>
      <section class="flex-row title" style="background: #cd7f32">
        🥉 &nbsp;&nbsp; Bronce &nbsp;&nbsp; 🥉
      </section>
      <div class="flex-row ion-margin">
        <template v-for="bronce in mecenas.bronce">
          <a
            class="img-link"
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
        <b>COLABORADORES</b>
      </section>
      <div class="flex-row ion-margin">
        <template v-for="colaborador in mecenas.colaborador">
          <a
            class="img-link"
            v-if="imagesLoaded"
            :href="colaborador.web"
            :key="colaborador.nombre"
          >
            <img :src="colaborador.img" :alt="colaborador.nombre" height="40" />
          </a>
        </template>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, toastController } from "@ionic/vue";
import Header from "../components/Header.vue";
// import { trophy } from "ionicons/icons";

import { Filesystem, Directory } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";
import { Http } from "@capacitor-community/http";

import { IMAGES_DIRECTORY } from "@/vars";

import _mecenas from "../../mecenas.json";
import { computed, ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
type MecenasLevel = "bronce" | "colaborador" | "plata" | "oro" | "platino";
interface Mecenas {
  colaborador: Mecena[];
  bronce: Mecena[];
  plata: Mecena[];
  oro: Mecena[];
  platino: Mecena[];
}
interface Mecena {
  nombre: string;
  img: string;
  web: string;
  // finalImg: string;
}
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
const mecenas: Mecenas = _mecenas;
console.info(_mecenas);

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

function blobToBase64(blob: Blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

for (const type in mecenas) {
  console.info(`>> ===== ${type} =====`);
  mecenas[type as MecenasLevel].forEach(async (element) => {
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
        const toast = await toastController.create({
          message: "Error when downloading images",
          color: "danger",
          duration: 2000,
        });
        toast.present();
      }
    }
    console.info(">> Processed mecena ", element);
    console.info(">> So, this is", element.nombre, "image:", element.img);
    if (
      mecenas[type as MecenasLevel].indexOf(element) ===
      mecenas[type as MecenasLevel].length - 1
    )
      imageLoadings.value[type as MecenasLevel] = true;
    console.info(
      `[${type}] >> ${element} has index ${mecenas[
        type as MecenasLevel
      ].indexOf(element)} / ${
        mecenas[type as MecenasLevel].length - 1
      }, so colaborador images loaded? ${
        mecenas[type as MecenasLevel].indexOf(element) ===
        mecenas[type as MecenasLevel].length - 1
      }`
    );
  });
}

watch(
  imageLoadings,
  (value, oldValue) => {
    let areLoaded = true;
    for (const type of Object.keys(value))
      if (!value[type as MecenasLevel]) areLoaded = false;
    imagesLoaded.value = areLoaded;
    for (const type in mecenas) {
      mecenas[type as MecenasLevel].forEach(async (element) => {
        console.info(
          "About:watch<imageLoadings> >>",
          JSON.stringify(value),
          "&",
          imagesLoaded.value,
          "Here we are: ",
          // JSON.stringify(element),
          "(come from ",
          JSON.stringify(oldValue),
          ")"
        );
      });
    }
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
</style>
