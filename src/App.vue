<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div id="app-shell">
    <header class="site-header">
      <RouterLink to="/" class="brand">
        <span class="brand-dot"></span>
        Kasb Kompas
      </RouterLink>
      <nav>
        <RouterLink to="/quiz">Testni boshlash</RouterLink>
        <RouterLink to="/careers">Kasblar</RouterLink>
        <RouterLink to="/stats">Statistika</RouterLink>
      </nav>
    </header>

    <main class="site-main">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
#app-shell {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  border-bottom: 1px solid var(--border);
  background: color-mix(in srgb, var(--bg) 82%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.brand {
  display: flex;
  align-items: center;
  gap: 9px;
  font-weight: 800;
  font-size: 20px;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-decoration: none;
  letter-spacing: -0.3px;
}

.brand-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent-gradient);
  flex-shrink: 0;
}

nav {
  display: flex;
  gap: 6px;
}

nav a {
  color: var(--text);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  padding: 9px 16px;
  border-radius: 100px;
  transition: background 0.2s, color 0.2s;
}

nav a:hover {
  background: var(--accent-bg);
  color: var(--accent);
}

nav a.router-link-exact-active {
  background: var(--accent-gradient);
  color: #fff;
}

.site-main {
  flex: 1;
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
  padding: 40px 24px 64px;
  box-sizing: border-box;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.22s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
