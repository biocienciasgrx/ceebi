import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import Tabs from "../views/Tabs.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: Tabs,
    children: [
      {
        path: "",
        redirect: "/notifications",
      },
      {
        path: "code",
        component: () => import("@/views/QRCode.vue"),
      },
      {
        path: "schedule",
        component: () => import("@/views/Schedule.vue"),
      },
      {
        path: "news",
        component: () => import("@/views/News.vue"),
      },
      {
        path: "notifications",
        component: () => import("@/views/Notifications.vue"),
      },
      {
        path: "about",
        component: () => import("@/views/About.vue"),
      },
      {
        path: "settings",
        component: () => import("@/views/Settings.vue"),
      },
      {
        path: "id-change",
        component: () => import("@/views/IdChange.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
