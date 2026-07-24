import { http } from './http'
import type { StatsResponse } from '../types/api'

export function getStats() {
  return http.get<StatsResponse>('/api/stats').then((res) => res.data)
}
