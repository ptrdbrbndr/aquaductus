import { NextRequest, NextResponse } from 'next/server'
import { getResend } from "@/lib/resend"
import { ADMIN_EMAIL } from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bedrijfsnaam, contactpersoon, email, datums, aantalDeelnemers, budget, bijzonderheden } = body

    if (!bedrijfsnaam || !contactpersoon || !email) {
      return NextResponse.json({ fout: 'Vul alle verplichte velden in.' }, { status: 400 })
    }

    await getResend().emails.send({
      from: 'Aquaductus B2B <info@aquaductus.nl>',
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `Nieuwe B2B aanvraag: ${bedrijfsnaam}`,
      html: `
        <h3>Nieuwe zakelijke aanvraag</h3>
        <p><strong>Bedrijf:</strong> ${bedrijfsnaam}</p>
        <p><strong>Contactpersoon:</strong> ${contactpersoon}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Gewenste datum(s):</strong> ${datums || 'niet opgegeven'}</p>
        <p><strong>Aantal deelnemers:</strong> ${aantalDeelnemers || 'niet opgegeven'}</p>
        <p><strong>Budget:</strong> ${budget || 'niet opgegeven'}</p>
        <p><strong>Bijzonderheden:</strong> ${bijzonderheden || 'geen'}</p>
      `,
    })

    return NextResponse.json({ succes: true })
  } catch (err) {
    console.error('B2B aanvraag fout:', err)
    return NextResponse.json({ fout: 'Er is een technische fout opgetreden.' }, { status: 500 })
  }
}
