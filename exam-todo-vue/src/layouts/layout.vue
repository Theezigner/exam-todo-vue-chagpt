<script setup lang="ts">
import ThemeToggle from "../components/themeToggle.vue";
</script>

<template>
  <main class="relative">
    <header class="flex flex-col">
      <ThemeToggle />
      <h1 class="text-2xl text-center font-bold mt-10 mb-4">Todo App</h1>
    </header>
    <router-view />
  </main>
</template>

