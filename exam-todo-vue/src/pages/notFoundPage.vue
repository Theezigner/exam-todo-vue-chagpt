<script setup lang="ts">
import { RouterLink } from 'vue-router';

</script>

<template>
  <main class="min-h-screen px-4 py-10 text-center space-y-4">
    <section role="alert" aria-labelledby="not-found-title">
      <h1
        id="not-found-title"
        class="text-4xl font-bold text-red-600 mb-3"
      >
        404 - Page Not Found
      </h1>
      <p class="text-gray-600 mb-6">
        The page you’re looking for doesn’t exist or has been moved.
      </p>

      <RouterLink
        to="/"
        class="btn btn-outline btn-primary"
        aria-label="Go back to the Todo List"
      >
        Back to Todo List
      </RouterLink>
    </section>
  </main>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s;
  text-decoration: none;
}
.btn-outline {
  border: 1px solid currentColor;
  background-color: transparent;
}
.btn-primary {
  color: #3b82f6;
  border-color: #3b82f6;
}
.btn-primary:hover {
  background-color: #3b82f6;
  color: #ffffff;
  opacity: 0.9;
}
</style>
