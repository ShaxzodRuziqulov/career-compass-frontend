<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { getCareers } from '../api/careers'
import { traitThemes } from '../theme/traits'
import CompassIcon from '../components/CompassIcon.vue'
import ContourBg from '../components/ContourBg.vue'
import TraitIcon from '../components/TraitIcon.vue'

const year = new Date().getFullYear()

// Public number we can actually show anonymously (stats API is admin-only).
const careersCount = ref<number | null>(null)

const steps = [
  {
    n: '01',
    title: 'Savollarga javob ber',
    text: "24 ta qisqa savol, har biriga 5 soniya. Umumiy 3-4 daqiqa.",
  },
  {
    n: '02',
    title: 'Profilingni ol',
    text: "Javoblaring 6 ta yo'nalish (RIASEC) bo'yicha tahlil qilinadi.",
  },
  {
    n: '03',
    title: "Kasblarni ko'r",
    text: "Senga eng mos 5 ta kasb va ularga yetish yo'li ochiladi.",
  },
]

const traitDescriptions: Record<string, string> = {
  R: "Asboblar, texnika va aniq, amaliy ish bilan shug'ullanishni yoqtirasan.",
  I: "Muammolarni tahlil qilib, sabab-natijasini izlashdan zavq olasan.",
  A: "G'oya, dizayn va o'zingni erkin ifodalashga intilasan.",
  S: "Odamlarga yordam berish va o'rgatish senga yaqin.",
  E: "Boshqarish, ishontirish va tashabbus ko'rsatishni yoqtirasan.",
  C: "Tartib, aniqlik va ma'lumot bilan ishlash sening uslubing.",
}

const previewTraits = [
  { code: 'I', percent: 88 },
  { code: 'A', percent: 74 },
  { code: 'S', percent: 61 },
]

/* ---- Motion ---- */
const heroRef = ref<HTMLElement | null>(null)
const compassRef = ref<HTMLElement | null>(null)
const routeRef = ref<HTMLElement | null>(null)
const previewRef = ref<HTMLElement | null>(null)

const needleRotation = ref(0)
const routeInView = ref(false)
const barsInView = ref(false)

let rafId = 0
let current = -100 // starts off-north so the needle settles in on load
let target = 0
let returning = false
let idle = false
let reduce = false
const observers: IntersectionObserver[] = []

// Rotate along the shortest arc so the needle never spins the long way round.
function shortestDelta(from: number, to: number): number {
  return ((to - from + 540) % 360) - 180
}

function frame(now: number) {
  if (idle) {
    // slow "searching" sway, ±8° over ~6s
    current = 8 * Math.sin((now / 6000) * Math.PI * 2)
  } else {
    const lerp = returning ? 0.035 : 0.09
    current += shortestDelta(current, target) * lerp
  }
  needleRotation.value = Math.round(current * 100) / 100
  rafId = requestAnimationFrame(frame)
}

function startLoop() {
  if (rafId || reduce) return
  rafId = requestAnimationFrame(frame)
}

function stopLoop() {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = 0
  }
}

function onPointerMove(e: PointerEvent) {
  if (idle || !compassRef.value) return
  const r = compassRef.value.getBoundingClientRect()
  const dx = e.clientX - (r.left + r.width / 2)
  const dy = e.clientY - (r.top + r.height / 2)
  target = Math.atan2(dx, -dy) * (180 / Math.PI)
  returning = false
}

function onPointerLeave() {
  target = 0
  returning = true
}

function observeOnce(el: HTMLElement, flag: { value: boolean }, threshold: number) {
  const o = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      flag.value = true
      o.disconnect()
    }
  }, { threshold })
  o.observe(el)
  observers.push(o)
}

