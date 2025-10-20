<script setup lang="ts">
import { ref } from "vue";
import { FiMoon, FiSun } from "vue-icons-lib/fi";

const storedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", storedTheme);
const theme = ref(storedTheme);

const toggleTheme = () => {
  const newTheme = theme.value === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  theme.value = newTheme;
};
</script>

<template>
  <nav aria-label="Theme toggle control">
    <button
      class="btn btn-sm absolute right-5 top-10 p-2 flex items-center gap-1 bg-base-200"
      @click="toggleTheme"
      aria-label="Toggle dark/light mode"
    >
      <FiMoon
        v-if="theme === 'light'"
        :size="20"
        stroke="currentColor"
        :stroke-width="2"
      />

      <FiSun v-else :size="20" stroke="currentColor" :stroke-width="2" />

      <span class="ml-1 hidden md:inline">
        {{ theme === "light" ? "Dark Mode" : "Light Mode" }}
      </span>
    </button>
  </nav>
</template>

<style scoped>
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s;
  text-decoration: none;
}
.absolute {
  position: absolute;
}
.right-3 {
  right: 0.75rem;
}
.p-2 {
  padding: 0.5rem;
}
.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.gap-1 {
  gap: 0.25rem;
}
.ml-1 {
  margin-left: 0.25rem;
}
@media (min-width: 768px) {
  .md\:inline {
    display: inline;
  }
}
</style>
