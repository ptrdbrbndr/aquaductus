import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import { SITE_URL } from '@/lib/constants'

const MIN_WAARDE = 2500 // €25
const MAX_WAARDE = 50000 // €500

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { waardeCenten, koperEmail, ontvangerEmail, ontvangerNaam, bericht } = body

    if (!waardeCenten || !koperEmail) {
      return NextResponse.json({ fout: 'Vul alle verplichte velden in.' }, { status: 400 })
    }

    const parsedWaarde = parseInt(waardeCenten, 10)
    if (isNaN(parsedWaarde) || parsedWaarde < MIN_WAARDE || parsedWaarde > MAX_WAARDE) {
      return NextResponse.json(
        { fout: 'Ongeldige waarde. Kies tussen €25 en €500.' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['ideal', 'card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Aquaductus Cadeaubon',
              description: `Cadeaubon t.w.v. €${(parsedWaarde / 100).toFixed(0)} voor ${ontvangerNaam ?? 'ontvanger'}`,
            },
            unit_amount: parsedWaarde,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${SITE_URL}/betaling/succes?type=cadeaubon&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/cadeaubon`,
      customer_email: koperEmail,
      metadata: {
        type: 'cadeaubon',
        koper_email: koperEmail,
        ontvanger_email: ontvangerEmail ?? '',
        ontvanger_naam: ontvangerNaam ?? '',
        bericht: bericht ?? '',
        waarde: parsedWaarde.toString(),
      },
    })

    // Sla placeholderrecord op (code wordt ingevuld na betaling)
    const supabase = await createAdminClient()
    await supabase.from('cadeaubonnen').insert({
      code: 'PENDING',
      waarde: parsedWaarde,
      koper_email: koperEmail,
      ontvanger_email: ontvangerEmail ?? null,
      ontvanger_naam: ontvangerNaam ?? null,
      bericht: bericht ?? null,
      geldig_tot: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      stripe_session_id: session.id,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Cadeaubon checkout fout:', err)
    return NextResponse.json({ fout: 'Er is een technische fout opgetreden.' }, { status: 500 })
  }
}
