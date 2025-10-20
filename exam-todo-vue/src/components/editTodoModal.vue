<script setup lang="ts">
import { ref } from 'vue';
import { FiEdit2 } from 'vue-icons-lib/fi';
import type { Todo } from '../utils/dexieDB';

const props = defineProps<{
  todo: Todo;
  onUpdate: (updated: Todo) => void;
}>();

const isOpen = ref(false);
const titleState = ref('');
const completedState = ref<'true' | 'false'>('false');
const errorState = ref<string | null>(null);

const resetForm = () => {
    titleState.value = props.todo.title;
    completedState.value = props.todo.completed ? 'true' : 'false';
    errorState.value = null;
};

const open = () => {
  resetForm();
  isOpen.value = true;
};

const validate = (): boolean => {
  if (!titleState.value.trim()) {
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

  props.onUpdate({
    ...props.todo,
    title: titleState.value.trim(),
    completed: completedState.value === "true",
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
      class="btn btn-xs py-0"
      @click="open"
      :aria-label="`Edit task: ${props.todo.title}`"
    >
     <FiEdit2 :size="12" color="blue" /> 
    
    </button>

    <dialog
      v-if="isOpen"
      open
      class="modal modal-open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
    >
      <article
        class="modal-box"
        tabindex="-1"
        @keydown="handleKeyDown"
      >
        <header>
          <h3 id="edit-modal-title" class="font-bold text-lg mb-2">
            Edit task
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
              v-model="titleState"
              autofocus
            />
          </label>
          <p v-if="errorState" class="text-red-500 text-xs">{{ errorState }}</p>

          <label class="flex flex-col gap-1">
            <span class="text-sm font-medium">Status</span>
            <select
              class="select select-bordered select-sm"
              v-model="completedState"
            >
              <option value="false">Not done</option>
              <option value="true">Done</option>
            </select>
          </label>

          <footer class="modal-action">
            <button
              type="submit"
              class="btn btn-primary btn-sm shadow-none"
            >
              Save
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
