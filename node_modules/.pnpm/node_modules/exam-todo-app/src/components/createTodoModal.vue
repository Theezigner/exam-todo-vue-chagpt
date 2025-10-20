<script setup lang="ts">
import { ref } from 'vue';
import { AiOutlinePlus } from 'vue-icons-lib/ai';

type Todo = {
  id: string | number;
  title: string;
  completed: boolean;
};

const props = defineProps<{
  onAdd: (newTodo: Omit<Todo, "id">) => void;
}>();

const isOpen = ref(false);
const titleState = ref('');
const errorState = ref<string | null>(null);

const resetForm = () => {
    titleState.value = '';
    errorState.value = null;
};

const validate = (): boolean => {
  const title = titleState.value.trim();
  if (!title) {
    errorState.value = "Title cannot be empty.";
    return false;
  }
  errorState.value = null;
  return true;
};

const closeModal = () => {
    isOpen.value = false;
    resetForm();
};

const onSubmit = () => {
  if (!validate()) return;

  props.onAdd({
    title: titleState.value.trim(),
    completed: false,
  });
  closeModal();
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    closeModal();
  }
};
</script>

<template>
  <div>
    <button
      type="button"
      class="btn btn-primary btn-sm shadow-none"
      @click="isOpen = true"
      aria-haspopup="dialog"
      :aria-expanded="isOpen"
      aria-controls="create-todo-modal"
    >
      <span aria-hidden="true">
       <AiOutlinePlus :size="16" />
      </span>
      <span class="hidden md:inline ml-1">New Task</span>
    </button>

    <dialog
      v-if="isOpen"
      id="create-todo-modal"
      open
      class="modal modal-open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-modal-title"
    >
      <article
        class="modal-box"
        tabindex="-1"
        @keydown="handleKeyDown"
      >
        <header>
          <h3 id="create-modal-title" class="font-bold text-lg mb-2">
            Add a new task
          </h3>
        </header>

        <form
          @submit.prevent="onSubmit"
          class="flex flex-col gap-2"
        >
          <label class="flex flex-col gap-1">
            <span class="text-sm font-medium">Title</span>
            <input
              type="text"
              class="input input-bordered input-sm"
              placeholder="Task title"
              v-model="titleState"
              autofocus
            />
          </label>
          <p v-if="errorState" class="text-red-500 text-xs">{{ errorState }}</p>

          <footer class="modal-action">
            <button
              type="submit"
              class="btn btn-primary btn-sm shadow-none"
            >
              Add
            </button>
            <button
              type="button"
              class="btn btn-sm btn-ghost"
              @click="closeModal"
            >
              Cancel
            </button>
          </footer>
        </form>
      </article>
    </dialog>
  </div>
</template>