<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { getStats } from '../api/stats'
import { ApiError } from '../api/http'
import { clearAdminAuth, isAdminLoggedIn } from '../store/admin'
import { getTraitTheme, traitThemes } from '../theme/traits'
import AdminLoginCard from '../components/AdminLoginCard.vue'
import TraitIcon from '../components/TraitIcon.vue'
import type { StatsResponse } from '../types/api'

const loggedIn = ref(isAdminLoggedIn())
const stats = ref<StatsResponse | null>(null)
const loading = ref(false)
const errorMessage = ref('')

const traitEntries = computed(() => {
  const profile = stats.value?.averageTraitProfile ?? {}
  return Object.entries(profile).sort((a, b) => b[1] - a[1])
})

const maxDailyCount = computed(() =>
  Math.max(1, ...(stats.value?.dailySubmissions ?? []).map((d) => d.count)),
)

function traitLabel(code: string): string {
  return traitThemes[code]?.label ?? code
}

function barHeight(count: number): string {
  if (count === 0) {
    return '2px'
  }
  return Math.max(6, Math.round((count / maxDailyCount.value) * 110)) + 'px'
}

function dayLabel(date: string): string {
  return String(Number(date.slice(8, 10)))
}

function dayTooltip(day: { date: string; count: number }): string {
  const d = new Date(day.date)
  return `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')} — ${day.count} ta test`
}

async function loadStats() {
  loading.value = true
  errorMessage.value = ''
  try {
    stats.value = await getStats()
  } catch (err) {
    // 401 bo'lsa interceptor saqlangan parolni tozalaydi — login formasiga qaytamiz
    if (err instanceof ApiError && err.status === 401) {
      loggedIn.value = false
    } else {
      errorMessage.value = err instanceof ApiError ? err.message : 'Statistikani yuklab bo\'lmadi'
    }
  } finally {
    loading.value = false
  }
}

function onLoginSuccess() {
  loggedIn.value = true
  loadStats()
}

function logout() {
  clearAdminAuth()
  loggedIn.value = false
  stats.value = null
}

onMounted(() => {
  if (loggedIn.value) {
    loadStats()
  }
})
</script>

<template>
  <section class="stats-page">
    <AdminLoginCard
      v-if="!loggedIn"
      note="Statistikani ko'rish uchun login va parolni kiriting."
      @success="onLoginSuccess"
    />

    <template v-else>
    <h1>Statistika</h1>
    <p class="subtitle">Testni kimlar qanday topshirgani haqida umumiy ko'rsatkichlar.</p>

    <div v-if="loading" class="state-message">Yuklanmoqda...</div>
    <div v-else-if="errorMessage" class="error-box">{{ errorMessage }}</div>

    <template v-else-if="stats">
      <div class="admin-bar">
        <RouterLink to="/admin/questions" class="btn btn-outline admin-bar-btn">Savollarni boshqarish</RouterLink>
        <button type="button" class="btn btn-outline admin-bar-btn" @click="logout">Chiqish</button>
      </div>

      <div class="tiles">
        <div class="card total-card fade-in-up">
          <span class="total-number">{{ stats.totalSubmissions }}</span>
          <span class="total-label">marta test topshirilgan</span>
        </div>
        <div class="card total-card fade-in-up">
          <span class="total-number">{{ stats.uniqueSessions }}</span>
          <span class="total-label">foydalanuvchi qatnashgan</span>
        </div>
      </div>

      <template v-if="stats.dailySubmissions?.length">
      <h2 class="section-title">Kunlik faollik — so'nggi 14 kun</h2>
      <div class="card chart-card fade-in-up">
        <div class="chart">
          <div
            v-for="day in stats.dailySubmissions"
            :key="day.date"
            class="chart-col"
            :data-tip="dayTooltip(day)"
          >
            <span v-if="day.count === maxDailyCount && day.count > 0" class="bar-peak">{{ day.count }}</span>
            <div
              class="chart-bar"
              :class="{ 'chart-bar-empty': day.count === 0 }"
              :style="{ height: barHeight(day.count) }"
            ></div>
            <span class="chart-day">{{ dayLabel(day.date) }}</span>
          </div>
        </div>
      </div>
      </template>

      <h2 class="section-title">Eng ko'p tavsiya etilgan kasblar</h2>
      <div v-if="stats.topCareers.length" class="card career-list fade-in-up">
        <div v-for="(career, i) in stats.topCareers" :key="career.careerId" class="career-row">
          <span class="rank">#{{ i + 1 }}</span>
          <span class="career-name">{{ career.nameUz }}</span>
          <span class="career-count">{{ career.count }} marta</span>
        </div>
      </div>
      <p v-else class="empty-note">Hali yetarli ma'lumot yo'q.</p>

      <h2 class="section-title">O'rtacha qiziqish profili</h2>
      <div v-if="traitEntries.length" class="card profile fade-in-up">
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
      <p v-else class="empty-note">Hali yetarli ma'lumot yo'q.</p>
    </template>
    </template>
  </section>
</template>

<style scoped>
.stats-page {
  display: flex;
  flex-direction: column;
}

.subtitle {
  margin-bottom: 28px;
  font-size: 15px;
}

.admin-bar {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 20px;
}

.admin-bar-btn {
  font-size: 13px;
  padding: 8px 16px;
}

.state-message {
  padding: 40px 0;
  text-align: center;
  color: var(--text);
}

.tiles {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
}

.total-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  text-align: center;
}

.chart-card {
  padding: 24px 20px 16px;
  margin-bottom: 32px;
}

.chart {
  display: flex;
  align-items: flex-end;
  gap: 4px;
}

.chart-col {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  min-width: 0;
}

.chart-bar {
  width: 100%;
  max-width: 26px;
  border-radius: 4px 4px 0 0;
  background: var(--accent-gradient);
  transition: height 0.6s ease, opacity 0.2s;
}

.chart-bar-empty {
  background: var(--border);
  border-radius: 2px;
}

.chart-col:hover .chart-bar {
  opacity: 0.75;
}

.chart-col::after {
  content: attr(data-tip);
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  padding: 5px 10px;
  border-radius: 8px;
  background: var(--text-h);
  color: var(--bg);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
  z-index: 5;
}

.chart-col:hover::after {
  opacity: 1;
}

.bar-peak {
  font-size: 12px;
  font-weight: 700;
  color: var(--accent);
}

.chart-day {
  font-size: 10px;
  color: var(--text);
}

.total-number {
  font-size: 44px;
  font-weight: 800;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.total-label {
  font-size: 14px;
  color: var(--text);
  margin-top: 4px;
}

.section-title {
  margin-top: 8px;
}

.empty-note {
  color: var(--text);
  font-size: 14px;
  margin-bottom: 32px;
}

.career-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 32px;
}

.career-row {
  display: flex;
  align-items: center;
  gap: 14px;
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

.career-count {
  color: var(--accent);
  font-weight: 700;
  font-size: 13px;
}

.profile {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 32px;
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
</style>
