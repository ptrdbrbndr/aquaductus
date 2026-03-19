'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const reviewSupabase = createClient()

export default function ReviewPlaatsen() {
  const [boekingen, setBoekingen] = useState<Array<{ id: string; datum: string }>>([])
  const [boekingId, setBoekingId] = useState('')
  const [klantNaam, setKlantNaam] = useState('')
  const [rating, setRating] = useState(5)
  const [tekst, setTekst] = useState('')
  const [bericht, setBericht] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function laadBoekingen() {
      const { data: { user } } = await reviewSupabase.auth.getUser()
      if (!user) return
      const { data } = await reviewSupabase
        .from('boekingen')
        .select('id, datum')
        .eq('klant_id', user.id)
        .eq('status', 'bevestigd')
        .lt('datum', new Date().toISOString().split('T')[0])
        .order('datum', { ascending: false })
      setBoekingen(data ?? [])
    }
    laadBoekingen()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setBericht('')

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boekingId: boekingId || undefined, klantNaam, rating, tekst }),
    })

    const data = await res.json()
    setBericht(data.bericht ?? data.fout ?? '')
    if (res.ok) {
      setTekst('')
      setRating(5)
    }
    setIsLoading(false)
  }

  return (
    <div data-testid="review-plaatsen">
      <h1 className="font-display text-3xl text-text-primary mb-6">Review plaatsen</h1>

      <div className="bg-white rounded-2xl shadow-sm p-6 max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {boekingen.length > 0 && (
            <div>
              <label htmlFor="boeking" className="block font-body text-sm font-medium text-text-primary mb-1">
                Boeking
              </label>
              <select
                id="boeking"
                value={boekingId}
                onChange={(e) => setBoekingId(e.target.value)}
                className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm"
                data-testid="review-boeking"
              >
                <option value="">Selecteer een boeking</option>
                {boekingen.map((b) => (
                  <option key={b.id} value={b.id}>{b.datum}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="naam" className="block font-body text-sm font-medium text-text-primary mb-1">
              Uw naam
            </label>
            <input
              id="naam"
              type="text"
              required
              value={klantNaam}
              onChange={(e) => setKlantNaam(e.target.value)}
              className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm"
              data-testid="review-naam"
            />
          </div>

          <div>
            <label className="block font-body text-sm font-medium text-text-primary mb-2">
              Beoordeling
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((ster) => (
                <button
                  key={ster}
                  type="button"
                  onClick={() => setRating(ster)}
                  className={`text-2xl transition-colors ${ster <= rating ? 'text-sand' : 'text-mist'}`}
                  aria-label={`${ster} ster${ster !== 1 ? 'ren' : ''}`}
                  data-testid={`review-ster-${ster}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="tekst" className="block font-body text-sm font-medium text-text-primary mb-1">
              Uw ervaring
            </label>
            <textarea
              id="tekst"
              required
              value={tekst}
              onChange={(e) => setTekst(e.target.value)}
              rows={4}
              className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm resize-none"
              data-testid="review-tekst"
            />
          </div>

          {bericht && (
            <p className="font-body text-sm bg-mist px-4 py-3 rounded-lg">{bericht}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-water text-white py-3 rounded-lg font-body font-medium hover:bg-water-deep transition-colors disabled:opacity-50"
            data-testid="review-submit"
          >
            {isLoading ? 'Versturen...' : 'Verstuur review'}
          </button>
        </form>
      </div>
    </div>
  )
}
