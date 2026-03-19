import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-mist pt-16">
      <div className="bg-white border-b border-mist">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-6 py-4 overflow-x-auto">
            <Link
              href="/portal"
              className="font-body text-sm text-text-primary hover:text-water whitespace-nowrap"
              data-testid="portal-nav-home"
            >
              Dashboard
            </Link>
            <Link
              href="/portal/boekingen"
              className="font-body text-sm text-text-primary hover:text-water whitespace-nowrap"
              data-testid="portal-nav-boekingen"
            >
              Mijn boekingen
            </Link>
            <Link
              href="/portal/coaching"
              className="font-body text-sm text-text-primary hover:text-water whitespace-nowrap"
              data-testid="portal-nav-coaching"
            >
              Coaching
            </Link>
            <Link
              href="/portal/reviews"
              className="font-body text-sm text-text-primary hover:text-water whitespace-nowrap"
              data-testid="portal-nav-reviews"
            >
              Reviews
            </Link>
            <form action="/api/auth/uitloggen" method="POST" className="ml-auto">
              <button
                type="submit"
                className="font-body text-sm text-text-light hover:text-red-500 whitespace-nowrap"
                data-testid="portal-uitloggen"
              >
                Uitloggen
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </div>
    </div>
  )
}
