const STORAGE_KEY = 'kasbkompas_admin_auth'

export function getAdminAuth(): string | null {
  return sessionStorage.getItem(STORAGE_KEY)
}

export function setAdminAuth(username: string, password: string): void {
  sessionStorage.setItem(STORAGE_KEY, btoa(`${username}:${password}`))
}

export function clearAdminAuth(): void {
  sessionStorage.removeItem(STORAGE_KEY)
}

export function isAdminLoggedIn(): boolean {
  return getAdminAuth() !== null
}
