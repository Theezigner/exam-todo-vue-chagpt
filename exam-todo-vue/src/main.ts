import { createApp } from "vue";
import { createHead } from "@unhead/vue/client";
import { VueQueryPlugin } from "@tanstack/vue-query";
import App from "./App.vue";
import router from "./routes/index";
import { queryClient } from "./utils/queryClient";

const app = createApp(App);

const head = createHead();

app.use(VueQueryPlugin, {
  queryClient,
});

app.use(router);

app.use(head);

app.mount("#app");