onMounted(async () => {
  reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  idle = !window.matchMedia('(hover: hover) and (pointer: fine)').matches

  if (reduce) {
    needleRotation.value = 0
    routeInView.value = true
    barsInView.value = true
  } else {
    if (heroRef.value) {
      const heroObs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) startLoop()
        else stopLoop()
      }, { threshold: 0 })
      heroObs.observe(heroRef.value)
      observers.push(heroObs)

      if (!idle) {
        heroRef.value.addEventListener('pointermove', onPointerMove, { passive: true })
        heroRef.value.addEventListener('pointerleave', onPointerLeave, { passive: true })
      }
    }
    startLoop()

    if (routeRef.value) observeOnce(routeRef.value, routeInView, 0.25)
    if (previewRef.value) observeOnce(previewRef.value, barsInView, 0.3)
  }

  try {
    const careers = await getCareers()
    careersCount.value = careers.length
  } catch {
    careersCount.value = null
  }
})

onBeforeUnmount(() => {
  stopLoop()
  observers.forEach((o) => o.disconnect())
  if (heroRef.value) {
    heroRef.value.removeEventListener('pointermove', onPointerMove)
    heroRef.value.removeEventListener('pointerleave', onPointerLeave)
  }
})
</script>

<template>
  <div class="landing">
    <!-- 1. HERO -->
    <section ref="heroRef" class="hero">
      <ContourBg variant="accent" />
      <div class="hero-inner fade-in-up">
        <div ref="compassRef" class="hero-compass">
          <CompassIcon :rotation="needleRotation" />
        </div>
        <span class="eyebrow">RIASEC · Holland Code testi</span>
        <h1>15 daqiqada senga mos <span class="hl">kasbni</span> top</h1>
        <p class="hero-sub">
          Qiziqishlaringni aniqlaydigan qisqa test. Ro'yxatdan o'tish shart emas —
          hoziroq boshlab, natijangni ko'rasan.
        </p>
        <RouterLink to="/quiz" class="btn hero-cta">Testni boshlash →</RouterLink>
      </div>
    </section>

    <!-- 2. HOW IT WORKS -->
    <section class="block">
      <h2 class="block-title">Qanday ishlaydi</h2>
      <ol ref="routeRef" class="route">
        <span class="route-line" :class="{ drawn: routeInView }" aria-hidden="true"></span>
        <li
          v-for="(step, i) in steps"
          :key="step.n"
          class="route-step"
          :class="{ 'is-in': routeInView }"
          :style="{ transitionDelay: (routeInView ? i * 120 : 0) + 'ms' }"
        >
          <span class="route-node">{{ step.n }}</span>
          <div class="route-body">
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </div>
        </li>
      </ol>
    </section>

    <!-- 3. RIASEC EXPLAINED -->
    <section class="block">
      <h2 class="block-title">6 ta yo'nalish</h2>
      <p class="block-lead">Test qiziqishlaringni shu olti tipga ajratadi.</p>
      <div class="trait-grid">
        <div
          v-for="theme in Object.values(traitThemes)"
          :key="theme.code"
          class="card trait-card"
          tabindex="0"
          :style="{ '--tc': theme.from }"
        >
          <div
            class="trait-badge"
            :style="{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }"
          >
            <TraitIcon :code="theme.code" class="trait-badge-icon" />
          </div>
          <div class="trait-head">
            <span class="trait-code">{{ theme.code }}</span>
            <h3>{{ theme.label }}</h3>
          </div>
          <p>{{ traitDescriptions[theme.code] }}</p>
        </div>
      </div>
    </section>

    <!-- 4. RESULT PREVIEW -->
    <section class="block">
      <h2 class="block-title">Natijang shunday ko'rinadi</h2>
      <div ref="previewRef" class="preview card">
        <span class="preview-tag">Namuna</span>
        <span class="preview-eyebrow">Senga eng mos kasb</span>
        <h3 class="preview-career">Dasturchi</h3>
        <span class="preview-match">92% moslik</span>
        <div class="preview-bars">
          <div v-for="(t, i) in previewTraits" :key="t.code" class="preview-bar-row">
            <span class="preview-bar-label">{{ traitThemes[t.code].label }}</span>
            <div class="preview-track">
              <div
                class="preview-fill"
                :style="{
                  width: (barsInView ? t.percent : 0) + '%',
                  transitionDelay: (barsInView ? i * 120 : 0) + 'ms',
                  background: `linear-gradient(90deg, ${traitThemes[t.code].from}, ${traitThemes[t.code].to})`,
                }"
              ></div>
            </div>
            <span class="preview-bar-pct">{{ t.percent }}%</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. TRUST STRIP -->
    <section class="block">
      <div class="trust">
        <div class="trust-item">
          <span class="trust-num">{{ careersCount ?? '—' }}</span>
          <span class="trust-label">kasb bazada</span>
        </div>
        <div class="trust-divider" aria-hidden="true"></div>
        <div class="trust-item">
          <!-- TODO: real "testlar topshirilgan" soni public endpoint bo'lgach ulanadi -->
          <span class="trust-num">3-4 daq</span>
          <span class="trust-label">o'rtacha vaqt</span>
        </div>
        <div class="trust-divider" aria-hidden="true"></div>
        <div class="trust-item">
          <span class="trust-num">6</span>
          <span class="trust-label">qiziqish yo'nalishi</span>
        </div>
      </div>
    </section>

    <!-- 6. FINAL CTA -->
    <section class="final-cta">
      <ContourBg variant="accent" />
      <div class="final-inner">
        <h2>Kelajakdagi kasbing bir necha daqiqa narida.</h2>
        <RouterLink to="/quiz" class="btn">Testni boshlash →</RouterLink>
      </div>
    </section>

    <!-- 7. FOOTER -->
    <footer class="footer">
      <span class="footer-brand">
        <span class="footer-mark"><CompassIcon /></span>
        Kasb Kompas
      </span>
      <span class="footer-meta">
        © {{ year }} ·
        <RouterLink to="/stats" class="footer-link">Admin</RouterLink>
      </span>
    </footer>
  </div>
