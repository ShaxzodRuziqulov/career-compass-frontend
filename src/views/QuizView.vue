<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getQuestions, submitQuiz } from '../api/quiz'
import { ApiError } from '../api/http'
import { getSessionId } from '../store/session'
import { lastQuizResult } from '../store/quizResult'
import { getTraitTheme } from '../theme/traits'
import TraitIcon from '../components/TraitIcon.vue'
import type { Question } from '../types/api'

const router = useRouter()

const questions = ref<Question[]>([])
const answers = reactive<Record<number, number>>({})
const currentIndex = ref(0)
const loading = ref(true)
const submitting = ref(false)
const errorMessage = ref('')
const advancing = ref(false)

const scaleOptions = [
  { value: 1, emoji: '😣', label: 'Hech qachon bunday qilmayman' },
  { value: 2, emoji: '🙁', label: 'Kamdan-kam qilaman' },
  { value: 3, emoji: '😐', label: 'Ba\'zan qilaman' },
  { value: 4, emoji: '🙂', label: 'Ko\'pincha shunday qilaman' },
  { value: 5, emoji: '😄', label: 'Doim shunday qilaman' },
]

const currentQuestion = computed<Question | null>(() => questions.value[currentIndex.value] ?? null)
const theme = computed(() => getTraitTheme(currentQuestion.value?.traitCode ?? ''))
const answeredCount = computed(() => Object.keys(answers).length)
const progressPercent = computed(() =>
  questions.value.length === 0 ? 0 : (currentIndex.value / questions.value.length) * 100,
)
const isLastQuestion = computed(() => currentIndex.value === questions.value.length - 1)

onMounted(async () => {
  try {
    questions.value = await getQuestions()
  } catch (err) {
    errorMessage.value = err instanceof ApiError ? err.message : 'Savollarni yuklab bo\'lmadi'
  } finally {
    loading.value = false
  }
})

function goBack() {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1
  }
}

function selectAnswer(value: number) {
  const question = currentQuestion.value
  if (!question || advancing.value || submitting.value) return

  answers[question.id] = value
  advancing.value = true

  window.setTimeout(() => {
    advancing.value = false
    if (isLastQuestion.value) {
      handleSubmit()
    } else {
      currentIndex.value += 1
    }
  }, 380)
}

async function handleSubmit() {
  submitting.value = true
  errorMessage.value = ''

  try {
    const result = await submitQuiz({
      sessionId: getSessionId(),
      answers: Object.entries(answers).map(([questionId, value]) => ({
        questionId: Number(questionId),
        value,
      })),
    })
    lastQuizResult.value = result
    router.push({ name: 'result' })
  } catch (err) {
    errorMessage.value = err instanceof ApiError ? err.message : 'Natijani yuborishda xatolik yuz berdi'
    submitting.value = false
  }
}
</script>

<template>
  <div class="quiz-page">
    <div v-if="loading" class="state-message">Savollar yuklanmoqda...</div>
    <div v-else-if="errorMessage && questions.length === 0" class="state-message error">{{ errorMessage }}</div>

    <div v-else-if="submitting" class="state-message submitting">
      <div class="spinner"></div>
      Natijangiz tayyorlanmoqda...
    </div>

    <div v-else-if="currentQuestion" class="quiz-content">
      <div class="top-bar">
        <button type="button" class="icon-btn" :disabled="currentIndex === 0" @click="goBack" aria-label="Orqaga">
          ←
        </button>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progressPercent + '%', background: theme.to }"></div>
        </div>
        <span class="counter">{{ answeredCount }}/{{ questions.length }}</span>
      </div>

      <div v-if="errorMessage" class="error-box">{{ errorMessage }}</div>

      <div
        class="question-card"
        :style="{
          borderColor: theme.from,
          boxShadow: `5px 5px 0 ${theme.from}2e`,
        }"
      >
        <Transition name="slide" mode="out-in">
          <div :key="currentQuestion.id" class="question-inner">
            <div
              class="question-icon-badge"
              :style="{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }"
            >
              <TraitIcon :code="currentQuestion.traitCode" class="question-icon" />
            </div>
            <p class="question-text">{{ currentQuestion.textUz }}</p>

            <div class="options">
              <button
                v-for="option in scaleOptions"
                :key="option.value"
                type="button"
                class="option-btn"
                :class="{ selected: answers[currentQuestion.id] === option.value }"
                :style="
                  answers[currentQuestion.id] === option.value
                    ? { background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`, borderColor: theme.from }
                    : {}
                "
                :disabled="advancing"
                @click="selectAnswer(option.value)"
              >
                <span class="option-emoji">{{ option.emoji }}</span>
                <span class="option-label">{{ option.label }}</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quiz-page {
  display: flex;
  flex-direction: column;
  min-height: 70vh;
}

.state-message {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--text);
  font-size: 18px;
  text-align: center;
  padding: 24px;
}

.spinner {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.quiz-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 560px;
  width: 100%;
  margin: 0 auto;
}

.top-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--r-input);
  border: 1.5px solid var(--border);
  background: var(--card-bg);
  color: var(--text-h);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: opacity 0.2s, border-color 0.2s;
}

.icon-btn:hover:not(:disabled) {
  border-color: var(--accent-border);
  color: var(--accent);
}

.icon-btn:disabled {
  opacity: 0.35;
  cursor: default;
}

.progress-track {
  flex: 1;
  height: 8px;
  border-radius: var(--r-chip);
  background: var(--border);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: var(--r-chip);
  transition: width 0.4s ease, background-color 0.5s ease;
}

.counter {
  color: var(--text);
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
  min-width: 44px;
  text-align: right;
}

.question-card {
  position: relative;
  background: var(--card-bg);
  border: 2px solid var(--border);
  border-radius: 20px;
  padding: 36px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  overflow: hidden;
  transition: border-color 0.5s ease, box-shadow 0.5s ease;
}

.question-inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.question-icon-badge {
  width: 62px;
  height: 62px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.question-icon {
  width: 34px;
  height: 34px;
}

.question-text {
  font-family: var(--display);
  color: var(--text-h);
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 132%;
  margin: 0 0 28px;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 14px 18px;
  border-radius: var(--r-btn);
  border: 1.5px solid var(--border);
  background: var(--card-bg);
  color: var(--text-h);
  font: inherit;
  font-size: 15px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, transform 0.15s;
}

.option-btn:hover:not(:disabled) {
  background: var(--accent-bg);
  border-color: var(--accent-border);
}

.option-btn.selected {
  color: #fff;
  border-color: transparent;
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0 rgba(var(--shadow-color), 0.16);
}

.option-btn:disabled {
  cursor: default;
}

.option-emoji {
  font-size: 22px;
  line-height: 1;
}

/* question slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(24px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

@media (max-width: 600px) {
  .question-card {
    padding: 28px 20px;
    border-radius: 20px;
  }

  .question-text {
    font-size: 19px;
  }
}
</style>
