<script setup lang="ts">
import { ref } from 'vue'
import { getStats } from '../api/stats'
import { ApiError } from '../api/http'
import { clearAdminAuth, setAdminAuth } from '../store/admin'

const props = withDefaults(defineProps<{ title?: string; note?: string }>(), {
  title: 'Admin kirish',
  note: 'Boshqaruv paneliga kirish uchun login va parolni kiriting.',
})

const emit = defineEmits<{ success: [] }>()

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const submitting = ref(false)
const errorMessage = ref('')

async function submit() {
  if (!username.value.trim() || !password.value) {
    errorMessage.value = 'Login va parolni kiriting'
    return
  }
  submitting.value = true
  errorMessage.value = ''
  setAdminAuth(username.value.trim(), password.value)
  try {
    // Kiritilgan login/parolni himoyalangan endpoint orqali tekshiramiz
    await getStats()
    emit('success')
  } catch (err) {
    clearAdminAuth()
    errorMessage.value =
      err instanceof ApiError && err.status === 401
        ? "Login yoki parol noto'g'ri"
        : "Server bilan bog'lanishda xatolik yuz berdi"
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="login-wrap">
    <div class="card login-card fade-in-up">
      <div class="login-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>

      <h2 class="login-title">{{ props.title }}</h2>
      <p class="login-note">{{ props.note }}</p>

      <form @submit.prevent="submit">
        <label class="field">
          <span class="field-label">Login</span>
          <input
            v-model="username"
            type="text"
            autocomplete="username"
            placeholder="admin"
            :disabled="submitting"
          />
        </label>

        <label class="field">
          <span class="field-label">Parol</span>
          <div class="password-box">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="••••••••"
              :disabled="submitting"
            />
            <button
              type="button"
              class="toggle-pass"
              :aria-label="showPassword ? 'Parolni yashirish' : 'Parolni ko\'rsatish'"
              @click="showPassword = !showPassword"
            >
              <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c6.5 0 10 7 10 7a13.2 13.2 0 0 1-1.67 2.5M6.6 6.6C3.6 8.3 2 11 2 11s3.5 7 10 7a9 9 0 0 0 4.4-1.1" />
                <path d="m2 2 20 20" />
              </svg>
            </button>
          </div>
        </label>

        <div v-if="errorMessage" class="error-box">{{ errorMessage }}</div>

        <button type="submit" class="btn submit-btn" :disabled="submitting">
          {{ submitting ? 'Tekshirilmoqda...' : 'Kirish' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 16px 0;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 36px 32px 32px;
  text-align: center;
  box-shadow: var(--shadow-lg);
}

.login-badge {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent);
  box-shadow: var(--shadow);
}

.login-badge svg {
  width: 28px;
  height: 28px;
  color: var(--accent-contrast);
}

.login-title {
  margin: 0 0 6px;
  font-size: 24px;
}

.login-note {
  font-size: 14px;
  line-height: 1.4;
  margin: 0 auto 26px;
  max-width: 300px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 18px;
  text-align: left;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-h);
}

.field input {
  width: 100%;
  padding: 12px 15px;
  border: 1.5px solid var(--border);
  border-radius: var(--r-input);
  background: var(--bg);
  color: var(--text-h);
  font-size: 15px;
  font-family: var(--sans);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.field input::placeholder {
  color: var(--text);
  opacity: 0.55;
}

.field input:focus {
  border-color: var(--accent-border);
  box-shadow: 0 0 0 3px var(--accent-bg);
}

.password-box {
  position: relative;
}

.password-box input {
  padding-right: 46px;
}

.toggle-pass {
  position: absolute;
  top: 50%;
  right: 6px;
  transform: translateY(-50%);
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text);
  border-radius: 8px;
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
}

.toggle-pass:hover {
  color: var(--accent);
  background: var(--accent-bg);
}

.toggle-pass svg {
  width: 18px;
  height: 18px;
}

.error-box {
  margin-bottom: 18px;
  text-align: left;
}

.submit-btn {
  width: 100%;
  margin-top: 4px;
}
</style>
