import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'

export default async function PortalDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: komendeBoeking } = await supabase
    .from('boekingen')
    .select('*, diensten(naam)')
    .eq('klant_id', user!.id)
    .in('status', ['betaald', 'bevestigd'])
    .gte('datum', new Date().toISOString().split('T')[0])
    .order('datum')
    .limit(1)
    .single()

  const { data: boekingen } = await supabase
    .from('boekingen')
    .select('*')
    .eq('klant_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div data-testid="portal-dashboard">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-text-primary mb-1">Mijn portaal</h1>
        <p className="font-body text-text-light">{user!.email}</p>
      </div>

      {komendeBoeking && (
        <div className="bg-water-deep text-white rounded-2xl p-6 mb-6" data-testid="komende-boeking">
          <p className="font-body text-white/70 text-sm mb-1">Volgende boeking</p>
          <h2 className="font-display text-2xl mb-1">
            {(komendeBoeking as { diensten?: { naam?: string } }).diensten?.naam ?? 'Boeking'}
          </h2>
          <p className="font-body text-white/80">
            {format(new Date(komendeBoeking.datum), 'EEEE d MMMM yyyy', { locale: nl })}
          </p>
          <p className="font-body text-white/70 text-sm mt-1">
            {komendeBoeking.aantal_personen} {komendeBoeking.aantal_personen === 1 ? 'persoon' : 'personen'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link
          href="/portal/boekingen"
          className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
          data-testid="portal-kaart-boekingen"
        >
          <h3 className="font-body font-semibold text-text-primary mb-1">Boekingen</h3>
          <p className="font-body text-text-light text-sm">Bekijk al uw boekingen</p>
        </Link>
        <Link
          href="/portal/coaching"
          className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
          data-testid="portal-kaart-coaching"
        >
          <h3 className="font-body font-semibold text-text-primary mb-1">Coaching</h3>
          <p className="font-body text-text-light text-sm">Trajecten en sessies</p>
        </Link>
        <Link
          href="/portal/reviews"
          className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
          data-testid="portal-kaart-reviews"
        >
          <h3 className="font-body font-semibold text-text-primary mb-1">Review plaatsen</h3>
          <p className="font-body text-text-light text-sm">Deel uw ervaring</p>
        </Link>
      </div>

      {boekingen && boekingen.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-body font-semibold text-text-primary mb-4">Recente activiteit</h2>
          <div className="space-y-3">
            {boekingen.map((b) => (
              <div key={b.id} className="flex justify-between items-center py-2 border-b border-mist last:border-0">
                <div>
                  <p className="font-body text-sm text-text-primary">{format(new Date(b.datum), 'd MMM yyyy', { locale: nl })}</p>
                  <p className="font-body text-xs text-text-light">{b.aantal_personen} pers. &bull; €{(b.totaal_prijs / 100).toFixed(2)}</p>
                </div>
                <span className={`font-body text-xs px-2 py-1 rounded-full ${
                  b.status === 'bevestigd' ? 'bg-green-100 text-green-700' :
                  b.status === 'betaald' ? 'bg-blue-100 text-blue-700' :
                  b.status === 'geannuleerd' ? 'bg-red-100 text-red-700' :
                  'bg-mist text-text-light'
                }`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
