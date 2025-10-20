<script setup lang="ts">
import { ref } from 'vue';
import { FiTrash2 } from 'vue-icons-lib/fi';

type Todo = {
  id: string | number;
  title: string;
  completed: boolean;
};

const props = defineProps<{
  todo: Todo;
  onDelete: (id: string | number) => void;
}>();

const isOpen = ref(false);

const handleDelete = () => {
  props.onDelete(props.todo.id);
  isOpen.value = false;
};

const closeModal = () => {
  isOpen.value = false;
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
      class="btn btn-xs py-0 hover:text-red-600 border-none"
      :aria-label="`Delete task: ${props.todo.title}`"
      @click="isOpen = true"
    >
      <span aria-hidden="true">
        <FiTrash2 />
      </span>
    </button>

    <dialog
      v-if="isOpen"
      open
      class="modal modal-open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <article
        class="modal-box"
        tabindex="-1"
        @keydown="handleKeyDown"
      >
        <header>
          <h3 id="delete-modal-title" class="font-bold text-lg mb-2">
            Delete task
          </h3>
        </header>

        <p>
          Are you sure you want to delete
          <span class="font-semibold">"{{ props.todo.title }}"</span>?
        </p>

        <footer class="modal-action">
          <button
            type="button"
            class="btn btn-sm btn-error bg-red-700 hover:bg-red-800 text-white border-none shadow-none"
            @click="handleDelete"
          >
            Yes, Delete
          </button>
          <button
            type="button"
            class="btn btn-sm btn-ghost"
            @click="closeModal"
          >
            Cancel
          </button>
        </footer>
      </article>
    </dialog>
  </div>
</template>
