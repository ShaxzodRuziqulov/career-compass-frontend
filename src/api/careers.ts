import { http } from './http'
import type { Career, CareerDetail } from '../types/api'

const careersCache = new Map<string, Career[]>()
const careerDetailCache = new Map<number, CareerDetail>()

export async function getCareers(traitCode?: string): Promise<Career[]> {
  const cacheKey = traitCode ?? 'all'
  const cached = careersCache.get(cacheKey)
  if (cached) return cached

  const res = await http.get<Career[]>('/api/careers', {
    params: traitCode ? { trait: traitCode } : undefined,
  })
  careersCache.set(cacheKey, res.data)
  return res.data
}

export async function getCareerDetail(id: number): Promise<CareerDetail> {
  const cached = careerDetailCache.get(id)
  if (cached) return cached
  const res = await http.get<CareerDetail>(`/api/careers/${id}`)
  careerDetailCache.set(id, res.data)
  return res.data
}
