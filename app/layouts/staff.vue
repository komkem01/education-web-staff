<template>
  <div class="staff-shell">
    <StaffAppSidebar :collapsed="sidebarCollapsed" @toggle="sidebarCollapsed = !sidebarCollapsed" />

    <div class="staff-body" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <StaffAppTopbar @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />

      <main class="staff-main">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const sidebarCollapsed = ref(false)
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  font-family: 'Segoe UI', 'Noto Sans Thai', sans-serif;
  font-size: 15px;
  color: #1a202c;
  background: #f7f8fa;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
  cursor: pointer;
}
</style>

<style scoped>
.staff-shell {
  display: flex;
  min-height: 100vh;
}

.staff-body {
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
  min-width: 0;
  transition: margin-left 0.2s ease;
}

.staff-body.sidebar-collapsed {
  margin-left: 64px;
}

.staff-main {
  padding: 28px 32px;
  flex: 1;
}

@media (max-width: 900px) {
  .staff-body {
    margin-left: 0;
  }
}
</style>
