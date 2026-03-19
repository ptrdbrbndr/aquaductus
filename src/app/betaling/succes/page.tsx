import Link from 'next/link'

export default function BetalingSuccesPagina() {
  return (
    <main className="min-h-screen bg-mist flex items-center justify-center px-4" data-testid="betaling-succes">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-display text-3xl text-text-primary mb-3">Betaling geslaagd!</h1>
        <p className="font-body text-text-light mb-2">
          Bedankt voor uw boeking bij Aquaductus.
        </p>
        <p className="font-body text-text-light mb-8">
          U ontvangt binnen enkele minuten een bevestigingsmail. We kijken ernaar uit u te verwelkomen op het water!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-water text-white px-6 py-3 rounded-lg font-body font-medium hover:bg-water-deep transition-colors"
            data-testid="succes-naar-home"
          >
            Terug naar home
          </Link>
          <Link
            href="/portal"
            className="border border-water text-water px-6 py-3 rounded-lg font-body font-medium hover:bg-mist transition-colors"
            data-testid="succes-naar-portal"
          >
            Mijn boekingen
          </Link>
        </div>
      </div>
    </main>
  )
}
