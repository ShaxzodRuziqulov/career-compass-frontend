import axios from 'axios'
import type { ApiErrorResponse } from '../types/api'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export class ApiError extends Error {
  status: number
  fieldErrors: Record<string, string> | null

  constructor(message: string, status: number, fieldErrors: Record<string, string> | null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error?.response?.data as ApiErrorResponse | undefined
    if (data?.message) {
      return Promise.reject(new ApiError(data.message, data.status, data.fieldErrors))
    }
    return Promise.reject(
      new ApiError('Server bilan bog‘lanishda xatolik yuz berdi', error?.response?.status ?? 0, null),
    )
  },
)
