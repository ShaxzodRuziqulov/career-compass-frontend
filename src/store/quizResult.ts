import { ref } from 'vue'
import type { QuizResultResponse } from '../types/api'

export const lastQuizResult = ref<QuizResultResponse | null>(null)
