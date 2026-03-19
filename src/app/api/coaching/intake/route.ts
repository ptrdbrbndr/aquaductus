import { NextRequest, NextResponse } from 'next/server'
import { resend } from '@/lib/resend'
import { ADMIN_EMAIL } from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { naam, email, motivatie, doelen, beschikbaarheid, aandachtspunten } = body

    if (!naam || !email || !motivatie || !doelen) {
      return NextResponse.json({ fout: 'Vul alle verplichte velden in.' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'Aquaductus Coaching <info@aquaductus.nl>',
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `Nieuwe coaching intake: ${naam}`,
      html: `
        <h3>Nieuwe coaching intake ontvangen</h3>
        <p><strong>Naam:</strong> ${naam}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Motivatie:</strong></p>
        <p>${motivatie}</p>
        <p><strong>Doelen:</strong></p>
        <p>${doelen}</p>
        <p><strong>Beschikbaarheid:</strong> ${beschikbaarheid || 'niet opgegeven'}</p>
        <p><strong>Aandachtspunten:</strong> ${aandachtspunten || 'geen'}</p>
      `,
    })

    await resend.emails.send({
      from: 'Aquaductus <info@aquaductus.nl>',
      to: email,
      subject: 'Uw intakeformulier is ontvangen',
      html: `
        <p>Beste ${naam},</p>
        <p>Bedankt voor uw interesse in coaching bij Aquaductus. We hebben uw intakeformulier ontvangen en nemen binnen 2 werkdagen contact op.</p>
        <p>Met vriendelijke groet,<br>Het Aquaductus team</p>
      `,
    })

    return NextResponse.json({ succes: true })
  } catch (err) {
    console.error('Intake fout:', err)
    return NextResponse.json({ fout: 'Er is een technische fout opgetreden.' }, { status: 500 })
  }
}
