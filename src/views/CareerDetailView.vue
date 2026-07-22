<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getCareerDetail } from '../api/careers'
import { ApiError } from '../api/http'
import type { CareerDetail } from '../types/api'

const props = defineProps<{ id: string }>()

const route = useRoute()
const cameFromResult = computed(() => route.query.from === 'result')

const career = ref<CareerDetail | null>(null)
const roadmap = computed(() => career.value?.roadmap ?? null)
const loading = ref(true)
const errorMessage = ref('')

const roadmapSections = [
  { key: 'universitiesUz' as const, emoji: '🎓', title: 'Universitetlar' },
  { key: 'dtmSubjectsUz' as const, emoji: '📚', title: 'DTM fanlari' },
  { key: 'skillsUz' as const, emoji: '🛠️', title: "Kerakli ko'nikmalar" },
  { key: 'notesUz' as const, emoji: '💡', title: "Qo'shimcha izoh" },
]

async function loadCareer(id: string) {
  loading.value = true
  errorMessage.value = ''
  try {
    career.value = await getCareerDetail(Number(id))
  } catch (err) {
    errorMessage.value = err instanceof ApiError ? err.message : 'Kasb ma\'lumotini yuklab bo\'lmadi'
  } finally {
    loading.value = false
  }
}

watch(() => props.id, loadCareer, { immediate: true })
</script>

<template>
  <section>
    <RouterLink v-if="cameFromResult" to="/result" class="back-link">&larr; Natijalarimga qaytish</RouterLink>
    <RouterLink v-else to="/careers" class="back-link">&larr; Kasblar ro'yxatiga qaytish</RouterLink>

    <div v-if="loading" class="loading">Yuklanmoqda...</div>
    <div v-else-if="errorMessage" class="error-box">{{ errorMessage }}</div>

    <div v-else-if="career" class="fade-in-up">
      <div class="hero-banner">
        <h1>{{ career.nameUz }}</h1>
        <p class="description">{{ career.description }}</p>
      </div>

      <div v-if="roadmap" class="roadmap">
        <div
          v-for="section in roadmapSections"
          :key="section.key"
          v-show="roadmap[section.key]"
          class="card roadmap-item"
        >
          <span class="roadmap-emoji">{{ section.emoji }}</span>
          <div>
            <h2>{{ section.title }}</h2>
            <p>{{ roadmap[section.key] }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.back-link {
  display: inline-block;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.hero-banner {
  background: var(--accent-gradient);
  border-radius: 24px;
  padding: 32px 28px;
  color: #fff;
  margin-bottom: 24px;
  box-shadow: var(--shadow-lg);
}

.hero-banner h1 {
  color: #fff;
  margin-bottom: 10px;
}

.hero-banner .description {
  margin: 0;
  opacity: 0.95;
  font-size: 15px;
}

.roadmap {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.roadmap-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.roadmap-emoji {
  font-size: 26px;
  line-height: 1;
  flex-shrink: 0;
}

.roadmap-item h2 {
  font-size: 15px;
  margin-bottom: 4px;
}

.roadmap-item p {
  font-size: 14px;
  margin: 0;
}
</style>
