'use client'

import { useState } from 'react'

export default function B2bPagina() {
  const [form, setForm] = useState({
    bedrijfsnaam: '',
    contactpersoon: '',
    email: '',
    datums: '',
    aantalDeelnemers: '',
    budget: '',
    bijzonderheden: '',
  })
  const [bericht, setBericht] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setBericht('')

    const res = await fetch('/api/b2b/aanvraag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      setBericht('Uw aanvraag is ontvangen. We nemen zo snel mogelijk contact op.')
      setForm({ bedrijfsnaam: '', contactpersoon: '', email: '', datums: '', aantalDeelnemers: '', budget: '', bijzonderheden: '' })
    } else {
      const data = await res.json()
      setBericht(data.fout ?? 'Er is een fout opgetreden.')
    }
    setIsLoading(false)
  }

  return (
    <main className="min-h-screen bg-mist pt-20 pb-16" data-testid="b2b-pagina">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="font-body text-water text-sm tracking-widest uppercase mb-3">Voor bedrijven</p>
          <h1 className="font-display text-4xl sm:text-5xl text-text-primary mb-4">
            Maatwerk voor uw team
          </h1>
          <p className="font-body text-text-light max-w-lg mx-auto">
            Wij bieden maatwerkprogramma&apos;s voor bedrijven. Teambuilding, leiderschapstraining of
            een ontspannen bedrijfsuitje — we denken graag met u mee.
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bedrijfsnaam" className="block font-body text-sm font-medium text-text-primary mb-1">
                    Bedrijfsnaam *
                  </label>
                  <input
                    id="bedrijfsnaam"
                    name="bedrijfsnaam"
                    type="text"
                    required
                    value={form.bedrijfsnaam}
                    onChange={handleChange}
                    className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm"
                    data-testid="b2b-bedrijfsnaam"
                  />
                </div>
                <div>
                  <label htmlFor="contactpersoon" className="block font-body text-sm font-medium text-text-primary mb-1">
                    Contactpersoon *
                  </label>
                  <input
                    id="contactpersoon"
                    name="contactpersoon"
                    type="text"
                    required
                    value={form.contactpersoon}
                    onChange={handleChange}
                    className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm"
                    data-testid="b2b-contactpersoon"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block font-body text-sm font-medium text-text-primary mb-1">
                  E-mailadres *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm"
                  data-testid="b2b-email"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="datums" className="block font-body text-sm font-medium text-text-primary mb-1">
                    Gewenste datum(s)
                  </label>
                  <input
                    id="datums"
                    name="datums"
                    type="text"
                    value={form.datums}
                    onChange={handleChange}
                    placeholder="bijv. mei of juni 2026"
                    className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm"
                    data-testid="b2b-datums"
                  />
                </div>
                <div>
                  <label htmlFor="aantalDeelnemers" className="block font-body text-sm font-medium text-text-primary mb-1">
                    Aantal deelnemers
                  </label>
                  <input
                    id="aantalDeelnemers"
                    name="aantalDeelnemers"
                    type="number"
                    min={2}
                    value={form.aantalDeelnemers}
                    onChange={handleChange}
                    className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm"
                    data-testid="b2b-deelnemers"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="budget" className="block font-body text-sm font-medium text-text-primary mb-1">
                  Budget indicatie
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm"
                  data-testid="b2b-budget"
                >
                  <option value="">Selecteer een range</option>
                  <option value="500-1000">€500 – €1.000</option>
                  <option value="1000-2500">€1.000 – €2.500</option>
                  <option value="2500-5000">€2.500 – €5.000</option>
                  <option value="5000+">€5.000+</option>
                  <option value="overleg">Nader te bepalen</option>
                </select>
              </div>

              <div>
                <label htmlFor="bijzonderheden" className="block font-body text-sm font-medium text-text-primary mb-1">
                  Bijzonderheden of wensen
                </label>
                <textarea
                  id="bijzonderheden"
                  name="bijzonderheden"
                  value={form.bijzonderheden}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm resize-none"
                  data-testid="b2b-bijzonderheden"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-water text-white py-3 rounded-lg font-body font-medium hover:bg-water-deep transition-colors disabled:opacity-50"
                data-testid="b2b-submit"
              >
                {isLoading ? 'Versturen...' : 'Verstuur aanvraag'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
