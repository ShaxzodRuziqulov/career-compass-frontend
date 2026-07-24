<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getCareers } from '../api/careers'
import { ApiError } from '../api/http'
import { traitThemes } from '../theme/traits'
import type { Career } from '../types/api'

const route = useRoute()

const careers = ref<Career[]>([])
const loading = ref(true)
const errorMessage = ref('')

const palette = Object.values(traitThemes)

const activeTraitCode = computed(() => {
  const trait = route.query.trait
  return typeof trait === 'string' ? trait.toUpperCase() : null
})

const activeTraitTheme = computed(() => (activeTraitCode.value ? traitThemes[activeTraitCode.value] : null))

function accentFor(index: number) {
  const theme = activeTraitTheme.value ?? palette[index % palette.length]
  return `linear-gradient(135deg, ${theme.from}, ${theme.to})`
}

async function loadCareers(traitCode: string | null) {
  loading.value = true
  errorMessage.value = ''
  try {
    careers.value = await getCareers(traitCode ?? undefined)
  } catch (err) {
    errorMessage.value = err instanceof ApiError ? err.message : 'Kasblar ro\'yxatini yuklab bo\'lmadi'
  } finally {
    loading.value = false
  }
}

watch(activeTraitCode, (code) => loadCareers(code), { immediate: true })
</script>

<template>
  <section>
    <h1>Kasblar</h1>

    <p v-if="!activeTraitTheme" class="subtitle">Barcha kasblar bilan tanish, har birining talablari haqida o'qi.</p>
    <div v-else class="filter-badge">
      <span>
        <strong>{{ activeTraitTheme.label }}</strong> traitiga eng mos kasblar
      </span>
      <RouterLink to="/careers" class="clear-link">Hammasini ko'rish ✕</RouterLink>
    </div>

    <div v-if="loading" class="loading">Yuklanmoqda...</div>
    <div v-else-if="errorMessage" class="error-box">{{ errorMessage }}</div>

    <div v-else class="career-grid">
      <RouterLink
        v-for="(career, i) in careers"
        :key="career.id"
        :to="`/careers/${career.id}`"
        class="card career-card fade-in-up"
        :style="{ animationDelay: (i % 8) * 0.05 + 's' }"
      >
        <div class="accent-bar" :style="{ background: accentFor(i) }"></div>
        <span v-if="career.matchScore !== null" class="match-badge">{{ career.matchScore }}%</span>
        <h2>{{ career.nameUz }}</h2>
        <p>{{ career.description }}</p>
        <span class="link-arrow">Batafsil →</span>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.subtitle {
  margin-bottom: 32px;
  font-size: 15px;
}

.filter-badge {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  background: var(--accent-bg);
  border: 1px solid var(--accent-border);
  border-radius: 100px;
  padding: 10px 18px;
  margin-bottom: 32px;
  font-size: 14px;
}

.clear-link {
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

.career-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.career-card {
  text-decoration: none;
  overflow: hidden;
  position: relative;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
}

.career-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.accent-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
}

.match-badge {
  position: absolute;
  top: 14px;
  right: 14px;
  background: var(--accent);
  color: var(--accent-contrast);
  font-family: var(--display);
  font-size: 12px;
  font-weight: 700;
  padding: 4px 11px;
  border-radius: var(--r-chip);
}

.career-card h2 {
  font-size: 18px;
}

.career-card p {
  font-size: 14px;
  color: var(--text);
  margin: 0 0 14px;
  flex: 1;
}

.link-arrow {
  font-size: 13px;
  font-weight: 700;
  color: var(--accent);
}
</style>
