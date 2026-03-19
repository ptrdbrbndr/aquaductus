import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ fout: 'Niet geautoriseerd.' }, { status: 403 })
    }

    const { datum, dienstSlug, geblokkeerd, maxPlaatsen } = await request.json()
    if (!datum || !dienstSlug) {
      return NextResponse.json({ fout: 'Datum en dienst zijn verplicht.' }, { status: 400 })
    }

    const adminClient = await createAdminClient()
    const { data: dienst } = await adminClient
      .from('diensten')
      .select('id')
      .ilike('naam', `%${dienstSlug.replace('-', ' ')}%`)
      .single()

    if (!dienst) {
      return NextResponse.json({ fout: 'Dienst niet gevonden.' }, { status: 404 })
    }

    await adminClient
      .from('beschikbaarheid')
      .upsert({
        datum,
        dienst_id: dienst.id,
        max_plaatsen: maxPlaatsen ?? 8,
        geblokkeerd: geblokkeerd ?? false,
        geboekte_plaatsen: 0,
      }, { onConflict: 'datum,dienst_id' })

    return NextResponse.json({ succes: true })
  } catch (err) {
    console.error('Beschikbaarheid update fout:', err)
    return NextResponse.json({ fout: 'Er is een technische fout opgetreden.' }, { status: 500 })
  }
}