</template>

<style scoped>
.landing {
  display: flex;
  flex-direction: column;
  gap: 64px;
}

/* ---- Hero ---- */
.hero {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  border: 1.5px solid var(--border);
  background: var(--card-bg);
  box-shadow: var(--shadow-lg);
  padding: 56px 28px 52px;
}

.hero-inner {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 620px;
  margin: 0 auto;
}

.hero-compass {
  width: 88px;
  height: 88px;
  margin: 0 auto 22px;
}

.eyebrow {
  display: inline-block;
  font-family: var(--display);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--accent);
  background: var(--accent-bg);
  padding: 5px 13px;
  border-radius: var(--r-chip);
  margin-bottom: 18px;
}

.hero h1 {
  font-size: clamp(32px, 8vw, 60px);
  margin-bottom: 16px;
}

.hl {
  color: var(--accent);
}

.hero-sub {
  font-size: 17px;
  color: var(--text);
  max-width: 460px;
  margin: 0 auto 28px;
}

.hero-cta {
  font-size: 16px;
  padding: 15px 30px;
}

/* ---- Section shell ---- */
.block-title {
  font-size: 26px;
  margin-bottom: 6px;
}

.block-lead {
  color: var(--text);
  font-size: 15px;
  margin-bottom: 24px;
}

