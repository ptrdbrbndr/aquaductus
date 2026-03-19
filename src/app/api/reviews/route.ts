import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('goedgekeurd', true)
      .order('created_at', { ascending: false })
      .limit(12)

    if (error) throw error
    return NextResponse.json(data ?? [])
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const body = await request.json()
    const { boekingId, klantNaam, rating, tekst } = body

    if (!klantNaam || !rating || !tekst) {
      return NextResponse.json({ fout: 'Vul alle verplichte velden in.' }, { status: 400 })
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ fout: 'Beoordeling moet tussen 1 en 5 zijn.' }, { status: 400 })
    }

    // Verifieer boeking als user ingelogd is
    if (user && boekingId) {
      const { data: boeking } = await supabase
        .from('boekingen')
        .select('id, status, klant_id')
        .eq('id', boekingId)
        .single()

      if (!boeking || boeking.klant_id !== user.id) {
        return NextResponse.json({ fout: 'Boeking niet gevonden.' }, { status: 403 })
      }
      if (boeking.status !== 'bevestigd') {
        return NextResponse.json({ fout: 'U kunt alleen reviews plaatsen bij bevestigde boekingen.' }, { status: 403 })
      }
    }

    const adminClient = await createAdminClient()
    const { error } = await adminClient.from('reviews').insert({
      boeking_id: boekingId ?? null,
      klant_naam: klantNaam,
      rating,
      tekst,
      goedgekeurd: false,
    })

    if (error) throw error
    return NextResponse.json({ succes: true, bericht: 'Uw review is ingediend en wordt beoordeeld.' })
  } catch (err) {
    console.error('Review opslaan fout:', err)
    return NextResponse.json({ fout: 'Er is een technische fout opgetreden.' }, { status: 500 })
  }
}
