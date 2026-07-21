import { http } from './http'
import type { Question, QuizResultResponse, SubmitAnswerRequest } from '../types/api'

export function getQuestions() {
  return http.get<Question[]>('/api/questions').then((res) => res.data)
}

export function submitQuiz(payload: SubmitAnswerRequest) {
  return http.post<QuizResultResponse>('/api/quiz/submit', payload).then((res) => res.data)
}
