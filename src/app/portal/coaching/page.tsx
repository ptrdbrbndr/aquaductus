import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function CoachingPortal() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: trajecten } = await supabase
    .from('coaching_trajecten')
    .select('*, coaching_sessies(id, datum, created_at)')
    .eq('klant_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div data-testid="coaching-portal">
      <h1 className="font-display text-3xl text-text-primary mb-6">Mijn coaching</h1>

      {!trajecten || trajecten.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center">
          <p className="font-body text-text-light mb-4">
            U heeft nog geen actief coachingstraject.
          </p>
          <Link
            href="/coaching/intake"
            className="bg-water text-white px-6 py-3 rounded-lg font-body font-medium hover:bg-water-deep transition-colors"
            data-testid="coaching-start-intake"
          >
            Start een intake
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {trajecten.map((traject) => {
            const sessies = (traject as { coaching_sessies?: Array<{ id: string; datum: string | null }> }).coaching_sessies ?? []
            return (
              <div key={traject.id} className="bg-white rounded-2xl shadow-sm p-6" data-testid="traject-item">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="font-body font-semibold text-text-primary">{traject.naam}</h2>
                    <p className="font-body text-text-light text-sm mt-1">
                      Status: <span className="capitalize">{traject.status}</span>
                    </p>
                  </div>
                  <span className={`text-xs font-body px-3 py-1 rounded-full ${
                    traject.status === 'actief' ? 'bg-green-100 text-green-700' :
                    traject.status === 'afgerond' ? 'bg-mist text-text-light' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {traject.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-body text-sm font-medium text-text-primary mb-2">
                    Sessies ({sessies.length})
                  </h3>
                  {sessies.length === 0 ? (
                    <p className="font-body text-text-light text-sm">Nog geen sessies gepland.</p>
                  ) : (
                    <div className="space-y-2">
                      {sessies.map((sessie) => (
                        <div key={sessie.id} className="flex justify-between items-center bg-mist rounded-lg px-4 py-2">
                          <span className="font-body text-sm text-text-primary">
                            {sessie.datum ?? 'Datum niet gepland'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
