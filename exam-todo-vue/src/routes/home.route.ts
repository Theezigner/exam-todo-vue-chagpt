import type {
  RouteRecordRaw,
  RouteLocationNormalized,
  NavigationGuardNext,
} from "vue-router";
import HomePage from "../pages/homePage.vue";
import { axiosInstance } from "../utils/axios";
import { db } from "../utils/dexieDB";
import { queryClient } from "../utils/queryClient";
import type { Todo } from "../utils/dexieDB";

export type HomeLoaderData = { todos: Todo[] };

export const loadHomeTodos = async (): Promise<HomeLoaderData> => {
  try {
    const res = await axiosInstance.get<Todo[]>("/todos");
    const todos: Todo[] = res.data;

    await db.todos.clear();
    await db.todos.bulkPut(todos);
    queryClient.setQueryData<Todo[]>(["todos"], todos);

    return { todos };
  } catch (error) {
    console.warn("Falling back to offline todos:", error);
    const offlineTodos: Todo[] = await db.todos.toArray();

    queryClient.setQueryData<Todo[]>(["todos"], offlineTodos);

    return { todos: offlineTodos };
  }
};

export const homeRoute: RouteRecordRaw = {
  path: "/",
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
};
