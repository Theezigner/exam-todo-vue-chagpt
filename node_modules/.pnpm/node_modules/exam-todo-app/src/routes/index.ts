import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
  type NavigationGuardNext,
} from "vue-router";
import Layout from "../layouts/layout.vue";
import HomePage from "../pages/homePage.vue";
import NotFoundPage from "../pages/notFoundPage.vue";
import { loadHomeTodos } from "./home.route";
import { todoDetailRoute } from "./todoDetail.route";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Layout,
      children: [
        {
          path: "",
          name: "home",
          component: HomePage,
          beforeEnter: async (
            _to: RouteLocationNormalized,
            _from: RouteLocationNormalized,
            next: NavigationGuardNext
          ) => {
            try {
              await loadHomeTodos();
              next();
            } catch (error) {
              console.error("Error loading todos:", error);
              next();
            }
          },
        },
        todoDetailRoute,
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notFound",
      component: NotFoundPage,
    },
  ],
});

export default router;
