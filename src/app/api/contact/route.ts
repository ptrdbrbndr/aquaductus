import { NextRequest, NextResponse } from 'next/server'
import { getResend } from "@/lib/resend"
import { ADMIN_EMAIL } from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const naam = formData.get('naam') as string
    const email = formData.get('email') as string
    const telefoon = formData.get('telefoon') as string
    const dienst = formData.get('dienst') as string
    const bericht = formData.get('bericht') as string

    if (!naam || !email || !bericht) {
      return NextResponse.redirect(new URL('/?fout=verplichte-velden', request.url))
    }

    await getResend().emails.send({
      from: 'Aquaductus Contactformulier <info@aquaductus.nl>',
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `Nieuw contactbericht van ${naam}`,
      html: `
        <h3>Nieuw contactbericht via aquaductus.nl</h3>
        <p><strong>Naam:</strong> ${naam}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefoon:</strong> ${telefoon || 'niet opgegeven'}</p>
        <p><strong>Interesse in:</strong> ${dienst || 'niet opgegeven'}</p>
        <hr>
        <p><strong>Bericht:</strong></p>
        <p>${bericht.replace(/\n/g, '<br>')}</p>
      `,
    })

    return NextResponse.redirect(new URL('/?bericht=verstuurd', request.url))
  } catch (err) {
    console.error('Contact mail fout:', err)
    return NextResponse.redirect(new URL('/?fout=technisch', request.url))
  }
}
