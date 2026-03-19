import { createAdminClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'

export default async function AdminBoekingen() {
  const supabase = await createAdminClient()

  const { data: boekingen } = await supabase
    .from('boekingen')
    .select('*, diensten(naam)')
    .order('datum', { ascending: false })

  return (
    <main className="min-h-screen bg-mist pt-20 pb-16" data-testid="admin-boekingen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="font-display text-3xl text-text-primary mb-6">Alle boekingen</h1>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-mist">
                <tr>
                  {['Naam', 'E-mail', 'Telefoon', 'Dienst', 'Datum', 'Pers.', 'Bedrag', 'Status', 'Acties'].map((h) => (
                    <th key={h} className="text-left font-body text-xs text-text-light px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(boekingen ?? []).map((b) => (
                  <tr key={b.id} className="border-b border-mist hover:bg-mist/30 transition-colors" data-testid="admin-boeking-rij">
                    <td className="px-4 py-3 font-body text-sm text-text-primary">{b.gast_naam ?? '—'}</td>
                    <td className="px-4 py-3 font-body text-sm text-text-light">{b.gast_email ?? '—'}</td>
                    <td className="px-4 py-3 font-body text-sm text-text-light">{b.gast_telefoon ?? '—'}</td>
                    <td className="px-4 py-3 font-body text-sm text-text-primary">
                      {(b as { diensten?: { naam?: string } }).diensten?.naam ?? '—'}
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-text-primary">
                      {format(new Date(b.datum), 'd MMM yyyy', { locale: nl })}
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-text-primary text-center">{b.aantal_personen}</td>
                    <td className="px-4 py-3 font-body text-sm text-text-primary">
                      €{(b.totaal_prijs / 100).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-body text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                        b.status === 'bevestigd' ? 'bg-green-100 text-green-700' :
                        b.status === 'betaald' ? 'bg-blue-100 text-blue-700' :
                        b.status === 'geannuleerd' ? 'bg-red-100 text-red-700' :
                        'bg-mist text-text-light'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {b.status === 'betaald' && (
                          <form action={`/api/admin/boekingen/${b.id}/bevestig`} method="POST">
                            <button
                              type="submit"
                              className="bg-green-500 text-white px-2 py-1 rounded font-body text-xs hover:bg-green-600"
                              data-testid="boeking-bevestig"
                            >
                              Bevestig
                            </button>
                          </form>
                        )}
                        {b.status !== 'geannuleerd' && b.status !== 'pending' && (
                          <form action={`/api/admin/boekingen/${b.id}/annuleer`} method="POST">
                            <button
                              type="submit"
                              className="bg-red-100 text-red-600 px-2 py-1 rounded font-body text-xs hover:bg-red-200"
                              data-testid="boeking-annuleer-admin"
                            >
                              Annuleer
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
