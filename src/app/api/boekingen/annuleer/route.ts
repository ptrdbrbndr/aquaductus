import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { getResend } from "@/lib/resend"
import { ANNULERING_UREN_GRENS, ADMIN_EMAIL } from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ fout: 'U moet ingelogd zijn.' }, { status: 401 })
    }

    const { boekingId } = await request.json()

    const { data: boeking } = await supabase
      .from('boekingen')
      .select('*')
      .eq('id', boekingId)
      .eq('klant_id', user.id)
      .single()

    if (!boeking) {
      return NextResponse.json({ fout: 'Boeking niet gevonden.' }, { status: 404 })
    }

    if (boeking.status === 'geannuleerd') {
      return NextResponse.json({ fout: 'Boeking is al geannuleerd.' }, { status: 409 })
    }

    const boekingDatum = new Date(boeking.datum)
    const nu = new Date()
    const urenTotDatum = (boekingDatum.getTime() - nu.getTime()) / (1000 * 60 * 60)

    if (urenTotDatum < ANNULERING_UREN_GRENS) {
      return NextResponse.json(
        { fout: `Annuleren is niet meer mogelijk binnen ${ANNULERING_UREN_GRENS} uur voor de boeking.` },
        { status: 409 }
      )
    }

    const adminClient = await createAdminClient()
    await adminClient
      .from('boekingen')
      .update({ status: 'geannuleerd' })
      .eq('id', boekingId)

    const email = boeking.gast_email ?? user.email
    if (email) {
      await getResend().emails.send({
        from: 'Aquaductus <info@aquaductus.nl>',
        to: email,
        subject: 'Annulering van uw boeking',
        html: `<p>Uw boeking voor ${boeking.datum} is geannuleerd. Neem contact op voor vragen.</p>`,
      })
    }

    await getResend().emails.send({
      from: 'Aquaductus Systeem <info@aquaductus.nl>',
      to: ADMIN_EMAIL,
      subject: `Boeking geannuleerd: ${boeking.gast_naam} — ${boeking.datum}`,
      html: `<p>Boeking ${boekingId} is geannuleerd door de klant.</p>`,
    })

    return NextResponse.json({ succes: true })
  } catch (err) {
    console.error('Annulering fout:', err)
    return NextResponse.json({ fout: 'Er is een technische fout opgetreden.' }, { status: 500 })
  }
}
