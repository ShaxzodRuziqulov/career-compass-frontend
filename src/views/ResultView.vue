<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { lastQuizResult } from '../store/quizResult'
import { getTraitTheme, traitThemes } from '../theme/traits'
import TraitIcon from '../components/TraitIcon.vue'

const router = useRouter()

const traitEntries = computed(() => {
  const profile = lastQuizResult.value?.userTraitProfile ?? {}
  return Object.entries(profile).sort((a, b) => b[1] - a[1])
})

const topCareer = computed(() => lastQuizResult.value?.topCareers[0] ?? null)
const restCareers = computed(() => lastQuizResult.value?.topCareers.slice(1) ?? [])

const blobColors = computed(() => traitEntries.value.slice(0, 3).map(([code]) => getTraitTheme(code).from))

function traitLabel(code: string): string {
  return traitThemes[code]?.label ?? code
}

onMounted(() => {
  if (!lastQuizResult.value) {
    router.replace({ name: 'quiz' })
  }
})
</script>

<template>
  <section v-if="lastQuizResult && topCareer" class="result-page">
    <div class="bg-blobs" aria-hidden="true">
      <div class="blob blob-1" :style="{ background: blobColors[0] }"></div>
      <div class="blob blob-2" :style="{ background: blobColors[1] }"></div>
      <div class="blob blob-3" :style="{ background: blobColors[2] }"></div>
    </div>

    <div class="hero-banner fade-in-up">
      <span class="hero-eyebrow">Senga eng mos kasb</span>
      <h1>{{ topCareer.nameUz }}</h1>
      <span class="hero-match">{{ topCareer.matchPercent }}% moslik</span>
      <RouterLink :to="{ path: `/careers/${topCareer.careerId}`, query: { from: 'result' } }" class="btn hero-btn">Batafsil ko'rish →</RouterLink>
    </div>

    <h2 class="section-title">Qiziqishlar profili</h2>
    <div class="card profile fade-in-up">
      <div v-for="[code, percent] in traitEntries" :key="code" class="trait-row">
        <div
          class="trait-icon-badge"
          :style="{ background: `linear-gradient(135deg, ${getTraitTheme(code).from}, ${getTraitTheme(code).to})` }"
        >
          <TraitIcon :code="code" class="mini-icon" />
        </div>
        <div class="trait-body">
          <div class="trait-label-row">
            <span class="trait-name">{{ traitLabel(code) }}</span>
            <span class="trait-percent">{{ percent }}%</span>
          </div>
          <div class="bar-track">
            <div
              class="bar-fill"
              :style="{
                width: percent + '%',
                background: `linear-gradient(90deg, ${getTraitTheme(code).from}, ${getTraitTheme(code).to})`,
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <h2 class="section-title">Boshqa mos kasblar</h2>
    <div class="career-list">
      <RouterLink
        v-for="(career, i) in restCareers"
        :key="career.careerId"
        :to="{ path: `/careers/${career.careerId}`, query: { from: 'result' } }"
        class="card career-card fade-in-up"
        :style="{ animationDelay: i * 0.06 + 's' }"
      >
        <span class="rank">#{{ i + 2 }}</span>
        <span class="career-name">{{ career.nameUz }}</span>
        <span class="career-match">{{ career.matchPercent }}%</span>
      </RouterLink>
    </div>

    <RouterLink to="/quiz" class="btn btn-outline retake">Testni qayta topshirish</RouterLink>
  </section>
</template>

<style scoped>
.result-page {
  position: relative;
}

.bg-blobs {
  position: absolute;
  inset: -40px -24px;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.28;
}

.blob-1 {
  width: 300px;
  height: 300px;
  top: -60px;
  left: -60px;
}

.blob-2 {
  width: 260px;
  height: 260px;
  top: 320px;
  right: -80px;
}

.blob-3 {
  width: 240px;
  height: 240px;
  bottom: 120px;
  left: 20%;
}

.hero-banner {
  background: var(--accent-gradient);
  border-radius: 24px;
  padding: 40px 28px;
  text-align: center;
  color: #fff;
  margin-bottom: 36px;
  box-shadow: var(--shadow-lg);
}

.hero-eyebrow {
  display: inline-block;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  opacity: 0.85;
  margin-bottom: 8px;
}

.hero-banner h1 {
  color: #fff;
  font-size: 32px;
  margin-bottom: 10px;
}

.hero-match {
  display: inline-block;
  font-size: 15px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.22);
  padding: 6px 16px;
  border-radius: 100px;
  margin-bottom: 22px;
}

.hero-btn {
  background: #fff;
  color: var(--accent);
  box-shadow: none;
  display: block;
  width: fit-content;
  margin: 0 auto;
}

.section-title {
  margin-top: 8px;
}

.profile {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 36px;
}

.trait-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.trait-icon-badge {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mini-icon {
  width: 22px;
  height: 22px;
}

.trait-body {
  flex: 1;
}

.trait-label-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.trait-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-h);
}

.trait-percent {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
}

.bar-track {
  height: 10px;
  border-radius: 5px;
  background: var(--border);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.8s ease;
}

.career-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 36px;
}

.career-card {
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
}

.career-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
  border-color: var(--accent-border);
}

.rank {
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  background: var(--accent-bg);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.career-name {
  flex: 1;
  font-weight: 600;
  color: var(--text-h);
  font-size: 15px;
}

.career-match {
  color: var(--accent);
  font-weight: 700;
}

.retake {
  display: block;
  width: fit-content;
  margin: 0 auto;
}
</style>
