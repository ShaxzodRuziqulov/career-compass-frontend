export interface Question {
  id: number
  traitCode: string
  textUz: string
  weight: number
}

export interface AnswerItem {
  questionId: number
  value: number
}

export interface SubmitAnswerRequest {
  sessionId: string
  answers: AnswerItem[]
}

export interface TopCareer {
  careerId: number
  nameUz: string
  matchPercent: number
}

export interface QuizResultResponse {
  userTraitProfile: Record<string, number>
  topCareers: TopCareer[]
}

export interface Career {
  id: number
  nameUz: string
  description: string
  matchScore: number | null
}

export interface Roadmap {
  universitiesUz: string | null
  dtmSubjectsUz: string | null
  skillsUz: string | null
  notesUz: string | null
}

export interface CareerDetail {
  id: number
  nameUz: string
  description: string
  roadmap: Roadmap | null
}

export interface ApiErrorResponse {
  timestamp: string
  status: number
  error: string
  message: string
  fieldErrors: Record<string, string> | null
}
