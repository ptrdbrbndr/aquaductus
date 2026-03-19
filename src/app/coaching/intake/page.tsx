'use client'

import { useState } from 'react'

export default function CoachingIntake() {
  const [form, setForm] = useState({
    naam: '',
    email: '',
    motivatie: '',
    doelen: '',
    beschikbaarheid: '',
    aandachtspunten: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [bericht, setBericht] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    const res = await fetch('/api/coaching/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      setBericht('Uw intakeformulier is ontvangen. We nemen binnen 2 werkdagen contact op.')
    } else {
      const data = await res.json()
      setBericht(data.fout ?? 'Er is een fout opgetreden.')
    }
    setIsLoading(false)
  }

  return (
    <main className="min-h-screen bg-mist pt-20 pb-16" data-testid="coaching-intake">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="font-body text-water text-sm tracking-widest uppercase mb-3">Coachingstraject</p>
          <h1 className="font-display text-4xl text-text-primary mb-4">Intakeformulier</h1>
          <p className="font-body text-text-light">
            Vertel ons iets over uzelf zodat we een passend coachingstraject kunnen samenstellen.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {bericht ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-body text-text-primary">{bericht}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="naam" className="block font-body text-sm font-medium text-text-primary mb-1">
                    Naam *
                  </label>
                  <input
                    id="naam"
                    name="naam"
                    type="text"
                    required
                    value={form.naam}
                    onChange={handleChange}
                    className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm"
                    data-testid="intake-naam"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block font-body text-sm font-medium text-text-primary mb-1">
                    E-mail *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm"
                    data-testid="intake-email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="motivatie" className="block font-body text-sm font-medium text-text-primary mb-1">
                  Waarom kiest u voor coaching? *
                </label>
                <textarea
                  id="motivatie"
                  name="motivatie"
                  required
                  value={form.motivatie}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm resize-none"
                  data-testid="intake-motivatie"
                />
              </div>

              <div>
                <label htmlFor="doelen" className="block font-body text-sm font-medium text-text-primary mb-1">
                  Wat zijn uw doelen? *
                </label>
                <textarea
                  id="doelen"
                  name="doelen"
                  required
                  value={form.doelen}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm resize-none"
                  data-testid="intake-doelen"
                />
              </div>

              <div>
                <label htmlFor="beschikbaarheid" className="block font-body text-sm font-medium text-text-primary mb-1">
                  Uw beschikbaarheid
                </label>
                <input
                  id="beschikbaarheid"
                  name="beschikbaarheid"
                  type="text"
                  value={form.beschikbaarheid}
                  onChange={handleChange}
                  placeholder="bijv. weekenden, doordeweeks na 17u"
                  className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm"
                  data-testid="intake-beschikbaarheid"
                />
              </div>

              <div>
                <label htmlFor="aandachtspunten" className="block font-body text-sm font-medium text-text-primary mb-1">
                  Aandachtspunten of bijzonderheden
                </label>
                <textarea
                  id="aandachtspunten"
                  name="aandachtspunten"
                  value={form.aandachtspunten}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm resize-none"
                  data-testid="intake-aandachtspunten"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-water text-white py-3 rounded-lg font-body font-medium hover:bg-water-deep transition-colors disabled:opacity-50"
                data-testid="intake-submit"
              >
                {isLoading ? 'Versturen...' : 'Stuur intakeformulier'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
