export interface TraitTheme {
  code: string
  label: string
  from: string
  to: string
}

export const traitThemes: Record<string, TraitTheme> = {
  R: { code: 'R', label: 'Amaliy', from: '#fb923c', to: '#f97316' },
  I: { code: 'I', label: 'Tadqiqotchi', from: '#38bdf8', to: '#0ea5e9' },
  A: { code: 'A', label: 'Ijodkor', from: '#f472b6', to: '#ec4899' },
  S: { code: 'S', label: 'Ijtimoiy', from: '#34d399', to: '#10b981' },
  E: { code: 'E', label: 'Tashabbuskor', from: '#fb7185', to: '#f43f5e' },
  C: { code: 'C', label: 'Tartibli', from: '#818cf8', to: '#6366f1' },
}

export const defaultTraitTheme: TraitTheme = {
  code: '',
  label: '',
  from: '#aa3bff',
  to: '#c084fc',
}

export function getTraitTheme(code: string): TraitTheme {
  return traitThemes[code] ?? defaultTraitTheme
}
