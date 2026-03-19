import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('groepsprogrammas')
      .select('naam, beschrijving')
      .eq('slug', slug)
      .single()
    if (!data) return {}
    return { title: `${data.naam} — Aquaductus`, description: data.beschrijving }
  } catch { return {} }
}

export default async function ProgrammaPagina({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: programma } = await supabase
    .from('groepsprogrammas')
    .select('*')
    .eq('slug', slug)
    .eq('actief', true)
    .single()

  if (!programma) notFound()

  return (
    <main className="min-h-screen bg-mist pt-20 pb-16" data-testid="programma-pagina">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-water-deep text-white p-8">
            <h1 className="font-display text-4xl mb-2">{programma.naam}</h1>
            <p className="font-body text-white/80">
              {format(new Date(programma.datum), 'EEEE d MMMM yyyy', { locale: nl })}
            </p>
          </div>
          <div className="p-8">
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="bg-sand-light rounded-xl px-4 py-3 text-center">
                <p className="font-body text-xs text-text-light">Prijs p.p.</p>
                <p className="font-display text-2xl text-water-deep">
                  €{(programma.prijs_per_persoon / 100).toFixed(0)}
                </p>
              </div>
              <div className="bg-mist rounded-xl px-4 py-3 text-center">
                <p className="font-body text-xs text-text-light">Max. deelnemers</p>
                <p className="font-display text-2xl text-water-deep">{programma.max_deelnemers}</p>
              </div>
            </div>

            {programma.beschrijving && (
              <p className="font-body text-text-light leading-relaxed mb-8">{programma.beschrijving}</p>
            )}

            <Link
              href={`/boeken?dienst=teambuilding&datum=${programma.datum}`}
              className="inline-block bg-water text-white px-8 py-3 rounded-lg font-body font-medium hover:bg-water-deep transition-colors"
              data-testid="programma-aanmelden"
            >
              Aanmelden voor dit programma
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
