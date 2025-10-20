<script setup lang="ts">
import { ref, computed } from "vue";
import { RouterLink } from "vue-router";
import { useMutation, useQueryClient, useQuery } from "@tanstack/vue-query";
import { axiosInstance } from "../utils/axios";
import CreateTodoModal from "../components/createTodoModal.vue";
import EditTodoModal from "../components/editTodoModal.vue";
import DeleteTodoModal from "../components/deleteTodoModal.vue";
import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";
import { useHead } from "@unhead/vue";
import type { Todo } from "../utils/dexieDB";
import ChatGPT from "../components/chatGPT.vue";

const toast = useToast();

const searchTerm = ref<string>("");
const currentPage = ref<number>(1);
const todosPerPage = 10;
const queryClient = useQueryClient();

const { data: todos } = useQuery<Todo[]>({
  queryKey: ["todos"],
  queryFn: async () => {
    const cached = queryClient.getQueryData<Todo[]>(["todos"]);
    if (cached && cached.length > 0) {
      return cached;
    }
    try {
      const res = await axiosInstance.get<Todo[]>("/todos");
      return res.data;
    } catch (error) {
      console.warn("Failed to fetch todos:", error);
      return [];
    }
  },
  initialData: () => queryClient.getQueryData<Todo[]>(["todos"]) ?? [],
});

const filteredData = computed(() => {
  const todosList = todos.value ?? [];
  if (!searchTerm.value.trim()) {
    return todosList;
  }
  const searchLower = searchTerm.value.toLowerCase().trim();
  return todosList.filter((todo: Todo) =>
    todo.title.toLowerCase().includes(searchLower)
  );
});

const paginatedTodos = computed(() =>
  filteredData.value.slice(
    (currentPage.value - 1) * todosPerPage,
    currentPage.value * todosPerPage
  )
);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredData.value.length / todosPerPage))
);

// State for the ChatGPT Modal
const isChatOpen = ref<boolean>(false);

// Function to toggle the chatbox visibility
const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value;
};

const createTodoMutation = useMutation<Todo, Error, Omit<Todo, "id">>({
  mutationFn: async (newTodo) => {
    const res = await axiosInstance.post("/todos", newTodo);
    return res.data as Todo;
  },
  onSuccess: (serverTodo, variables) => {
    const next = serverTodo ?? ({ id: Date.now(), ...variables } as Todo);
    toast.success("Task added!");
    queryClient.setQueryData<Todo[]>(["todos"], (old = []) => [next, ...old]);
  },
  onError: () => toast.error("Failed to add task."),
});

const updateTodoMutation = useMutation<Todo | void, Error, Todo>({
  mutationFn: async (updatedTodo) => {
    const res = await axiosInstance.put(
      `/todos/${updatedTodo.id}`,
      updatedTodo
    );
    return res.data as Todo | void;
  },
  onSuccess: (serverTodo, variables) => {
    const next = (serverTodo as Todo) ?? variables;
    toast.success("Task updated!");
    queryClient.setQueryData<Todo[]>(["todos"], (old = []) =>
      old.map((t) => (String(t.id) === String(next.id) ? next : t))
    );
  },
  onError: () => toast.error("Failed to update task."),
});

const deleteTodoMutation = useMutation<string | number, Error, string | number>(
  {
    mutationFn: async (id) => {
      await axiosInstance.delete(`/todos/${id}`);
      return id;
    },
    onSuccess: (id) => {
      toast.success("Task deleted!");
      queryClient.setQueryData<Todo[]>(["todos"], (old = []) =>
        old.filter((t) => String(t.id) !== String(id))
      );
    },
    onError: () => toast.error("Failed to delete task."),
  }
);

const handleAdd = (newTodo: Omit<Todo, "id">) => {
  createTodoMutation.mutate(newTodo);
};

const handleUpdate = (updatedTodo: Todo) => {
  updateTodoMutation.mutate(updatedTodo);
};

