<template>
  <ion-page>
    <Header />
    <ion-content :fullscreen="true" class="ion-padding">
      <NoConnection v-if="!connected && !haveCachedNews">
        {{ $t("message.newsConnectAtLeastOnce") }}
      </NoConnection>
      <template v-else>
        <div v-if="loaded">
          <ion-refresher slot="fixed" @ionRefresh.passive="refreshNews($event)">
            <ion-refresher-content></ion-refresher-content>
          </ion-refresher>
          <div
            class="ion-margin-bottom ion-padding-vertical new"
            v-for="_new in news"
            :key="_new.title"
          >
            <strong>{{ _new.title }}</strong
            ><br />
            <ion-text color="medium" class="clamp-3"
              >{{ (_new.contentSnippet || "").split("...")[0] }} ...</ion-text
            >
            <ion-button fill="clear" @click="open(_new.link || '/news')"
              >{{ $t("message.newsReadMore") }}
              <ion-icon :icon="openOutline" slot="end"></ion-icon>
            </ion-button>
          </div>
        </div>
        <div v-if="!loaded">
          <div
            class="ion-margin-bottom ion-padding-vertical new"
            v-for="i in 5"
            :key="i"
          >
            <ion-skeleton-text
              animated
              style="width: 100%; margin-bottom: 0.75em"
            ></ion-skeleton-text
            ><br />
            <ion-skeleton-text
              animated
              :style="{ width: randWidth() }"
            ></ion-skeleton-text>
            <ion-skeleton-text
              animated
              :style="{ width: randWidth() }"
            ></ion-skeleton-text>
            <ion-skeleton-text
              animated
              :style="{ width: randWidth() }"
            ></ion-skeleton-text>
            <ion-button fill="clear" @click="open('')"
              ><ion-skeleton-text
                animated
                style="width: 5em"
              ></ion-skeleton-text>
            </ion-button>
          </div>
        </div>
      </template>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonText,
  IonButton,
  IonIcon,
  IonSkeletonText,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/vue";
import {
  openOutline,
  cloudOfflineOutline,
  cloudDownloadOutline,
} from "ionicons/icons";
import Header from "../components/Header.vue";
// @ts-ignore
import NoConnection from "../components/NoConnection.vue";

import { default as Parser, Item } from "rss-parser";
import { ref, Ref, watch } from "vue";
import { Browser } from "@capacitor/browser";
import { Http } from "@capacitor-community/http";
import { Network } from "@capacitor/network";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { useI18n } from "vue-i18n";
import { trace } from "firebase/performance";
import { performance } from "@/firebase";
import { toast } from "@/ui";

const i18n = useI18n();

/** Load news from cache file */
async function loadNews(finished: Ref<boolean>, toStore: Ref<Item[]>) {
  const loadTrace = trace(performance, "load_news");
  loadTrace.start();
  console.info("loadNews > loading news from file");
  finished.value = false;
  const { data } = await Filesystem.readFile({
    directory: Directory.Cache,
    path: "news.json",
    encoding: Encoding.UTF8,
  });
  toStore.value = JSON.parse(data);
  finished.value = true;
  loadTrace.stop();
}

async function getNews(
  parser: Parser,
  finished: Ref<boolean>,
  toStore: Ref<Item[]>
) {
  const fetchTrace = trace(performance, "fetch_news");
  fetchTrace.start();
  console.info("Getting news...");
  finished.value = false;
  // Suggest to load news from cache if it takes too long
  const suggestCache = () => {
    if (!finished.value) {
      toast(i18n.t("message.newsLoadedOffline"), cloudDownloadOutline);
      loadNews(finished, toStore);
    }
  };
  setTimeout(suggestCache, 5000); //* Increased after ceebi-15
  // await new Promise((r) => setTimeout(r, 19000));
  const { data: rss } = await Http.get({
    url: "https://www.biociencias.es/feed",
  });
  const feed = await parser.parseString(rss);
  toStore.value = feed.items;
  // await new Promise((r) => setTimeout(r, 200));
  finished.value = true;
  fetchTrace.stop();
  // if (event !== undefined)
  //   if (event.target !== null) event.target.complete();
  const saveNews = trace(performance, "save_news");
  saveNews.start();
  Filesystem.writeFile({
    directory: Directory.Cache,
    path: "news.json",
    recursive: true,
    data: JSON.stringify(toStore.value),
    encoding: Encoding.UTF8,
  })
    .catch((e) => {
      console.log(e);
      saveNews.stop();
    })
    .then(() => saveNews.stop());
}

const news: Ref<Item[]> = ref([]);
const loaded = ref(false);

const parser = new Parser();

const connected = ref(false);
const haveCachedNews = ref(false);
(async () => {
  const status = await Network.getStatus();
  connected.value = status.connected;
  console.info("News.vue > Am i connected?", connected.value);
  if (connected.value) {
    getNews(parser, loaded, news);
    haveCachedNews.value = true;
  } else {
    try {
      console.info(
        await Filesystem.stat({
          path: "news.json",
          directory: Directory.Cache,
        })
      );
      haveCachedNews.value = true;
      loadNews(loaded, news);
    } catch (e) {
      console.info("No cache news", e);
      haveCachedNews.value = false;
    }
    console.info("After all, do I have cached news? ", haveCachedNews.value);
  }
})();
Network.addListener("networkStatusChange", (status) => {
  connected.value = status.connected;
  console.log(
    "Connected? ",
    status.connected,
    ". Have cache news? ",
    haveCachedNews.value
  );
  if (status.connected) getNews(parser, loaded, news);
  // else loadNews(loaded, )
  //* I don't actually need to reload the news from cache if user goes offline, they should already be loaded
});

const refreshNews = async (event: any) => {
  if (connected.value) await getNews(parser, loaded, news);
  else toast(i18n.t("message.newsCannotRefreshOffline"), cloudOfflineOutline);
  event.target.complete();
};

function open(url: string) {
  Browser.open({
    url,
    presentationStyle: "popover",
  });
}

const randWidth = () => `${Math.floor(Math.random() * (90 - 75) + 75)}%`;
</script>

<style scoped>
.new {
  display: flex !important;
  flex-direction: column !important;
  justify-content: center;
  align-items: flex-start;
  background-color: var(--ion-item-background);
  padding: 1em;
  gap: 0.1em;
  border-radius: 5px;
  box-shadow: 0 0px 10px -3px rgba(55, 55, 55, 0.5);
}

.clamp-3 {
  font-size: 0.8em;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
