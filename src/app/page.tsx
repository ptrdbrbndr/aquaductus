import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Review } from '@/lib/types'

const FOTO_GRID = [
  '/foto-1.jpg', '/foto-2.jpg', '/foto-3.jpg',
  '/foto-4.jpg', '/foto-5.jpg', '/foto-6.jpg',
  '/foto-7.jpg', '/foto-8.jpg', '/foto-9.jpg',
]

const DIENSTEN_DATA = [
  {
    slug: 'recreatief-zeilen',
    naam: 'Recreatief zeilen',
    beschrijving: 'Geniet van de vrijheid op het water. Voor families, koppels en vriendengroepen. Geen ervaring vereist — wij zorgen voor een veilige en memorabele vaartocht.',
    prijs: '€75',
    duur: '4 uur',
    personen: 'max. 8 personen',
    afbeelding: '/dienst-zeilen.jpg',
  },
  {
    slug: 'coachingssessie',
    naam: 'Coachingssessie',
    beschrijving: 'Het water als spiegel. Persoonlijke coaching waarbij zeilen de metafoor is voor leiderschap, balans en richting. Intensief en inzichtgevend.',
    prijs: '€150',
    duur: '3 uur',
    personen: '1–2 personen',
    afbeelding: '/dienst-coaching.jpg',
  },
  {
    slug: 'teambuilding',
    naam: 'Teambuilding',
    beschrijving: 'Versterk de samenwerking, communicatie en het vertrouwen binnen uw team op de Randmeren. Inclusief evaluatie en reflectie aan wal.',
    prijs: '€95',
    duur: '6 uur',
    personen: 'max. 16 personen',
    afbeelding: '/dienst-teambuilding.jpg',
  },
]

