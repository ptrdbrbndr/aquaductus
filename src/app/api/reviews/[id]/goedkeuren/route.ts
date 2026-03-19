import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

interface Params {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ fout: 'Niet geautoriseerd.' }, { status: 403 })
  }

  const adminClient = await createAdminClient()
  await adminClient.from('reviews').update({ goedgekeurd: true }).eq('id', id)
  return NextResponse.redirect(new URL('/admin', request.url))
}