const handleDelete = (id: string | number) => {
  deleteTodoMutation.mutate(id);
};

useHead({
  title: "Todo App-Home",
  meta: [
    {
      name: "description",
      content: "A simple and accessible todo application.",
    },
  ],
  link: [
    { rel: "icon", href: "/favicon.ico" },
    { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
  ],
});
</script>

<template>
  <main class="space-y-6 max-w-lg mx-auto px-4 py-6">
    <button
      class="chat-toggle-button btn btn-primary"
      @click="toggleChat"
      aria-label="Toggle AI Chat Window"
    >
      <span class="font-bold">{{ isChatOpen ? "Close Chat" : "Ask AI" }}</span>
    </button>

    <Teleport to="body">
      <div
        v-if="isChatOpen"
        class="fixed inset-0 z-[1001] flex items-center justify-center"
      >
        <div
          class="absolute inset-0 bg-black opacity-50"
          @click="toggleChat"
        ></div>

        <div
          class="bg-base-200 rounded-lg shadow-2xl z-[1002] p-4 max-w-lg w-full mx-4"
          role="dialog"
          aria-modal="true"
        >
          <div class="flex justify-end">
            <button
              @click="toggleChat"
              class="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
            >
              &times;
            </button>
          </div>

          <ChatGPT />
        </div>
      </div>
    </Teleport>
    <section class="flex justify-center">
      <form class="form-control w-full max-w-md" aria-label="Search todos">
        <input
          type="text"
          class="input input-bordered input-sm w-full"
          placeholder="Search todos..."
          v-model="searchTerm"
          aria-label="Search todos by title"
        />
      </form>
    </section>

    <section class="flex justify-end">
      <CreateTodoModal :onAdd="handleAdd" />
    </section>

    <section
      aria-label="Todo list"
      class="grid gap-4 rounded shadow-md bg-base-100 p-4"
    >
      <article
        v-for="todo in paginatedTodos"
        :key="todo.id"
        class="border-b border-base-300 pb-3 last:border-b-0"
        :aria-label="`Todo: ${todo.title}`"
      >
        <header class="flex items-start gap-2 text-left">
          <h2 class="text-md font-semibold break-words">
            <RouterLink
              :to="`/todo/${String(todo.id)}`"
              class="link link-hover"
            >
              {{ todo.title.charAt(0).toUpperCase() + todo.title.slice(1) }}
            </RouterLink>
          </h2>
          <EditTodoModal :todo="todo" :onUpdate="handleUpdate" />
        </header>

        <div class="flex items-center justify-between mt-1">
          <p>
            <span
              :class="[
                'font-semibold',
                todo.completed ? 'text-green-600' : 'text-red-600',
              ]"
            >
              {{ todo.completed ? "Done" : "Not done" }}
            </span>
          </p>
          <DeleteTodoModal :todo="todo" :onDelete="handleDelete" />
        </div>
      </article>
    </section>

    <nav
      class="flex justify-center items-center gap-4 mt-6"
      aria-label="Pagination controls"
    >
      <button
        class="btn btn-sm"
        @click="currentPage = Math.max(currentPage - 1, 1)"
        :disabled="currentPage === 1"
        aria-label="Go to previous page"
      >
        Prev
      </button>

      <span class="text-sm font-medium">
        Page {{ currentPage }} of {{ totalPages }}
      </span>

      <button
        class="btn btn-sm"
        @click="currentPage = Math.min(currentPage + 1, totalPages)"
        :disabled="currentPage === totalPages"
        aria-label="Go to next page"
      >
        Next
      </button>
    </nav>
  </main>
</template>

<style scoped>
.chat-toggle-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 25px;
  color: white;
  border: none;
  border-radius: 9999px; 
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000; 
  transition: background-color 0.2s;
}

.chat-toggle-button:hover {
  background-color: #2563eb; 
}
</style>