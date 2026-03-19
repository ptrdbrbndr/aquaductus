import Link from 'next/link'

export default function BetalingAnnuleerPagina() {
  return (
    <main className="min-h-screen bg-mist flex items-center justify-center px-4" data-testid="betaling-annuleer">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="font-display text-3xl text-text-primary mb-3">Betaling geannuleerd</h1>
        <p className="font-body text-text-light mb-8">
          Uw betaling is niet voltooid. Uw boeking is niet bevestigd. U kunt het opnieuw proberen of contact met ons opnemen.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/boeken"
            className="bg-water text-white px-6 py-3 rounded-lg font-body font-medium hover:bg-water-deep transition-colors"
            data-testid="annuleer-opnieuw"
          >
            Opnieuw proberen
          </Link>
          <Link
            href="/#contact"
            className="border border-water text-water px-6 py-3 rounded-lg font-body font-medium hover:bg-mist transition-colors"
            data-testid="annuleer-contact"
          >
            Contact opnemen
          </Link>
        </div>
      </div>
    </main>
  )
}