async function getGoedgekeurdeReviews(): Promise<Review[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('goedgekeurd', true)
      .order('created_at', { ascending: false })
      .limit(6)
    return data ?? []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const reviews = await getGoedgekeurdeReviews()

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Aquaductus',
    description: "Zeilen, coaching en teambuilding op de Randmeren vanuit Jachthaven 't Raboes in Harderwijk.",
    address: {
      '@type': 'PostalAddress',
      streetAddress: "Jachthaven 't Raboes",
      addressLocality: 'Harderwijk',
      addressCountry: 'NL',
    },
    telephone: '+31612345678',
    email: 'info@aquaductus.nl',
    priceRange: '€€',
    url: 'https://aquaductus.nl',
    image: 'https://aquaductus.nl/hero-bg.jpg',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero */}
      <section
        className="relative min-h-screen flex items-center justify-center"
        data-testid="hero-sectie"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.jpg"
            alt="Aquaductus zeilen op de Randmeren"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-water-deep/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <p className="font-body text-sand text-sm tracking-widest uppercase mb-4">
            Jachthaven &apos;t Raboes, Harderwijk
          </p>
          <h1 className="font-display text-5xl sm:text-7xl font-semibold mb-6 leading-tight">
            Vaar mee op de Aquaductus
          </h1>
          <p className="font-body text-lg sm:text-xl text-white/90 mb-10 max-w-xl mx-auto">
            Recreatief zeilen, persoonlijke coaching en teambuilding op de Randmeren.
            Ontdek wat het water met je doet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#diensten"
              className="bg-white text-water-deep px-8 py-3 rounded-lg font-body font-medium hover:bg-sand-light transition-colors"
              data-testid="hero-bekijk-aanbod"
            >
              Bekijk het aanbod
            </Link>
            <Link
              href="/boeken"
              className="bg-water border-2 border-white text-white px-8 py-3 rounded-lg font-body font-medium hover:bg-water-deep transition-colors"
              data-testid="hero-plan-tocht"
            >
              Plan een tocht
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Diensten */}
      <section id="diensten" className="py-20 bg-white" data-testid="diensten-sectie">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="font-body text-water text-sm tracking-widest uppercase mb-3">Wat wij bieden</p>
            <h2 className="font-display text-4xl sm:text-5xl text-text-primary">Ons aanbod</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DIENSTEN_DATA.map((dienst) => (
              <div
                key={dienst.slug}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                data-testid={`dienst-kaart-${dienst.slug}`}
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={dienst.afbeelding}
                    alt={dienst.naam}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl text-text-primary mb-2">{dienst.naam}</h3>
                  <p className="font-body text-text-light text-sm mb-4 leading-relaxed">{dienst.beschrijving}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="bg-sand-light text-sand text-xs font-body px-3 py-1 rounded-full">
                      {dienst.prijs} p.p.
                    </span>
                    <span className="bg-mist text-text-light text-xs font-body px-3 py-1 rounded-full">
                      {dienst.duur}
                    </span>
                    <span className="bg-mist text-text-light text-xs font-body px-3 py-1 rounded-full">
                      {dienst.personen}
                    </span>
                  </div>
                  <Link
                    href={`/boeken?dienst=${dienst.slug}`}
                    className="block text-center bg-water text-white py-2 rounded-lg font-body text-sm font-medium hover:bg-water-deep transition-colors"
                    data-testid={`dienst-boeken-${dienst.slug}`}
                  >
                    Boek nu
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fotogalerie */}
      <section className="py-20 bg-mist" data-testid="galerie-sectie">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="font-body text-water text-sm tracking-widest uppercase mb-3">Belevenissen</p>
            <h2 className="font-display text-4xl sm:text-5xl text-text-primary">Ervaringen op het water</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FOTO_GRID.map((foto, idx) => (
              <div
                key={idx}
                className="relative aspect-square overflow-hidden rounded-xl"
                data-testid={`galerie-foto-${idx + 1}`}
              >
                <Image
                  src={foto}
                  alt={`Aquaductus ervaring ${idx + 1}`}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Over ons */}
      <section className="py-20 bg-white" data-testid="over-ons-sectie">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-80 lg:h-full rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/boot-haven.jpg"
                alt="Aquaductus in de jachthaven van Harderwijk"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-body text-water text-sm tracking-widest uppercase mb-3">Ons verhaal</p>
              <h2 className="font-display text-4xl sm:text-5xl text-text-primary mb-6">
                Passie voor zeilen en mensen
              </h2>
              <p className="font-body text-text-light mb-4 leading-relaxed">
                Vanuit Jachthaven &apos;t Raboes in Harderwijk varen wij al jaren op de Randmeren.
                De Aquaductus is meer dan een boot — het is een plek waar mensen zichzelf ontdekken,
                verbinden en tot rust komen.
              </p>
              <p className="font-body text-text-light mb-4 leading-relaxed">
                Als gecertificeerde zeiler en coach combineer ik mijn passie voor het water met
                jarenlange ervaring in persoonlijke begeleiding en teamontwikkeling.
              </p>
              <p className="font-body text-text-light mb-8 leading-relaxed">
                Of je nu wilt ontspannen, groeien of je team wilt versterken — op het water
                vinden we samen de weg.
              </p>
              <Link
                href="/boeken"
                className="inline-block bg-water text-white px-8 py-3 rounded-lg font-body font-medium hover:bg-water-deep transition-colors"
                data-testid="over-ons-cta"
              >
                Plan een kennismaking
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="py-20 bg-sand-light" data-testid="reviews-sectie">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <p className="font-body text-water text-sm tracking-widest uppercase mb-3">Ervaringen</p>
              <h2 className="font-display text-4xl sm:text-5xl text-text-primary">Wat deelnemers zeggen</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-xl p-6 shadow-sm"
                  data-testid="review-kaart"
                >
                  <div className="flex mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'text-sand' : 'text-mist'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="font-body text-text-light text-sm leading-relaxed mb-4">&ldquo;{review.tekst}&rdquo;</p>
                  <p className="font-body font-medium text-text-primary text-sm">— {review.klant_naam}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Beschikbaarheidskalender CTA */}
      <section className="py-20 bg-water-deep text-white" data-testid="beschikbaarheid-sectie">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="font-body text-sand text-sm tracking-widest uppercase mb-4">Plannen</p>
          <h2 className="font-display text-4xl sm:text-5xl mb-6">
            Wanneer ga jij varen?
          </h2>
          <p className="font-body text-white/80 text-lg mb-10 max-w-xl mx-auto">
            Bekijk de beschikbare data en boek direct online. Beperkte plekken beschikbaar.
          </p>
          <Link
            href="/boeken"
            className="inline-block bg-white text-water-deep px-10 py-4 rounded-lg font-body font-medium text-lg hover:bg-sand-light transition-colors"
            data-testid="beschikbaarheid-cta"
          >
            Bekijk beschikbaarheid
          </Link>
        </div>
      </section>

      {/* Contactformulier */}
      <section id="contact" className="py-20 bg-white" data-testid="contact-sectie">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="font-body text-water text-sm tracking-widest uppercase mb-3">Neem contact op</p>
            <h2 className="font-display text-4xl sm:text-5xl text-text-primary mb-4">Een vraag?</h2>
            <p className="font-body text-text-light">
              Stuur ons een bericht en we reageren binnen 24 uur.
            </p>
          </div>
          <ContactFormulier />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-text-primary text-white py-12" data-testid="footer">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-display text-2xl mb-3">Aquaductus</h3>
              <p className="font-body text-white/60 text-sm leading-relaxed">
                Zeilen, coaching en teambuilding op de Randmeren vanuit Harderwijk.
              </p>
            </div>
            <div>
              <h4 className="font-body font-semibold mb-3 text-sm uppercase tracking-wider">Navigatie</h4>
              <ul className="space-y-2">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/#diensten', label: 'Diensten' },
                  { href: '/boeken', label: 'Boeken' },
                  { href: '/cadeaubon', label: 'Cadeaubon' },
                  { href: '/blog', label: 'Blog' },
                  { href: '/b2b', label: 'Bedrijven' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-body text-white/60 text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-body font-semibold mb-3 text-sm uppercase tracking-wider">Contact</h4>
              <ul className="space-y-2 font-body text-white/60 text-sm">
                <li>
                  <a href="mailto:info@aquaductus.nl" className="hover:text-white transition-colors">
                    info@aquaductus.nl
                  </a>
                </li>
                <li>
                  <a href="tel:+31612345678" className="hover:text-white transition-colors">
                    +31 6 12 34 56 78
                  </a>
                </li>
                <li>Jachthaven &apos;t Raboes</li>
                <li>Harderwijk</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-body text-white/40 text-sm">
              &copy; {new Date().getFullYear()} Aquaductus. Alle rechten voorbehouden.
            </p>
            <div className="flex gap-4">
              <Link href="/privacy" className="font-body text-white/40 text-sm hover:text-white transition-colors">
                Privacybeleid
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

function ContactFormulier() {
  return (
    <form
      action="/api/contact"
      method="POST"
      className="space-y-4"
      data-testid="contact-formulier"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="naam" className="block font-body text-sm font-medium text-text-primary mb-1">
            Naam
          </label>
          <input
            id="naam"
            name="naam"
            type="text"
            required
            className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm text-text-primary focus:outline-none focus:border-water"
            data-testid="contact-naam"
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-body text-sm font-medium text-text-primary mb-1">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm text-text-primary focus:outline-none focus:border-water"
            data-testid="contact-email"
          />
        </div>
      </div>
      <div>
        <label htmlFor="telefoon" className="block font-body text-sm font-medium text-text-primary mb-1">
          Telefoon
        </label>
        <input
          id="telefoon"
          name="telefoon"
          type="tel"
          className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm text-text-primary focus:outline-none focus:border-water"
          data-testid="contact-telefoon"
        />
      </div>
      <div>
        <label htmlFor="dienst" className="block font-body text-sm font-medium text-text-primary mb-1">
          Interesse in
        </label>
        <select
          id="dienst"
          name="dienst"
          className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm text-text-primary focus:outline-none focus:border-water"
          data-testid="contact-dienst"
        >
          <option value="">Kies een dienst (optioneel)</option>
          <option value="recreatief-zeilen">Recreatief zeilen</option>
          <option value="coachingssessie">Coachingssessie</option>
          <option value="teambuilding">Teambuilding</option>
          <option value="overig">Overig</option>
        </select>
      </div>
      <div>
        <label htmlFor="bericht" className="block font-body text-sm font-medium text-text-primary mb-1">
          Bericht
        </label>
        <textarea
          id="bericht"
          name="bericht"
          rows={5}
          required
          className="w-full border border-mist rounded-lg px-4 py-2 font-body text-sm text-text-primary focus:outline-none focus:border-water resize-none"
          data-testid="contact-bericht"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-water text-white py-3 rounded-lg font-body font-medium hover:bg-water-deep transition-colors"
        data-testid="contact-submit"
      >
        Verstuur bericht
      </button>
    </form>
  )
}
