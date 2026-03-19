import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

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
    await adminClient
      .from('boekingen')
      .update({ status: 'geannuleerd' })
      .eq('id', id)

    return NextResponse.redirect(new URL('/admin/boekingen', request.url))
  } catch (err) {
    console.error('Admin annulering fout:', err)
    return NextResponse.json({ fout: 'Er is een technische fout opgetreden.' }, { status: 500 })
  }
}
