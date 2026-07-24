<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { getQuestions } from '../api/quiz'
import { createQuestion, updateQuestion } from '../api/questions'
import { ApiError } from '../api/http'
import { clearAdminAuth, isAdminLoggedIn } from '../store/admin'
import { traitThemes } from '../theme/traits'
import AdminLoginCard from '../components/AdminLoginCard.vue'
import type { Question, QuestionRequest } from '../types/api'

const loggedIn = ref(isAdminLoggedIn())
const questions = ref<Question[]>([])
const loading = ref(false)
const errorMessage = ref('')

const traitCodes = Object.keys(traitThemes)

const editingId = ref<number | null>(null)
const formOpen = ref(false)
const form = ref<QuestionRequest>(emptyForm())
const saving = ref(false)
const formError = ref('')

const formTitle = computed(() =>
  editingId.value === null ? 'Yangi savol' : `Savolni tahrirlash (#${editingId.value})`,
)

function emptyForm(): QuestionRequest {
  return { traitCode: traitCodes[0] ?? 'R', textUz: '', weight: 1 }
}

function traitLabel(code: string): string {
  return traitThemes[code]?.label ?? code
}

function handleAuthError(err: unknown): boolean {
  if (err instanceof ApiError && err.status === 401) {
    loggedIn.value = false
    return true
  }
  return false
}

async function load() {
  loading.value = true
  errorMessage.value = ''
  try {
    questions.value = await getQuestions()
  } catch (err) {
    if (!handleAuthError(err)) {
      errorMessage.value = err instanceof ApiError ? err.message : "Savollarni yuklab bo'lmadi"
    }
  } finally {
    loading.value = false
  }
}

function startCreate() {
  editingId.value = null
  form.value = emptyForm()
  formError.value = ''
  formOpen.value = true
}

function startEdit(question: Question) {
  editingId.value = question.id
  form.value = {
    traitCode: question.traitCode,
    textUz: question.textUz,
    weight: question.weight,
  }
  formError.value = ''
  formOpen.value = true
}

function closeForm() {
  formOpen.value = false
  editingId.value = null
  formError.value = ''
}

async function save() {
  if (!form.value.textUz.trim()) {
    formError.value = 'Savol matnini kiriting'
    return
  }
  if (!form.value.weight || form.value.weight < 1) {
    formError.value = "Og'irlik kamida 1 bo'lishi kerak"
    return
  }
  saving.value = true
  formError.value = ''
  const payload: QuestionRequest = { ...form.value, textUz: form.value.textUz.trim() }
  try {
    if (editingId.value === null) {
      await createQuestion(payload)
    } else {
      await updateQuestion(editingId.value, payload)
    }
    closeForm()
    await load()
  } catch (err) {
    if (!handleAuthError(err)) {
      formError.value = err instanceof ApiError ? err.message : "Saqlab bo'lmadi"
    }
  } finally {
    saving.value = false
  }
}

function onLoginSuccess() {
  loggedIn.value = true
  load()
}

function logout() {
  clearAdminAuth()
  loggedIn.value = false
  questions.value = []
  closeForm()
}

onMounted(() => {
  if (loggedIn.value) {
    load()
  }
})
</script>

<template>
  <section class="admin-questions-page">
    <AdminLoginCard
      v-if="!loggedIn"
      note="Savollarni boshqarish uchun login va parolni kiriting."
      @success="onLoginSuccess"
    />

    <template v-else>
      <h1>Savollarni boshqarish</h1>
      <p class="subtitle">Test savollarini qo'shish va tahrirlash.</p>

      <div class="admin-bar">
        <RouterLink to="/stats" class="btn btn-outline admin-bar-btn">← Statistika</RouterLink>
        <button type="button" class="btn admin-bar-btn" @click="startCreate">+ Yangi savol</button>
        <button type="button" class="btn btn-outline admin-bar-btn" @click="logout">Chiqish</button>
      </div>

      <div v-if="formOpen" class="card form-card fade-in-up">
        <h2 class="form-title">{{ formTitle }}</h2>

        <label class="field">
          <span class="field-label">Yo'nalish (trait)</span>
          <select v-model="form.traitCode" :disabled="saving">
            <option v-for="code in traitCodes" :key="code" :value="code">
              {{ code }} — {{ traitLabel(code) }}
            </option>
          </select>
        </label>

        <label class="field">
          <span class="field-label">Savol matni</span>
          <textarea v-model="form.textUz" rows="3" :disabled="saving"></textarea>
        </label>

        <label class="field weight-field">
          <span class="field-label">Og'irlik (weight)</span>
          <input v-model.number="form.weight" type="number" min="1" :disabled="saving" />
        </label>

        <div v-if="formError" class="error-box">{{ formError }}</div>

        <div class="form-actions">
          <button type="button" class="btn" :disabled="saving" @click="save">
            {{ saving ? 'Saqlanmoqda...' : 'Saqlash' }}
          </button>
          <button type="button" class="btn btn-outline" :disabled="saving" @click="closeForm">
            Bekor qilish
          </button>
        </div>
      </div>

      <div v-if="loading" class="state-message">Yuklanmoqda...</div>
      <div v-else-if="errorMessage" class="error-box">{{ errorMessage }}</div>

      <div v-else class="card question-list fade-in-up">
        <div v-for="question in questions" :key="question.id" class="question-row">
          <span class="trait-chip">{{ question.traitCode }}</span>
          <div class="question-body">
            <p class="question-text">{{ question.textUz }}</p>
            <span class="question-meta">#{{ question.id }} · {{ traitLabel(question.traitCode) }} · og'irlik {{ question.weight }}</span>
          </div>
          <button type="button" class="btn btn-outline edit-btn" @click="startEdit(question)">
            Tahrirlash
          </button>
        </div>
        <p v-if="!questions.length" class="empty-note">Savollar topilmadi.</p>
      </div>
    </template>
  </section>
</template>

<style scoped>
.admin-questions-page {
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

.form-card {
  padding: 24px;
  margin-bottom: 24px;
}

.form-title {
  margin: 0 0 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-h);
}

.field select,
.field textarea,
.field input {
  padding: 11px 14px;
  border: 1.5px solid var(--border);
  border-radius: var(--r-input);
  background: var(--bg);
  color: var(--text-h);
  font-size: 15px;
  font-family: var(--sans);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.field select:focus,
.field textarea:focus,
.field input:focus {
  border-color: var(--accent-border);
  box-shadow: 0 0 0 3px var(--accent-bg);
}

.field textarea {
  resize: vertical;
}

.weight-field input {
  max-width: 140px;
}

.error-box {
  margin-bottom: 16px;
}

.form-actions {
  display: flex;
  gap: 10px;
}

.question-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 32px;
}

.question-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.trait-chip {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--display);
  font-size: 14px;
  font-weight: 700;
  color: var(--accent);
  background: var(--accent-bg);
  flex-shrink: 0;
}

.question-body {
  flex: 1;
  min-width: 0;
}

.question-text {
  margin: 0 0 2px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-h);
}

.question-meta {
  font-size: 12px;
  color: var(--text);
}

.edit-btn {
  font-size: 13px;
  padding: 7px 14px;
  flex-shrink: 0;
}

.empty-note {
  color: var(--text);
  font-size: 14px;
}
</style>
