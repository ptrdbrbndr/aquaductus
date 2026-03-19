import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'

export default async function AdminDashboard() {
  const supabase = await createAdminClient()

  const [{ data: boekingen }, { data: pendingReviews }, { data: recente }] = await Promise.all([
    supabase.from('boekingen').select('*').order('created_at', { ascending: false }).limit(20),
    supabase.from('reviews').select('*').eq('goedgekeurd', false).order('created_at', { ascending: false }),
    supabase.from('boekingen').select('*').order('created_at', { ascending: false }).limit(5),
  ])

  const totaalOmzet = (boekingen ?? [])
    .filter((b) => b.status !== 'geannuleerd')
    .reduce((sum, b) => sum + b.totaal_prijs, 0)

  return (
    <main className="min-h-screen bg-mist pt-20 pb-16" data-testid="admin-dashboard">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display text-3xl text-text-primary">Admin dashboard</h1>
          <div className="flex gap-3">
            <Link
              href="/admin/boekingen"
              className="bg-water text-white px-4 py-2 rounded-lg font-body text-sm hover:bg-water-deep transition-colors"
              data-testid="admin-nav-boekingen"
            >
              Boekingen
            </Link>
            <Link
              href="/admin/beschikbaarheid"
              className="bg-white border border-mist text-text-primary px-4 py-2 rounded-lg font-body text-sm hover:border-water transition-colors"
              data-testid="admin-nav-beschikbaarheid"
            >
              Beschikbaarheid
            </Link>
            <Link
              href="/admin/coaching"
              className="bg-white border border-mist text-text-primary px-4 py-2 rounded-lg font-body text-sm hover:border-water transition-colors"
              data-testid="admin-nav-coaching"
            >
              Coaching
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="font-body text-text-light text-sm">Totale omzet</p>
            <p className="font-display text-3xl text-water-deep">€{(totaalOmzet / 100).toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="font-body text-text-light text-sm">Totaal boekingen</p>
            <p className="font-display text-3xl text-water-deep">{boekingen?.length ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="font-body text-text-light text-sm">Reviews in behandeling</p>
            <p className="font-display text-3xl text-water-deep">{pendingReviews?.length ?? 0}</p>
          </div>
        </div>

        {/* Recente boekingen */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="font-body font-semibold text-text-primary mb-4">Recente boekingen</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-mist">
                  <th className="text-left font-body text-xs text-text-light pb-2">Naam</th>
                  <th className="text-left font-body text-xs text-text-light pb-2">Datum</th>
                  <th className="text-left font-body text-xs text-text-light pb-2">Personen</th>
                  <th className="text-left font-body text-xs text-text-light pb-2">Bedrag</th>
                  <th className="text-left font-body text-xs text-text-light pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {(recente ?? []).map((b) => (
                  <tr key={b.id} className="border-b border-mist last:border-0" data-testid="admin-boeking-rij">
                    <td className="py-3 font-body text-sm text-text-primary">{b.gast_naam ?? '—'}</td>
                    <td className="py-3 font-body text-sm text-text-primary">
                      {format(new Date(b.datum), 'd MMM yyyy', { locale: nl })}
                    </td>
                    <td className="py-3 font-body text-sm text-text-primary">{b.aantal_personen}</td>
                    <td className="py-3 font-body text-sm text-text-primary">€{(b.totaal_prijs / 100).toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`font-body text-xs px-2 py-1 rounded-full ${
                        b.status === 'bevestigd' ? 'bg-green-100 text-green-700' :
                        b.status === 'betaald' ? 'bg-blue-100 text-blue-700' :
                        b.status === 'geannuleerd' ? 'bg-red-100 text-red-700' :
                        'bg-mist text-text-light'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reviews goedkeuren */}
        {pendingReviews && pendingReviews.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-body font-semibold text-text-primary mb-4">
              Reviews goedkeuren ({pendingReviews.length})
            </h2>
            <div className="space-y-4">
              {pendingReviews.map((review) => (
                <ReviewBeoordelenItem key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function ReviewBeoordelenItem({ review }: { review: Record<string, unknown> }) {
  return (
    <div className="border border-mist rounded-xl p-4" data-testid="admin-review-item">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-body font-medium text-text-primary text-sm">{review.klant_naam as string}</p>
          <div className="flex gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`text-sm ${i < (review.rating as number) ? 'text-sand' : 'text-mist'}`}>★</span>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <form action={`/api/reviews/${review.id as string}/goedkeuren`} method="POST">
            <button
              type="submit"
              className="bg-green-500 text-white px-3 py-1 rounded-lg font-body text-xs hover:bg-green-600"
              data-testid="review-goedkeuren"
            >
              Goedkeuren
            </button>
          </form>
          <form action={`/api/reviews/${review.id as string}/afwijzen`} method="POST">
            <button
              type="submit"
              className="bg-red-100 text-red-600 px-3 py-1 rounded-lg font-body text-xs hover:bg-red-200"
              data-testid="review-afwijzen"
            >
              Afwijzen
            </button>
          </form>
        </div>
      </div>
      <p className="font-body text-text-light text-sm">{review.tekst as string}</p>
    </div>
  )
}
