'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPagina() {
  const [email, setEmail] = useState('')
  const [verzonden, setVerzonden] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [foutmelding, setFoutmelding] = useState('')

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setFoutmelding('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setFoutmelding('Er is een fout opgetreden. Controleer uw e-mailadres.')
    } else {
      setVerzonden(true)
    }
    setIsLoading(false)
  }

  return (
    <main className="min-h-screen bg-mist flex items-center justify-center px-4 pt-16" data-testid="login-pagina">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-text-primary mb-2">Inloggen</h1>
          <p className="font-body text-text-light text-sm">
            Voer uw e-mailadres in. U ontvangt een magische link om in te loggen.
          </p>
        </div>

        {verzonden ? (
          <div className="text-center" data-testid="magic-link-verzonden">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="font-display text-xl text-text-primary mb-2">Controleer uw inbox</h2>
            <p className="font-body text-text-light text-sm">
              We hebben een magische link verstuurd naar <strong>{email}</strong>.
              Klik op de link in de e-mail om in te loggen.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" data-testid="login-formulier">
            <div>
              <label htmlFor="email" className="block font-body text-sm font-medium text-text-primary mb-1">
                E-mailadres
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="uw@email.nl"
                className="w-full border border-mist rounded-lg px-4 py-3 font-body text-sm text-text-primary focus:outline-none focus:border-water"
                data-testid="login-email"
              />
            </div>
            {foutmelding && (
              <p className="text-red-600 font-body text-sm">{foutmelding}</p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-water text-white py-3 rounded-lg font-body font-medium hover:bg-water-deep transition-colors disabled:opacity-50"
              data-testid="login-submit"
            >
              {isLoading ? 'Verzenden...' : 'Stuur magische link'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
