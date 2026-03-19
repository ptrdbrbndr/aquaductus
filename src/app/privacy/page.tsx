export const metadata = {
  title: 'Privacybeleid — Aquaductus',
}

export default function PrivacyPagina() {
  return (
    <main className="min-h-screen bg-white pt-20 pb-16" data-testid="privacy-pagina">
      <article className="max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="font-display text-4xl text-text-primary mb-6">Privacybeleid</h1>
        <p className="font-body text-text-light text-sm mb-8">Laatst bijgewerkt: maart 2026</p>

        <div className="space-y-8 font-body text-text-primary">
          <section>
            <h2 className="font-display text-2xl mb-3">1. Wie zijn wij?</h2>
            <p className="text-text-light leading-relaxed">
              Aquaductus is een zeilen- en coachingsbedrijf gevestigd in Harderwijk, Nederland.
              Wij zijn verantwoordelijk voor de verwerking van uw persoonsgegevens zoals beschreven in dit privacybeleid.
              Contactgegevens: info@aquaductus.nl
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">2. Welke gegevens verwerken wij?</h2>
            <ul className="list-disc list-inside text-text-light space-y-2 leading-relaxed">
              <li>Naam, e-mailadres en telefoonnummer (bij boeking of contact)</li>
              <li>Betalingsinformatie (verwerkt via Stripe — wij slaan geen betaalgegevens op)</li>
              <li>Boekingsdetails (datum, dienst, aantal personen)</li>
              <li>Coachingsverslagen (versleuteld opgeslagen, alleen toegankelijk voor coach en klant)</li>
              <li>Reviews en reflecties</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">3. Waarvoor gebruiken wij uw gegevens?</h2>
            <ul className="list-disc list-inside text-text-light space-y-2 leading-relaxed">
              <li>Uitvoeren van uw boeking en betalingsverwerking</li>
              <li>Versturen van bevestigings- en herinneringsmails</li>
              <li>Coachingstrajecten en sessieverslagen</li>
              <li>Wettelijke verplichtingen (fiscale administratie, 7 jaar bewaartermijn)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">4. Bewaartermijnen</h2>
            <p className="text-text-light leading-relaxed">
              Boekingen en betalingsgegevens bewaren wij 7 jaar conform fiscale wetgeving (art. 52 AWR).
              Coachingsverslagen bewaren wij 7 jaar na afloop van het traject.
              Overige gegevens worden verwijderd zodra ze niet meer nodig zijn.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">5. Uw rechten</h2>
            <p className="text-text-light leading-relaxed mb-2">
              Op grond van de AVG heeft u de volgende rechten:
            </p>
            <ul className="list-disc list-inside text-text-light space-y-2 leading-relaxed">
              <li>Recht op inzage in uw persoonsgegevens</li>
              <li>Recht op rectificatie van onjuiste gegevens</li>
              <li>Recht op verwijdering (&apos;recht om vergeten te worden&apos;)</li>
              <li>Recht op beperking van de verwerking</li>
              <li>Recht op dataportabiliteit</li>
              <li>Recht om bezwaar te maken</li>
            </ul>
            <p className="text-text-light mt-3 leading-relaxed">
              Neem contact op via info@aquaductus.nl om een verzoek in te dienen. We reageren binnen 30 dagen.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">6. Beveiliging</h2>
            <p className="text-text-light leading-relaxed">
              Wij nemen passende technische en organisatorische maatregelen om uw persoonsgegevens te beveiligen.
              Coachingsverslagen worden versleuteld opgeslagen (AES-256-GCM).
              Betalingen verlopen uitsluitend via de beveiligde omgeving van Stripe.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">7. Contact</h2>
            <p className="text-text-light leading-relaxed">
              Bij vragen over dit privacybeleid kunt u contact opnemen via:
              <br />
              E-mail: info@aquaductus.nl
              <br />
              U heeft tevens het recht een klacht in te dienen bij de Autoriteit Persoonsgegevens (www.autoriteitpersoonsgegevens.nl).
            </p>
          </section>
        </div>
      </article>
    </main>
  )
}
