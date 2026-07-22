import { ref, watch } from 'vue'
import type { QuizResultResponse } from '../types/api'

const STORAGE_KEY = 'kasbkompas_last_result'

function loadStoredResult(): QuizResultResponse | null {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as QuizResultResponse
  } catch {
    return null
  }
}

export const lastQuizResult = ref<QuizResultResponse | null>(loadStoredResult())

watch(lastQuizResult, (value) => {
  if (value) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } else {
    sessionStorage.removeItem(STORAGE_KEY)
  }
})
