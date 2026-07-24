export interface TraitTheme {
  code: string
  label: string
  from: string
  to: string
}

// RIASEC hues stay semantically recognizable (R orange, I blue, A pink,
// S green, E red, C indigo) but are tuned a touch deeper/earthier so they
// sit on the warm paper + ink cartography palette without glowing.
export const traitThemes: Record<string, TraitTheme> = {
  R: { code: 'R', label: 'Amaliy', from: '#f59e42', to: '#ea7c1f' },
  I: { code: 'I', label: 'Tadqiqotchi', from: '#3a9fd6', to: '#1f7fb8' },
  A: { code: 'A', label: 'Ijodkor', from: '#e069a3', to: '#c94f8a' },
  S: { code: 'S', label: 'Ijtimoiy', from: '#3bb489', to: '#199468' },
  E: { code: 'E', label: 'Tashabbuskor', from: '#ef6a6a', to: '#d64545' },
  C: { code: 'C', label: 'Tartibli', from: '#7b83e0', to: '#5b62c7' },
}

// Neutral fallback follows the teal brand accent (not the retired purple).
export const defaultTraitTheme: TraitTheme = {
  code: '',
  label: '',
  from: '#2bb3a3',
  to: '#0f9d8f',
}

export function getTraitTheme(code: string): TraitTheme {
  return traitThemes[code] ?? defaultTraitTheme
}
