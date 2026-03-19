'use client'

import { useState, Suspense } from 'react'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import { format, addDays, startOfDay } from 'date-fns'
import { nl } from 'date-fns/locale'

const DIENSTEN_DATA = [
  {
    slug: 'recreatief-zeilen',
    naam: 'Recreatief zeilen',
    prijs: 7500,
    duur: '4 uur',
    maxPersonen: 8,
    afbeelding: '/dienst-zeilen.jpg',
  },
  {
    slug: 'coachingssessie',
    naam: 'Coachingssessie',
    prijs: 15000,
    duur: '3 uur',
    maxPersonen: 2,
    afbeelding: '/dienst-coaching.jpg',
  },
  {
    slug: 'teambuilding',
    naam: 'Teambuilding',
    prijs: 9500,
    duur: '6 uur',
    maxPersonen: 16,
    afbeelding: '/dienst-teambuilding.jpg',
  },
]

type Stap = 1 | 2 | 3 | 4 | 5

function BoekenFormulier() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialDienst = searchParams.get('dienst') ?? ''

  const [stap, setStap] = useState<Stap>(initialDienst ? 2 : 1)
  const [gekozenDienst, setGekozenDienst] = useState(
    DIENSTEN_DATA.find((d) => d.slug === initialDienst) ?? null
  )
  const [gekozenDatum, setGekozenDatum] = useState<Date | undefined>()
  const [aantalPersonen, setAantalPersonen] = useState(1)
  const [klantData, setKlantData] = useState({ naam: '', email: '', telefoon: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [foutmelding, setFoutmelding] = useState('')

  const vandaag = startOfDay(new Date())
  const maxDatum = addDays(vandaag, 365)

  const totaalCenten = gekozenDienst ? gekozenDienst.prijs * aantalPersonen : 0
  const totaalEuro = (totaalCenten / 100).toFixed(2)

  async function handleCheckout() {
    if (!gekozenDienst || !gekozenDatum) return
    setIsLoading(true)
    setFoutmelding('')
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dienstSlug: gekozenDienst.slug,
          datum: format(gekozenDatum, 'yyyy-MM-dd'),
          aantalPersonen,
          klantNaam: klantData.naam,
          klantEmail: klantData.email,
          klantTelefoon: klantData.telefoon,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setFoutmelding(data.fout ?? 'Er is een fout opgetreden.')
        return
      }
      router.push(data.url)
    } catch {
      setFoutmelding('Er is een fout opgetreden. Probeer het opnieuw.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-mist pt-20 pb-16" data-testid="boeken-pagina">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl sm:text-5xl text-text-primary mb-2">Boek je tocht</h1>
          <p className="font-body text-text-light">Volg de stappen om je boeking te voltooien.</p>
        </div>

        {/* Stappen indicator */}
        <div className="flex items-center justify-center gap-2 mb-10" data-testid="stappen-indicator">
          {([1, 2, 3, 4, 5] as Stap[]).map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-body font-medium transition-colors ${
                  stap >= s ? 'bg-water text-white' : 'bg-white text-text-light border border-mist'
                }`}
              >
                {s}
              </div>
              {s < 5 && <div className={`w-8 h-0.5 mx-1 ${stap > s ? 'bg-water' : 'bg-mist'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {/* Stap 1: Kies dienst */}
          {stap === 1 && (
            <div data-testid="stap-1-dienst">
              <h2 className="font-display text-2xl text-text-primary mb-6">Welke dienst?</h2>
              <div className="space-y-4">
                {DIENSTEN_DATA.map((dienst) => (
                  <button
                    key={dienst.slug}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      gekozenDienst?.slug === dienst.slug
                        ? 'border-water bg-water/5'
                        : 'border-mist hover:border-water/50'
                    }`}
                    onClick={() => {
                      setGekozenDienst(dienst)
                      setAantalPersonen(1)
                    }}
                    data-testid={`dienst-optie-${dienst.slug}`}
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={dienst.afbeelding} alt={dienst.naam} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-body font-semibold text-text-primary">{dienst.naam}</p>
                      <p className="font-body text-text-light text-sm">
                        {dienst.duur} &bull; max. {dienst.maxPersonen} pers. &bull; €{(dienst.prijs / 100).toFixed(0)} p.p.
                      </p>
                    </div>
                    {gekozenDienst?.slug === dienst.slug && (
                      <svg className="w-5 h-5 text-water flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setStap(2)}
                  disabled={!gekozenDienst}
                  className="bg-water text-white px-8 py-3 rounded-lg font-body font-medium hover:bg-water-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="stap-1-volgende"
                >
                  Volgende
                </button>
              </div>
            </div>
          )}

          {/* Stap 2: Kies datum */}
          {stap === 2 && (
            <div data-testid="stap-2-datum">
              <h2 className="font-display text-2xl text-text-primary mb-6">Kies een datum</h2>
              <div className="flex justify-center">
                <DayPicker
                  mode="single"
                  selected={gekozenDatum}
                  onSelect={setGekozenDatum}
                  locale={nl}
                  disabled={[
                    { before: addDays(vandaag, 1) },
                    { after: maxDatum },
                  ]}
                  classNames={{
                    selected: 'bg-water text-white rounded-lg',
                    today: 'font-bold text-water',
                  }}
                />
              </div>
              {gekozenDatum && (
                <p className="text-center font-body text-water font-medium mt-4">
                  Geselecteerd: {format(gekozenDatum, 'd MMMM yyyy', { locale: nl })}
                </p>
              )}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStap(1)}
                  className="text-text-light font-body hover:text-text-primary transition-colors"
                  data-testid="stap-2-terug"
                >
                  Terug
                </button>
                <button
                  onClick={() => setStap(3)}
                  disabled={!gekozenDatum}
                  className="bg-water text-white px-8 py-3 rounded-lg font-body font-medium hover:bg-water-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="stap-2-volgende"
                >
                  Volgende
                </button>
              </div>
            </div>
          )}

          {/* Stap 3: Aantal personen */}
          {stap === 3 && gekozenDienst && (
            <div data-testid="stap-3-personen">
              <h2 className="font-display text-2xl text-text-primary mb-6">Hoeveel personen?</h2>
              <div className="flex items-center justify-center gap-6 py-8">
                <button
                  onClick={() => setAantalPersonen(Math.max(1, aantalPersonen - 1))}
                  className="w-12 h-12 rounded-full border-2 border-water text-water text-2xl font-bold hover:bg-water hover:text-white transition-colors flex items-center justify-center"
                  aria-label="Minder personen"
                  data-testid="personen-min"
                >
                  &minus;
                </button>
                <div className="text-center">
                  <span
                    className="font-display text-6xl text-water-deep"
                    data-testid="personen-aantal"
                  >
                    {aantalPersonen}
                  </span>
                  <p className="font-body text-text-light text-sm mt-1">
                    {aantalPersonen === 1 ? 'persoon' : 'personen'}
                  </p>
                </div>
                <button
                  onClick={() => setAantalPersonen(Math.min(gekozenDienst.maxPersonen, aantalPersonen + 1))}
                  className="w-12 h-12 rounded-full border-2 border-water text-water text-2xl font-bold hover:bg-water hover:text-white transition-colors flex items-center justify-center"
                  aria-label="Meer personen"
                  data-testid="personen-plus"
                >
                  +
                </button>
              </div>
              <p className="text-center font-body text-text-light text-sm mb-4">
                Maximum: {gekozenDienst.maxPersonen} personen
              </p>
              <div className="bg-sand-light rounded-xl p-4 text-center">
                <p className="font-body text-text-light text-sm">Totaalbedrag</p>
                <p className="font-display text-4xl text-water-deep">€{totaalEuro}</p>
                <p className="font-body text-text-light text-xs mt-1">
                  {aantalPersonen} × €{(gekozenDienst.prijs / 100).toFixed(0)} p.p.
                </p>
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStap(2)}
                  className="text-text-light font-body hover:text-text-primary transition-colors"
                  data-testid="stap-3-terug"
                >
                  Terug
                </button>
                <button
                  onClick={() => setStap(4)}
                  className="bg-water text-white px-8 py-3 rounded-lg font-body font-medium hover:bg-water-deep transition-colors"
                  data-testid="stap-3-volgende"
                >
                  Volgende
                </button>
              </div>
            </div>
          )}

          {/* Stap 4: Klantgegevens */}
          {stap === 4 && (
            <div data-testid="stap-4-gegevens">
              <h2 className="font-display text-2xl text-text-primary mb-6">Uw gegevens</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="naam" className="block font-body text-sm font-medium text-text-primary mb-1">
                    Naam *
                  </label>
                  <input
                    id="naam"
                    type="text"
                    required
                    value={klantData.naam}
                    onChange={(e) => setKlantData({ ...klantData, naam: e.target.value })}
                    className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm text-text-primary focus:outline-none focus:border-water"
                    data-testid="gegevens-naam"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block font-body text-sm font-medium text-text-primary mb-1">
                    E-mailadres *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={klantData.email}
                    onChange={(e) => setKlantData({ ...klantData, email: e.target.value })}
                    className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm text-text-primary focus:outline-none focus:border-water"
                    data-testid="gegevens-email"
                  />
                </div>
                <div>
                  <label htmlFor="telefoon" className="block font-body text-sm font-medium text-text-primary mb-1">
                    Telefoonnummer
                  </label>
                  <input
                    id="telefoon"
                    type="tel"
                    value={klantData.telefoon}
                    onChange={(e) => setKlantData({ ...klantData, telefoon: e.target.value })}
                    className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm text-text-primary focus:outline-none focus:border-water"
                    data-testid="gegevens-telefoon"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStap(3)}
                  className="text-text-light font-body hover:text-text-primary transition-colors"
                  data-testid="stap-4-terug"
                >
                  Terug
                </button>
                <button
                  onClick={() => setStap(5)}
                  disabled={!klantData.naam || !klantData.email}
                  className="bg-water text-white px-8 py-3 rounded-lg font-body font-medium hover:bg-water-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="stap-4-volgende"
                >
                  Overzicht
                </button>
              </div>
            </div>
          )}

          {/* Stap 5: Betaaloverzicht */}
          {stap === 5 && gekozenDienst && gekozenDatum && (
            <div data-testid="stap-5-overzicht">
              <h2 className="font-display text-2xl text-text-primary mb-6">Bevestig uw boeking</h2>
              <div className="space-y-3 mb-6">
                <OverzichtRegel label="Dienst" waarde={gekozenDienst.naam} />
                <OverzichtRegel
                  label="Datum"
                  waarde={format(gekozenDatum, 'd MMMM yyyy', { locale: nl })}
                />
                <OverzichtRegel
                  label="Aantal personen"
                  waarde={`${aantalPersonen} ${aantalPersonen === 1 ? 'persoon' : 'personen'}`}
                />
                <OverzichtRegel label="Naam" waarde={klantData.naam} />
                <OverzichtRegel label="E-mail" waarde={klantData.email} />
                {klantData.telefoon && <OverzichtRegel label="Telefoon" waarde={klantData.telefoon} />}
                <div className="border-t border-mist pt-3">
                  <OverzichtRegel label="Totaal" waarde={`€${totaalEuro}`} highlight />
                </div>
              </div>
              {foutmelding && (
                <p className="text-red-600 font-body text-sm mb-4 bg-red-50 px-4 py-3 rounded-lg">
                  {foutmelding}
                </p>
              )}
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setStap(4)}
                  className="text-text-light font-body hover:text-text-primary transition-colors"
                  data-testid="stap-5-terug"
                >
                  Terug
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="bg-water text-white px-8 py-3 rounded-lg font-body font-medium hover:bg-water-deep transition-colors disabled:opacity-50 flex items-center gap-2"
                  data-testid="stap-5-betalen"
                >
                  {isLoading ? 'Moment...' : 'Veilig betalen via iDEAL'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

function OverzichtRegel({
  label,
  waarde,
  highlight = false,
}: {
  label: string
  waarde: string
  highlight?: boolean
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="font-body text-text-light text-sm">{label}</span>
      <span
        className={`font-body text-sm ${
          highlight ? 'font-semibold text-water-deep text-base' : 'text-text-primary'
        }`}
      >
        {waarde}
      </span>
    </div>
  )
}

export default function BoekenPagina() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-mist pt-20 flex items-center justify-center">
      <p className="font-body text-text-light">Laden...</p>
    </div>}>
      <BoekenFormulier />
    </Suspense>
  )
}
