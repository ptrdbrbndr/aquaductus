import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { resend } from '@/lib/resend'

interface Params {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ fout: 'Niet geautoriseerd.' }, { status: 403 })
    }

    const adminClient = await createAdminClient()
    const { data: boeking } = await adminClient
      .from('boekingen')
      .update({ status: 'bevestigd' })
      .eq('id', id)
      .select()
      .single()

    if (boeking?.gast_email) {
      await resend.emails.send({
        from: 'Aquaductus <info@aquaductus.nl>',
        to: boeking.gast_email,
        subject: 'Uw boeking bij Aquaductus is bevestigd!',
        html: `
          <p>Beste ${boeking.gast_naam},</p>
          <p>Uw boeking voor <strong>${boeking.datum}</strong> is officieel bevestigd. We kijken ernaar uit!</p>
          <p>Met vriendelijke groet,<br>Het Aquaductus team</p>
        `,
      })
    }

    return NextResponse.redirect(new URL('/admin/boekingen', request.url))
  } catch (err) {
    console.error('Bevestiging fout:', err)
    return NextResponse.json({ fout: 'Er is een technische fout opgetreden.' }, { status: 500 })
  }
}
