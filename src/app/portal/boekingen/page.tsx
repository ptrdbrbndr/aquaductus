'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
import type { Boeking } from '@/lib/types'

const supabaseClient = createClient()

export default function MijnBoekingen() {
  const [boekingen, setBoekingen] = useState<Boeking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [annuleerBezig, setAnnuleerBezig] = useState<string | null>(null)
  const [bericht, setBericht] = useState('')

  useEffect(() => {
    async function laadBoekingen() {
      const { data: { user } } = await supabaseClient.auth.getUser()
      if (!user) return

      const { data } = await supabaseClient
        .from('boekingen')
        .select('*')
        .eq('klant_id', user.id)
        .order('datum', { ascending: false })

      setBoekingen(data ?? [])
      setIsLoading(false)
    }
    laadBoekingen()
  }, [])

  async function annuleerBoeking(id: string) {
    setAnnuleerBezig(id)
    setBericht('')

    const res = await fetch('/api/boekingen/annuleer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boekingId: id }),
    })

    const data = await res.json()
    if (res.ok) {
      setBoekingen((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'geannuleerd' } : b))
      )
      setBericht('Boeking succesvol geannuleerd.')
    } else {
      setBericht(data.fout ?? 'Er is een fout opgetreden.')
    }
    setAnnuleerBezig(null)
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="font-body text-text-light">Boekingen laden...</p>
      </div>
    )
  }

  return (
    <div data-testid="mijn-boekingen">
      <h1 className="font-display text-3xl text-text-primary mb-6">Mijn boekingen</h1>

      {bericht && (
        <p className="font-body text-sm mb-4 bg-mist px-4 py-3 rounded-lg text-text-primary">
          {bericht}
        </p>
      )}

      {boekingen.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center">
          <p className="font-body text-text-light mb-4">U heeft nog geen boekingen.</p>
          <a href="/boeken" className="bg-water text-white px-6 py-3 rounded-lg font-body font-medium hover:bg-water-deep transition-colors">
            Maak een boeking
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {boekingen.map((boeking) => {
            const isKomend = new Date(boeking.datum) >= new Date()
            const kanAnnuleren = isKomend &&
              boeking.status !== 'geannuleerd' &&
              boeking.status !== 'pending'

            return (
              <div
                key={boeking.id}
                className="bg-white rounded-xl shadow-sm p-5"
                data-testid="boeking-item"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-body font-semibold text-text-primary">
                      {format(new Date(boeking.datum), 'EEEE d MMMM yyyy', { locale: nl })}
                    </p>
                    <p className="font-body text-text-light text-sm">
                      {boeking.aantal_personen} {boeking.aantal_personen === 1 ? 'persoon' : 'personen'} &bull;
                      €{(boeking.totaal_prijs / 100).toFixed(2)}
                    </p>
                  </div>
                  <span className={`font-body text-xs px-3 py-1 rounded-full ${
                    boeking.status === 'bevestigd' ? 'bg-green-100 text-green-700' :
                    boeking.status === 'betaald' ? 'bg-blue-100 text-blue-700' :
                    boeking.status === 'geannuleerd' ? 'bg-red-100 text-red-700' :
                    'bg-mist text-text-light'
                  }`}>
                    {boeking.status}
                  </span>
                </div>
                {kanAnnuleren && (
                  <button
                    onClick={() => annuleerBoeking(boeking.id)}
                    disabled={annuleerBezig === boeking.id}
                    className="font-body text-sm text-red-500 hover:text-red-700 mt-2 disabled:opacity-50"
                    data-testid="boeking-annuleer"
                  >
                    {annuleerBezig === boeking.id ? 'Annuleren...' : 'Annuleer boeking'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
