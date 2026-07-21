<script setup lang="ts">
import CompassIcon from '../components/CompassIcon.vue'
import TraitIcon from '../components/TraitIcon.vue'
import { traitThemes } from '../theme/traits'

const steps = [
  { emoji: '📝', title: '24 ta savol', text: "Har biriga 5 soniyada javob berasan, umumiy 3-4 daqiqa vaqt ketadi." },
  { emoji: '📊', title: 'Profil chiqadi', text: "Qiziqishlaring 6 ta yo'nalish (RIASEC) bo'yicha tahlil qilinadi." },
  { emoji: '🎯', title: 'Kasb tavsiyasi', text: "Senga eng mos 5 ta kasb va ularga yetish yo'li ko'rsatiladi." },
]
</script>

<template>
  <section class="home">
    <div class="bg-blobs" aria-hidden="true">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <div class="hero fade-in-up">
      <div class="compass-wrap">
        <CompassIcon class="compass" />
      </div>
      <h1>Senga mos <span class="highlight">kasbni</span> top</h1>
      <p class="lead">
        RIASEC (Holland Code) modeliga asoslangan qisqa test orqali qiziqishlaringni aniqlab,
        senga eng mos keladigan kasblarni tavsiya qilamiz.
      </p>
      <div class="actions">
        <RouterLink to="/quiz" class="btn">Testni boshlash →</RouterLink>
        <RouterLink to="/careers" class="btn btn-outline">Kasblar ro'yxati</RouterLink>
      </div>
    </div>

    <div class="trait-row">
      <RouterLink
        v-for="theme in Object.values(traitThemes)"
        :key="theme.code"
        :to="`/careers?trait=${theme.code}`"
        class="trait-chip"
      >
        <div class="trait-chip-icon" :style="{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }">
          <TraitIcon :code="theme.code" class="mini-icon" />
        </div>
        <span>{{ theme.label }}</span>
      </RouterLink>
    </div>

    <div class="steps">
      <div v-for="(step, i) in steps" :key="step.title" class="card step-card fade-in-up" :style="{ animationDelay: i * 0.1 + 's' }">
        <span class="step-emoji">{{ step.emoji }}</span>
        <h2>{{ step.title }}</h2>
        <p>{{ step.text }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home {
  position: relative;
  padding: 24px 0 40px;
}

.bg-blobs {
  position: absolute;
  inset: -40px -24px auto -24px;
  height: 480px;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.32;
}

.blob-1 {
  width: 280px;
  height: 280px;
  background: #f472b6;
  top: -60px;
  left: -40px;
}

.blob-2 {
  width: 240px;
  height: 240px;
  background: #38bdf8;
  top: 20px;
  right: -60px;
}

.blob-3 {
  width: 220px;
  height: 220px;
  background: #34d399;
  bottom: -80px;
  left: 38%;
}

.hero {
  text-align: center;
  margin-bottom: 44px;
}

.compass-wrap {
  width: 88px;
  height: 88px;
  margin: 0 auto 24px;
}

h1 {
  font-size: 40px;
}

.highlight {
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.lead {
  max-width: 480px;
  margin: 0 auto 28px;
  font-size: 17px;
}

.actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.trait-row {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 48px;
}

.trait-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px 6px 6px;
  border-radius: 100px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-h);
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.trait-chip:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.trait-chip-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mini-icon {
  width: 16px;
  height: 16px;
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.step-card {
  text-align: center;
}

.step-emoji {
  font-size: 28px;
  display: block;
  margin-bottom: 10px;
}

.step-card h2 {
  font-size: 17px;
  margin-bottom: 6px;
}

.step-card p {
  font-size: 14px;
  margin: 0;
}

@media (max-width: 600px) {
  h1 {
    font-size: 30px;
  }
}
</style>
