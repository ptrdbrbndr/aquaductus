'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const VASTE_WAARDES = [
  { label: '€50', centen: 5000 },
  { label: '€100', centen: 10000 },
  { label: '€150', centen: 15000 },
]

export default function CadeaubonPagina() {
  const router = useRouter()
  const [waardeCenten, setWaardeCenten] = useState<number | null>(null)
  const [vrijeWaarde, setVrijeWaarde] = useState('')
  const [koperEmail, setKoperEmail] = useState('')
  const [ontvangerNaam, setOntvangerNaam] = useState('')
  const [ontvangerEmail, setOntvangerEmail] = useState('')
  const [bericht, setBericht] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [foutmelding, setFoutmelding] = useState('')

  const effectieveWaarde = waardeCenten ?? (vrijeWaarde ? parseInt(vrijeWaarde, 10) * 100 : null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!effectieveWaarde || !koperEmail) return

    setIsLoading(true)
    setFoutmelding('')

    const res = await fetch('/api/cadeaubon/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        waardeCenten: effectieveWaarde.toString(),
        koperEmail,
        ontvangerNaam,
        ontvangerEmail,
        bericht,
      }),
    })

    const data = await res.json()
    if (res.ok) {
      router.push(data.url)
    } else {
      setFoutmelding(data.fout ?? 'Er is een fout opgetreden.')
    }
    setIsLoading(false)
  }

  return (
    <main className="min-h-screen bg-mist pt-20 pb-16" data-testid="cadeaubon-pagina">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="font-body text-water text-sm tracking-widest uppercase mb-3">Cadeau geven</p>
          <h1 className="font-display text-4xl sm:text-5xl text-text-primary mb-4">
            Aquaductus Cadeaubon
          </h1>
          <p className="font-body text-text-light">
            Geef iemand de onvergetelijke ervaring van zeilen, coaching of teambuilding op de Randmeren.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Waarde kiezen */}
            <div>
              <h2 className="font-body font-semibold text-text-primary mb-3">Kies een waarde</h2>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {VASTE_WAARDES.map((w) => (
                  <button
                    key={w.centen}
                    type="button"
                    onClick={() => { setWaardeCenten(w.centen); setVrijeWaarde('') }}
                    className={`py-3 rounded-xl border-2 font-body font-semibold text-lg transition-colors ${
                      waardeCenten === w.centen
                        ? 'border-water bg-water/5 text-water-deep'
                        : 'border-mist hover:border-water/50 text-text-primary'
                    }`}
                    data-testid={`cadeaubon-waarde-${w.label}`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-body text-text-light text-sm">Of een vrij bedrag (€):</span>
                <input
                  type="number"
                  min={25}
                  max={500}
                  value={vrijeWaarde}
                  onChange={(e) => { setVrijeWaarde(e.target.value); setWaardeCenten(null) }}
                  placeholder="bijv. 75"
                  className="flex-1 border border-mist rounded-lg px-3 py-2 font-body text-sm"
                  data-testid="cadeaubon-vrije-waarde"
                />
              </div>
            </div>

            {/* Koper */}
            <div>
              <label htmlFor="koperEmail" className="block font-body text-sm font-medium text-text-primary mb-1">
                Uw e-mailadres *
              </label>
              <input
                id="koperEmail"
                type="email"
                required
                value={koperEmail}
                onChange={(e) => setKoperEmail(e.target.value)}
                className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm"
                data-testid="cadeaubon-koper-email"
              />
            </div>

            {/* Ontvanger */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ontvangerNaam" className="block font-body text-sm font-medium text-text-primary mb-1">
                  Naam ontvanger
                </label>
                <input
                  id="ontvangerNaam"
                  type="text"
                  value={ontvangerNaam}
                  onChange={(e) => setOntvangerNaam(e.target.value)}
                  className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm"
                  data-testid="cadeaubon-ontvanger-naam"
                />
              </div>
              <div>
                <label htmlFor="ontvangerEmail" className="block font-body text-sm font-medium text-text-primary mb-1">
                  E-mail ontvanger
                </label>
                <input
                  id="ontvangerEmail"
                  type="email"
                  value={ontvangerEmail}
                  onChange={(e) => setOntvangerEmail(e.target.value)}
                  className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm"
                  data-testid="cadeaubon-ontvanger-email"
                />
              </div>
            </div>

            {/* Bericht */}
            <div>
              <label htmlFor="bericht" className="block font-body text-sm font-medium text-text-primary mb-1">
                Persoonlijk bericht
              </label>
              <textarea
                id="bericht"
                value={bericht}
                onChange={(e) => setBericht(e.target.value)}
                rows={3}
                placeholder="Schrijf een persoonlijk berichtje..."
                className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm resize-none"
                data-testid="cadeaubon-bericht"
              />
            </div>

            {foutmelding && (
              <p className="font-body text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{foutmelding}</p>
            )}

            <button
              type="submit"
              disabled={isLoading || !effectieveWaarde || !koperEmail}
              className="w-full bg-water text-white py-4 rounded-xl font-body font-medium text-lg hover:bg-water-deep transition-colors disabled:opacity-50"
              data-testid="cadeaubon-bestellen"
            >
              {isLoading ? 'Even wachten...' : `Bestel cadeaubon${effectieveWaarde ? ` (€${(effectieveWaarde / 100).toFixed(0)})` : ''}`}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
