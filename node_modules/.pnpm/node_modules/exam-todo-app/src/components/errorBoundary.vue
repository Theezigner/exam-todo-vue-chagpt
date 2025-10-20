<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps<{
  error: unknown;
}>();

const message = computed(() => {
  const error = props.error;
  let msg = "An unexpected error occurred.";

  if (typeof error === "string") {
    msg = error;
  } else if (error instanceof Error) {
    const errorMsg = error.message ?? "";

    if (/Network Error/i.test(errorMsg)) {
      msg = "You appear to be offline. Please check your connection.";
    } else if (/404/.test(errorMsg)) {
      msg = "The page you are looking for could not be found.";
    } else if (/500/.test(errorMsg)) {
      msg = "Internal server error. Please try again later.";
    } else if (errorMsg) {
      msg = errorMsg;
    }
  }

  return msg || "An unexpected error occurred.";
});
</script>

<template>
  <main
    role="alert"
    aria-live="assertive"
    class="p-4 text-red-600 bg-white dark:bg-gray-800 rounded-lg shadow-xl mx-auto max-w-sm"
  >
    <header class="mb-4 border-b border-red-200 dark:border-red-700 pb-2">
      <h2 class="font-bold text-xl flex items-center gap-2">
        
        Error Occurred
      </h2>
    </header>
    <p class="text-sm dark:text-red-400 mb-6">{{ message || "Something went wrong." }}</p>
    <footer class="mt-4">
      <RouterLink to="/" class="btn btn-sm border-2 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 transition duration-150 rounded-full font-medium">
        Back to Todo List
      </RouterLink>
    </footer>
  </main>
</template>

<style scoped>
.btn {
  padding: 0.5rem 1rem;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 8rem;
}
</style>
