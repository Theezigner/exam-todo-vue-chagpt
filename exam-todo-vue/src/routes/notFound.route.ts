import type { RouteRecordRaw } from "vue-router";
import NotFoundPage from "../pages/notFoundPage.vue";

export const notFoundRoute: RouteRecordRaw = {
  path: "/:pathMatch(.*)*",
  name: "notFound",
  component: NotFoundPage,
};
