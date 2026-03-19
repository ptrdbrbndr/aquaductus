'use client'

import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'

export default function AdminBeschikbaarheid() {
  const [geselecteerdeDatum, setGeselecteerdeDatum] = useState<Date | undefined>()
  const [dienstSlug, setDienstSlug] = useState('recreatief-zeilen')
  const [maxPlaatsen, setMaxPlaatsen] = useState(8)
  const [bericht, setBericht] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function blokkeerDatum() {
    if (!geselecteerdeDatum) return
    setIsLoading(true)
    setBericht('')

    const res = await fetch('/api/admin/beschikbaarheid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        datum: format(geselecteerdeDatum, 'yyyy-MM-dd'),
        dienstSlug,
        geblokkeerd: true,
        maxPlaatsen,
      }),
    })

    const data = await res.json()
    setBericht(res.ok ? 'Datum geblokkeerd.' : (data.fout ?? 'Fout opgetreden.'))
    setIsLoading(false)
  }

  async function vrijgevenDatum() {
    if (!geselecteerdeDatum) return
    setIsLoading(true)
    setBericht('')

    const res = await fetch('/api/admin/beschikbaarheid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        datum: format(geselecteerdeDatum, 'yyyy-MM-dd'),
        dienstSlug,
        geblokkeerd: false,
        maxPlaatsen,
      }),
    })

    const data = await res.json()
    setBericht(res.ok ? 'Datum vrijgegeven.' : (data.fout ?? 'Fout opgetreden.'))
    setIsLoading(false)
  }

  return (
    <main className="min-h-screen bg-mist pt-20 pb-16" data-testid="admin-beschikbaarheid">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="font-display text-3xl text-text-primary mb-6">Beschikbaarheid beheren</h1>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="dienst" className="block font-body text-sm font-medium text-text-primary mb-1">
                Dienst
              </label>
              <select
                id="dienst"
                value={dienstSlug}
                onChange={(e) => setDienstSlug(e.target.value)}
                className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm"
                data-testid="beschikbaarheid-dienst"
              >
                <option value="recreatief-zeilen">Recreatief zeilen</option>
                <option value="coachingssessie">Coachingssessie</option>
                <option value="teambuilding">Teambuilding</option>
              </select>
            </div>
            <div>
              <label htmlFor="maxPlaatsen" className="block font-body text-sm font-medium text-text-primary mb-1">
                Max. plaatsen
              </label>
              <input
                id="maxPlaatsen"
                type="number"
                min={1}
                max={50}
                value={maxPlaatsen}
                onChange={(e) => setMaxPlaatsen(parseInt(e.target.value, 10))}
                className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm"
                data-testid="beschikbaarheid-max"
              />
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <DayPicker
              mode="single"
              selected={geselecteerdeDatum}
              onSelect={setGeselecteerdeDatum}
              locale={nl}
              disabled={{ before: new Date() }}
            />
          </div>

          {geselecteerdeDatum && (
            <p className="text-center font-body text-water font-medium mb-4">
              Geselecteerd: {format(geselecteerdeDatum, 'd MMMM yyyy', { locale: nl })}
            </p>
          )}

          {bericht && (
            <p className="font-body text-sm bg-mist px-4 py-3 rounded-lg mb-4 text-center">{bericht}</p>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={blokkeerDatum}
              disabled={!geselecteerdeDatum || isLoading}
              className="bg-red-500 text-white px-6 py-3 rounded-lg font-body font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
              data-testid="beschikbaarheid-blokkeer"
            >
              Blokkeer datum
            </button>
            <button
              onClick={vrijgevenDatum}
              disabled={!geselecteerdeDatum || isLoading}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-body font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
              data-testid="beschikbaarheid-vrijgeven"
            >
              Vrijgeven
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
