import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'Aquaductus — Zeilen, coaching en teambuilding in Harderwijk',
  description:
    "Recreatief zeilen, coachingssessies en teambuilding op de Randmeren vanuit Jachthaven 't Raboes in Harderwijk.",
  openGraph: {
    title: 'Aquaductus — Zeilen, coaching en teambuilding in Harderwijk',
    description:
      "Recreatief zeilen, coachingssessies en teambuilding op de Randmeren vanuit Jachthaven 't Raboes in Harderwijk.",
    url: 'https://aquaductus.nl',
    siteName: 'Aquaductus',
    locale: 'nl_NL',
    type: 'website',
  },
  metadataBase: new URL('https://aquaductus.nl'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className="antialiased">
        <Nav />
        {children}
      </body>
    </html>
  )
}
