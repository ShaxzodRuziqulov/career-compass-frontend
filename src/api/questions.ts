import { http } from './http'
import type { Question, QuestionRequest } from '../types/api'

export function createQuestion(payload: QuestionRequest) {
  return http.post<Question>('/api/questions', payload).then((res) => res.data)
}

export function updateQuestion(id: number, payload: QuestionRequest) {
  return http.put<Question>(`/api/questions/${id}`, payload).then((res) => res.data)
}
