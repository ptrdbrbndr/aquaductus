import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import { resend } from '@/lib/resend'
import { ADMIN_EMAIL } from '@/lib/constants'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ fout: 'Geen handtekening' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook verificatie mislukt:', err)
    return NextResponse.json({ fout: 'Ongeldige handtekening' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    await verwerkBoekingBetaling(session)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    if (session.metadata?.type === 'cadeaubon') {
      await verwerkCadeaubonBetaling(session)
    }
  }

  return NextResponse.json({ ontvangen: true })
}

async function verwerkBoekingBetaling(session: import('stripe').Stripe.Checkout.Session) {
  if (session.metadata?.type !== 'boeking') return
  const supabase = await createAdminClient()

  const { data: boeking } = await supabase
    .from('boekingen')
    .select('*')
    .eq('stripe_session_id', session.id)
    .single()

  if (!boeking) return

  await supabase
    .from('boekingen')
    .update({
      status: 'betaald',
      stripe_payment_intent_id: session.payment_intent as string,
    })
    .eq('id', boeking.id)

  // Update beschikbaarheid
  await supabase.rpc('increment_geboekte_plaatsen', {
    p_datum: boeking.datum,
    p_dienst_id: boeking.dienst_id,
    p_aantal: boeking.aantal_personen,
  })

  const email = boeking.gast_email ?? session.customer_email
  if (email) {
    await stuurBevestigingsmail(email, boeking)
  }
  await stuurAdminNotificatie(boeking)
}

async function stuurBevestigingsmail(email: string, boeking: Record<string, unknown>) {
  await resend.emails.send({
    from: 'Aquaductus <info@aquaductus.nl>',
    to: email,
    subject: 'Bevestiging van uw boeking bij Aquaductus',
    html: `
      <h2>Bedankt voor uw boeking!</h2>
      <p>Beste ${boeking.gast_naam},</p>
      <p>Uw boeking is bevestigd. We kijken ernaar uit u te verwelkomen!</p>
      <table>
        <tr><td><strong>Datum:</strong></td><td>${boeking.datum}</td></tr>
        <tr><td><strong>Aantal personen:</strong></td><td>${boeking.aantal_personen}</td></tr>
        <tr><td><strong>Totaalbedrag:</strong></td><td>€${((boeking.totaal_prijs as number) / 100).toFixed(2)}</td></tr>
      </table>
      <p>Tot ziens op het water!<br>Het Aquaductus team</p>
      <p><small>Vragen? Mail naar info@aquaductus.nl</small></p>
    `,
  })
}

async function stuurAdminNotificatie(boeking: Record<string, unknown>) {
  await resend.emails.send({
    from: 'Aquaductus Systeem <info@aquaductus.nl>',
    to: ADMIN_EMAIL,
    subject: `Nieuwe boeking: ${boeking.gast_naam} — ${boeking.datum}`,
    html: `
      <h3>Nieuwe boeking ontvangen</h3>
      <p>Naam: ${boeking.gast_naam}</p>
      <p>E-mail: ${boeking.gast_email}</p>
      <p>Telefoon: ${boeking.gast_telefoon ?? 'niet opgegeven'}</p>
      <p>Datum: ${boeking.datum}</p>
      <p>Personen: ${boeking.aantal_personen}</p>
      <p>Bedrag: €${((boeking.totaal_prijs as number) / 100).toFixed(2)}</p>
    `,
  })
}

async function verwerkCadeaubonBetaling(session: import('stripe').Stripe.Checkout.Session) {
  const supabase = await createAdminClient()
  const code = genereerCode()
  const geldigTot = new Date()
  geldigTot.setFullYear(geldigTot.getFullYear() + 1)

  const { data } = await supabase
    .from('cadeaubonnen')
    .update({
      code,
      geldig_tot: geldigTot.toISOString().split('T')[0],
      ingewisseld: false,
    })
    .eq('stripe_session_id', session.id)
    .select()
    .single()

  if (data && data.ontvanger_email) {
    await resend.emails.send({
      from: 'Aquaductus <info@aquaductus.nl>',
      to: data.ontvanger_email,
      subject: `Een cadeaubon van Aquaductus voor ${data.ontvanger_naam}!`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #F5EFE6; padding: 40px; border-radius: 16px;">
          <h1 style="color: #2C5F7A; font-size: 32px;">Aquaductus Cadeaubon</h1>
          <p>Beste ${data.ontvanger_naam},</p>
          <p>${data.bericht ?? 'Je hebt een cadeaubon ontvangen!'}</p>
          <div style="background: white; padding: 20px; border-radius: 12px; text-align: center; margin: 24px 0;">
            <p style="color: #718096; margin-bottom: 8px;">Uw cadeauboncode</p>
            <p style="font-size: 28px; font-weight: bold; color: #2C5F7A; letter-spacing: 4px;">${code}</p>
            <p style="color: #718096; font-size: 14px;">Geldig tot ${geldigTot.toLocaleDateString('nl-NL')}</p>
          </div>
          <p>Gebruik deze code bij het boeken op <a href="https://aquaductus.nl">aquaductus.nl</a></p>
        </div>
      `,
    })
  }
}

function genereerCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}
