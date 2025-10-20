<script setup lang="ts">
import { computed } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { useQueryClient } from "@tanstack/vue-query";
import { useHead } from "@unhead/vue";
import type { Todo } from "../utils/dexieDB";

const route = useRoute();
const queryClient = useQueryClient();

const todo = computed(() => {
  const todos = queryClient.getQueryData<Todo[]>(["todos"]) ?? [];
  const id = route.params.id as string;
  return todos.find((t) => String(t.id) === String(id));
});

useHead({
  title: "Task Details",
  meta: [
    { name: "description", content: "Task description." },
  ],
  link: [
    { rel: "icon", href: "/favicon.ico" },
    { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
  ],
});
</script>

<template>
  <main class="max-w-sm mx-auto p-4 space-y-4">
    <article v-if="todo" class="border rounded bg-base-100 shadow-md space-y-3 p-4 text-center">
      <header>
        <h2 class="text-xl font-bold">Task Details</h2>
      </header>

      <p>
        <strong>Task:</strong> {{ todo.title.charAt(0).toUpperCase() + todo.title.slice(1) }}
      </p>

      <p class="flex flex-row gap-2 justify-center">
        <strong>Status:</strong>
        <span v-if="todo.completed" class="flex justify-center items-center gap-1 text-green-600">
          Completed
        </span>
        <span v-else class="flex items-center justify-center gap-1 text-red-600">
          Not Completed
        </span>
      </p>
    </article>

    <article v-else class="border rounded bg-base-100 shadow-md space-y-3 p-4">
      <p class="text-center text-gray-500">Todo not found</p>
    </article>

    <footer class="flex justify-center">
      <RouterLink to="/" class="btn btn-sm btn-outline">
        Back to Todo List
      </RouterLink>
    </footer>
  </main>
</template>



