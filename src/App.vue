<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import CompassIcon from './components/CompassIcon.vue'

const route = useRoute()
const menuOpen = ref(false)

// Close the mobile menu whenever the route changes.
watch(() => route.fullPath, () => (menuOpen.value = false))
</script>

<template>
  <div id="app-shell">
    <header class="site-header">
      <RouterLink to="/" class="brand">
        <span class="brand-mark"><CompassIcon /></span>
        Kasb Kompas
      </RouterLink>

      <!-- Desktop nav -->
      <nav class="desktop-nav">
        <RouterLink to="/quiz">Test</RouterLink>
        <RouterLink to="/careers">Kasblar</RouterLink>
        <RouterLink to="/stats">Statistika</RouterLink>
      </nav>

      <!-- Mobile cluster: primary action + menu toggle -->
      <div class="mobile-nav">
        <RouterLink to="/quiz" class="m-cta">Test</RouterLink>
        <button
          type="button"
          class="m-toggle"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          aria-label="Menyu"
          @click="menuOpen = !menuOpen"
        >
          <span class="m-bar" :class="{ open: menuOpen }"></span>
        </button>
      </div>
    </header>

    <!-- Mobile dropdown panel -->
    <Transition name="menu">
      <nav v-if="menuOpen" id="mobile-menu" class="mobile-menu" @keydown.esc="menuOpen = false">
        <RouterLink to="/careers">Kasblar</RouterLink>
        <RouterLink to="/stats">Statistika</RouterLink>
      </nav>
    </Transition>

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
  gap: 12px;
  padding: 14px 24px;
  border-bottom: 1.5px solid var(--border);
  background: color-mix(in srgb, var(--bg) 85%, transparent);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--display);
  font-weight: 700;
  font-size: 19px;
  letter-spacing: -0.02em;
  color: var(--text-h);
  text-decoration: none;
}

.brand-mark {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
}

.desktop-nav {
  display: flex;
  gap: 4px;
}

.desktop-nav a {
  color: var(--text);
  text-decoration: none;
  font-family: var(--display);
  font-size: 14px;
  font-weight: 600;
  padding: 8px 15px;
  border-radius: var(--r-btn);
  transition: background 0.2s, color 0.2s;
}

.desktop-nav a:hover {
  background: var(--accent-bg);
  color: var(--accent);
}

.desktop-nav a.router-link-exact-active {
  background: var(--accent);
  color: var(--accent-contrast);
}

/* ---- Mobile nav ---- */
.mobile-nav {
  display: none;
  align-items: center;
  gap: 8px;
}

.m-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 18px;
  border-radius: var(--r-btn);
  background: var(--accent);
  color: var(--accent-contrast);
  font-family: var(--display);
  font-size: 16px;
  font-weight: 700;
  text-decoration: none;
}

.m-toggle {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid var(--border);
  border-radius: var(--r-btn);
  background: var(--card-bg);
  cursor: pointer;
}

.m-bar,
.m-bar::before,
.m-bar::after {
  content: '';
  display: block;
  width: 18px;
  height: 2px;
  border-radius: 2px;
  background: var(--text-h);
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.m-bar {
  position: relative;
}

.m-bar::before {
  position: absolute;
  top: -6px;
  left: 0;
}

.m-bar::after {
  position: absolute;
  top: 6px;
  left: 0;
}

.m-bar.open {
  background: transparent;
}

.m-bar.open::before {
  transform: translateY(6px) rotate(45deg);
}

.m-bar.open::after {
  transform: translateY(-6px) rotate(-45deg);
}

.mobile-menu {
  position: sticky;
  top: 68px;
  z-index: 19;
  display: none;
  flex-direction: column;
  padding: 8px 16px 12px;
  border-bottom: 1.5px solid var(--border);
  background: color-mix(in srgb, var(--bg) 92%, transparent);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.mobile-menu a {
  display: flex;
  align-items: center;
  min-height: 46px;
  padding: 0 8px;
  color: var(--text-h);
  text-decoration: none;
  font-family: var(--display);
  font-size: 16px;
  font-weight: 600;
  border-radius: var(--r-btn);
}

.mobile-menu a:hover,
.mobile-menu a.router-link-exact-active {
  background: var(--accent-bg);
  color: var(--accent);
}

.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.site-main {
  flex: 1;
  width: 100%;
  max-width: 900px;
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

@media (max-width: 560px) {
  .site-header {
    padding: 12px 16px;
  }

  .brand {
    font-size: 18px;
  }

  .desktop-nav {
    display: none;
  }

  .mobile-nav {
    display: flex;
  }

  .mobile-menu {
    display: flex;
  }

  .site-main {
    padding: 28px 18px 56px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .m-bar,
  .m-bar::before,
  .m-bar::after,
  .menu-enter-active,
  .menu-leave-active {
    transition: none;
  }
}
</style>
