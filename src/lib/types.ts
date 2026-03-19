export type DienstSlug = 'recreatief-zeilen' | 'coachingssessie' | 'teambuilding'

export type BoekingStatus = 'pending' | 'betaald' | 'bevestigd' | 'geannuleerd'
export type CoachingStatus = 'intake' | 'actief' | 'afgerond' | 'gepauzeerd'

export interface Dienst {
  id: string
  naam: string
  beschrijving: string
  prijs_per_persoon: number
  max_personen: number
  duur_uren: number
  actief: boolean
}

export interface Beschikbaarheid {
  id: string
  datum: string
  dienst_id: string
  max_plaatsen: number
  geboekte_plaatsen: number
  geblokkeerd: boolean
}

export interface Boeking {
  id: string
  klant_id: string | null
  gast_naam: string | null
  gast_email: string | null
  gast_telefoon: string | null
  dienst_id: string
  datum: string
  aantal_personen: number
  totaal_prijs: number
  status: BoekingStatus
  stripe_session_id: string | null
  stripe_payment_intent_id: string | null
  notities: string | null
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  boeking_id: string | null
  klant_naam: string
  rating: number
  tekst: string
  goedgekeurd: boolean
  created_at: string
}

export interface Cadeaubon {
  id: string
  code: string
  waarde: number
  koper_email: string
  ontvanger_email: string | null
  ontvanger_naam: string | null
  bericht: string | null
  geldig_tot: string
  ingewisseld: boolean
  ingewisseld_bij: string | null
  stripe_session_id: string | null
  created_at: string
}

export interface CoachingTraject {
  id: string
  klant_id: string
  coach_id: string
  naam: string
  status: CoachingStatus
  start_datum: string | null
  eind_datum: string | null
  notities: string | null
  created_at: string
}

export interface CoachingSessie {
  id: string
  traject_id: string
  boeking_id: string | null
  datum: string | null
  verslag_encrypted: string | null
  verslag_iv: string | null
  verslag_coach_notities: string | null
  created_at: string
}

export interface Reflectie {
  id: string
  sessie_id: string
  klant_id: string
  vraag_1: string | null
  vraag_2: string | null
  vraag_3: string | null
  created_at: string
}

export interface Groepsprogramma {
  id: string
  naam: string
  beschrijving: string
  datum: string
  max_deelnemers: number
  prijs_per_persoon: number
  slug: string
  actief: boolean
}

export interface BlogPost {
  id: string
  slug: string
  titel: string
  samenvatting: string
  inhoud: string
  gepubliceerd: boolean
  gepubliceerd_op: string | null
  seo_titel: string | null
  seo_beschrijving: string | null
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      diensten: { Row: Dienst }
      beschikbaarheid: { Row: Beschikbaarheid }
      boekingen: { Row: Boeking }
      reviews: { Row: Review }
      cadeaubonnen: { Row: Cadeaubon }
      coaching_trajecten: { Row: CoachingTraject }
      coaching_sessies: { Row: CoachingSessie }
      reflecties: { Row: Reflectie }
      groepsprogrammas: { Row: Groepsprogramma }
      blog_posts: { Row: BlogPost }
    }
  }
}
