import { createAdminClient } from '@/lib/supabase/server'

export default async function AdminCoaching() {
  const supabase = await createAdminClient()

  const { data: trajecten } = await supabase
    .from('coaching_trajecten')
    .select('*, coaching_sessies(id, datum, verslag_encrypted)')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-mist pt-20 pb-16" data-testid="admin-coaching">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="font-display text-3xl text-text-primary mb-6">Coaching beheer</h1>

        <div className="space-y-6">
          {!trajecten || trajecten.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center">
              <p className="font-body text-text-light">Geen actieve trajecten.</p>
            </div>
          ) : (
            trajecten.map((traject) => {
              const sessies = (traject as { coaching_sessies?: Array<{ id: string; datum: string | null; verslag_encrypted: string | null }> }).coaching_sessies ?? []
              return (
                <div key={traject.id} className="bg-white rounded-2xl shadow-sm p-6" data-testid="admin-traject">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="font-body font-semibold text-text-primary">{traject.naam}</h2>
                      <p className="font-body text-text-light text-sm">
                        Status: <span className="capitalize">{traject.status}</span>
                      </p>
                    </div>
                    <span className={`text-xs font-body px-3 py-1 rounded-full ${
                      traject.status === 'actief' ? 'bg-green-100 text-green-700' :
                      'bg-mist text-text-light'
                    }`}>
                      {traject.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-body text-sm font-medium mb-2">
                      Sessies ({sessies.length})
                    </h3>
                    {sessies.map((sessie) => (
                      <div key={sessie.id} className="flex justify-between items-center bg-mist rounded-lg px-4 py-2 mb-2">
                        <span className="font-body text-sm">{sessie.datum ?? 'Niet gepland'}</span>
                        <span className="font-body text-xs text-text-light">
                          {sessie.verslag_encrypted ? 'Verslag aanwezig' : 'Geen verslag'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </main>
  )
}
