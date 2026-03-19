import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import { DIENSTEN, PRIJZEN_CENTEN, MAX_PERSONEN, DIENST_LABELS, SITE_URL } from '@/lib/constants'
import type { DienstSlug } from '@/lib/types'

const GELDIGE_DIENSTEN = Object.values(DIENSTEN) as DienstSlug[]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dienstSlug, datum, aantalPersonen, klantNaam, klantEmail, klantTelefoon } = body

    if (!GELDIGE_DIENSTEN.includes(dienstSlug)) {
      return NextResponse.json({ fout: 'Ongeldige dienst geselecteerd.' }, { status: 400 })
    }
    if (!datum || !klantNaam || !klantEmail) {
      return NextResponse.json({ fout: 'Vul alle verplichte velden in.' }, { status: 400 })
    }

    const maxPers = MAX_PERSONEN[dienstSlug as DienstSlug]
    const parsedAantal = parseInt(aantalPersonen, 10)
    if (isNaN(parsedAantal) || parsedAantal < 1 || parsedAantal > maxPers) {
      return NextResponse.json(
        { fout: `Aantal personen moet tussen 1 en ${maxPers} liggen.` },
        { status: 400 }
      )
    }

    const prijs = PRIJZEN_CENTEN[dienstSlug as DienstSlug]
    const totaal = prijs * parsedAantal
    const dienstLabel = DIENST_LABELS[dienstSlug as DienstSlug]

    const supabase = await createAdminClient()

    // Check beschikbaarheid
    const { data: beschikbaar } = await supabase
      .from('beschikbaarheid')
      .select('*')
      .eq('datum', datum)
      .eq('dienst_id', dienstSlug)
      .single()

    if (beschikbaar?.geblokkeerd) {
      return NextResponse.json({ fout: 'Deze datum is niet beschikbaar.' }, { status: 409 })
    }
    if (
      beschikbaar &&
      beschikbaar.geboekte_plaatsen + parsedAantal > beschikbaar.max_plaatsen
    ) {
      return NextResponse.json({ fout: 'Onvoldoende plaatsen beschikbaar op deze datum.' }, { status: 409 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['ideal', 'card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${dienstLabel} — ${datum}`,
              description: `${parsedAantal} ${parsedAantal === 1 ? 'persoon' : 'personen'}`,
            },
            unit_amount: prijs,
          },
          quantity: parsedAantal,
        },
      ],
      mode: 'payment',
      success_url: `${SITE_URL}/betaling/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/betaling/annuleer`,
      customer_email: klantEmail,
      metadata: {
        dienst_slug: dienstSlug,
        datum,
        aantal_personen: parsedAantal.toString(),
        klant_naam: klantNaam,
        klant_email: klantEmail,
        klant_telefoon: klantTelefoon ?? '',
        type: 'boeking',
      },
    })

    // Sla pending boeking op
    const { data: dienst } = await supabase
      .from('diensten')
      .select('id')
      .eq('naam', dienstLabel)
      .single()

    if (dienst) {
      await supabase.from('boekingen').insert({
        gast_naam: klantNaam,
        gast_email: klantEmail,
        gast_telefoon: klantTelefoon ?? null,
        dienst_id: dienst.id,
        datum,
        aantal_personen: parsedAantal,
        totaal_prijs: totaal,
        status: 'pending',
        stripe_session_id: session.id,
      })
    }

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout fout:', err)
    return NextResponse.json({ fout: 'Er is een technische fout opgetreden.' }, { status: 500 })
  }
}
