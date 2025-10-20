import { createRouter, createWebHistory } from "vue-router";
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
          beforeEnter: async (to, from, next) => {
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
        // ... other routes
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
