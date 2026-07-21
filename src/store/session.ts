const STORAGE_KEY = 'kasbkompas_session_id'

export function getSessionId(): string {
  let sessionId = localStorage.getItem(STORAGE_KEY)
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem(STORAGE_KEY, sessionId)
  }
  return sessionId
}
