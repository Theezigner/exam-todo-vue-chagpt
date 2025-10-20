import type { RouteRecordRaw } from "vue-router";
import TodoDetailPage from "../pages/todoDetailpage.vue";
import { axiosInstance } from "../utils/axios";
import { queryClient } from "../utils/queryClient";

export type Todo = { id: number | string; title: string; completed: boolean };
export type TodoDetailLoaderData = { todo: Todo };

export const loadTodoDetail = async (
  rawId: string
): Promise<TodoDetailLoaderData> => {
  const key: string | number = /^\d+$/.test(rawId) ? Number(rawId) : rawId;

  const cached = queryClient.getQueryData<Todo[]>(["todos"]) ?? [];
  const fromCache = cached.find((t) => String(t.id) === String(key));
  if (fromCache) {
    console.log(`Todo ${key} loaded from TanStack Query cache.`);
    return { todo: fromCache };
  }

  try {
    console.log(`Fetching Todo ${key} from network...`);
    const res = await axiosInstance.get<Todo>(
      `/todos/${encodeURIComponent(rawId)}`
    );
    return { todo: res.data };
  } catch (error) {
    console.error(
      `Network fetch failed for Todo ${key}. Attempting offline fallback.`,
      error
    );

    const { db } = await import("../utils/dexieDB");
    const offline = await db.todos.get(key as any);

    if (offline) {
      console.log(`Todo ${key} loaded from Dexie offline database.`);
      return { todo: offline };
    }

    throw new Error(
      `Todo with ID '${rawId}' not found in cache, network, or offline database.`
    );
  }
};

export const todoDetailRoute: RouteRecordRaw = {
  path: "/todo/:id",
  name: "todoDetail",
  component: TodoDetailPage,

  beforeEnter: async (to, from, next) => {
    try {
      const id = to.params.id as string;
      await loadTodoDetail(id);
      next();
    } catch (error) {
      console.error("Error loading todo detail:", error);
      next();
    }
  },
};