/* ---- How it works: dashed route (draws in on scroll) ---- */
.route {
  position: relative;
  list-style: none;
  margin: 20px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.route-line {
  position: absolute;
  left: 21px;
  top: 22px;
  bottom: 22px;
  width: 0;
  border-left: 2px dashed var(--accent-border);
  transform-origin: top center;
  transform: scaleY(0);
  transition: transform 0.9s ease;
}

.route-line.drawn {
  transform: scaleY(1);
}

.route-step {
  position: relative;
  display: flex;
  gap: 18px;
  padding-bottom: 22px;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.route-step.is-in {
  opacity: 1;
  transform: translateY(0);
}

.route-node {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--display);
  font-weight: 700;
  font-size: 15px;
  color: var(--accent);
  background: var(--card-bg);
  border: 2px solid var(--accent);
}

.route-body {
  padding-top: 3px;
}

.route-body h3 {
  font-size: 18px;
  margin-bottom: 4px;
}

.route-body p {
  color: var(--text);
  font-size: 15px;
  margin: 0;
}

/* ---- RIASEC grid ---- */
.trait-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.trait-card {
  padding: 20px;
  outline: none;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.trait-card:hover,
.trait-card:focus-visible,
.trait-card:active {
  border-color: var(--tc);
  box-shadow: 0 0 0 1.5px var(--tc), 0 12px 26px -12px var(--tc);
  transform: translateY(-4px);
}

.trait-badge {
  width: 46px;
  height: 46px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}

.trait-badge-icon {
  width: 26px;
  height: 26px;
}

.trait-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 6px;
}

.trait-code {
  font-family: var(--display);
  font-weight: 700;
  font-size: 13px;
  color: var(--accent);
}

.trait-head h3 {
  font-size: 17px;
  margin: 0;
}

.trait-card p {
  color: var(--text);
  font-size: 14px;
  margin: 0;
}

/* ---- Result preview mock ---- */
.preview {
  position: relative;
  max-width: 460px;
  padding: 28px;
  text-align: center;
}

.preview-tag {
  position: absolute;
  top: 14px;
  right: 14px;
  font-family: var(--display);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text);
  background: var(--bg);
  border: 1.5px solid var(--border);
  padding: 3px 10px;
  border-radius: var(--r-chip);
}

.preview-eyebrow {
  display: block;
  font-size: 13px;
  color: var(--text);
  margin-bottom: 4px;
}

.preview-career {
  font-size: 28px;
  margin-bottom: 8px;
}

.preview-match {
  display: inline-block;
  font-family: var(--display);
  font-weight: 700;
  font-size: 14px;
  color: var(--accent);
  background: var(--accent-bg);
  padding: 5px 14px;
  border-radius: var(--r-chip);
  margin-bottom: 22px;
}

.preview-bars {
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
}

.preview-bar-row {
  display: grid;
  grid-template-columns: 92px 1fr 42px;
  align-items: center;
  gap: 10px;
}

.preview-bar-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-h);
}

.preview-track {
  height: 9px;
  border-radius: 5px;
  background: var(--border);
  overflow: hidden;
}

.preview-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.6s ease;
}

.preview-bar-pct {
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  text-align: right;
}

/* ---- Trust strip ---- */
.trust {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 24px;
  border: 1.5px dashed var(--accent-border);
  border-radius: var(--r-card);
  background: var(--accent-bg);
}

.trust-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 18px;
}

.trust-num {
  font-family: var(--display);
  font-weight: 700;
  font-size: 30px;
  color: var(--text-h);
  line-height: 1;
}

.trust-label {
  font-size: 13px;
  color: var(--text);
  margin-top: 5px;
}

.trust-divider {
  width: 1.5px;
  height: 40px;
  background: var(--accent-border);
}

/* ---- Final CTA ---- */
.final-cta {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  background: var(--text-h);
  padding: 48px 28px;
}

.final-inner {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 520px;
  margin: 0 auto;
}

.final-cta h2 {
  color: var(--bg);
  font-size: 26px;
  margin-bottom: 24px;
}

/* ---- Footer ---- */
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding-top: 8px;
  border-top: 1.5px solid var(--border);
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 9px;
  font-family: var(--display);
  font-weight: 700;
  color: var(--text-h);
}

.footer-mark {
  width: 22px;
  height: 22px;
}

.footer-meta {
  font-size: 14px;
  color: var(--text);
}

.footer-link {
  color: var(--text);
  text-decoration: none;
  font-weight: 600;
}

.footer-link:hover {
  color: var(--accent);
}

/* 3 columns from tablet up */
@media (min-width: 481px) {
  .trait-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 560px) {
  .landing {
    gap: 52px;
  }

  .hero {
    padding: 44px 20px 40px;
  }

  .hero-compass {
    width: 72px;
    height: 72px;
  }

  .trust-divider {
    display: none;
  }
}

/* Reduced motion: no hover lift, everything at rest / final state */
@media (prefers-reduced-motion: reduce) {
  .route-line,
  .route-step,
  .preview-fill,
  .trait-card {
    transition: none;
  }

  .trait-card:hover,
  .trait-card:focus-visible,
  .trait-card:active {
    transform: none;
  }
}
</style>
