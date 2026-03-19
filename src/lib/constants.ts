export const DIENSTEN = {
  ZEILEN: 'recreatief-zeilen',
  COACHING: 'coachingssessie',
  TEAMBUILDING: 'teambuilding',
} as const

export const MAX_PERSONEN = {
  [DIENSTEN.ZEILEN]: 8,
  [DIENSTEN.COACHING]: 2,
  [DIENSTEN.TEAMBUILDING]: 16,
} as const

export const PRIJZEN_CENTEN = {
  [DIENSTEN.ZEILEN]: 7500, // €75 p.p.
  [DIENSTEN.COACHING]: 15000, // €150 p.p.
  [DIENSTEN.TEAMBUILDING]: 9500, // €95 p.p.
} as const

export const DIENST_LABELS = {
  [DIENSTEN.ZEILEN]: 'Recreatief zeilen',
  [DIENSTEN.COACHING]: 'Coachingssessie',
  [DIENSTEN.TEAMBUILDING]: 'Teambuilding',
} as const

export const DIENST_DUUR_UREN = {
  [DIENSTEN.ZEILEN]: 4,
  [DIENSTEN.COACHING]: 3,
  [DIENSTEN.TEAMBUILDING]: 6,
} as const

export const DIENST_AFBEELDINGEN = {
  [DIENSTEN.ZEILEN]: '/dienst-zeilen.jpg',
  [DIENSTEN.COACHING]: '/dienst-coaching.jpg',
  [DIENSTEN.TEAMBUILDING]: '/dienst-teambuilding.jpg',
} as const

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@aquaductus.nl'
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://aquaductus.nl'

export const ANNULERING_UREN_GRENS = 24
