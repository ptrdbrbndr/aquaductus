# Aquaductus — Stappenplan

**Doel:** Een coaching- en leisureplatform op het water, vanuit Jachthaven 't Raboes in Harderwijk. Klanten reserveren een zeiltocht, coachingssessie of teambuilding-dag en worden digitaal begeleid van eerste contact tot evaluatie.

---

## Fase 0 — Statische website (huidig)

### 0.1 Branding & design ✅
- Kleurpalet, typografie en huisstijl vastgesteld
- Responsieve HTML-site live op aquaductus.nl

### 0.2 Diensten gepresenteerd ✅
- Recreatief zeilen
- Coachingssessie
- Teambuilding

### 0.3 Contactformulier ✅
- Aanvraagformulier met naam, e-mail en bericht
- Beschikbaarheidskalender (visueel, statisch)

### 0.4 Afbeeldingen & sfeer ✅
- Foto's van boot, omgeving en diensten
- Hero-sectie met sailing-spinnakers

---

## Fase 1 — Online reserveringen

**Doel:** Klanten kunnen zelfstandig een datum kiezen, boeken en betalen.

### 1.1 Boekingssysteem
- [ ] Supabase-backend: tabel `boekingen` met datum, dienst, klantdata
- [ ] RLS: klant ziet alleen eigen boekingen
- [ ] Beschikbaarheidskalender live gekoppeld aan database
- [ ] Capaciteitsbeheer per dag (max. personen per tocht)

### 1.2 Betaling
- [ ] iDEAL-integratie via Stripe
- [ ] Betalingsstatus opgeslagen in `boekingen`
- [ ] Automatische bevestigingsmail na geslaagde betaling (Resend)

### 1.3 Beheer
- [ ] Simpel admin-dashboard: boekingen inzien, bevestigen, annuleren
- [ ] E-mailnotificatie naar Pieter bij nieuwe aanvraag

---

## Fase 2 — Klantportal

**Doel:** Terugkerende klanten hebben een account en overzicht van hun boekingen.

### 2.1 Authenticatie
- [ ] Supabase Auth (magic link / e-mail)
- [ ] Klant kan eigen boekingshistorie inzien
- [ ] Annuleren en omboeken via portal

### 2.2 Reviews & testimonials
- [ ] Na afloop automatisch reviewverzoek per mail
- [ ] Reviews zichtbaar op homepage (na goedkeuring)

### 2.3 Cadeaubonnen
- [ ] Cadeaubon aanmaken en versturen (PDF via Resend)
- [ ] Bon inwisselen bij boeking

---

## Fase 3 — Coachingplatform

**Doel:** Digitale begeleiding voor coachingstrajecten — van intake tot sessieverslagen en voortgang.

### 3.1 Intake & koppeling
- [ ] Intakeformulier bij eerste coachingsboeking
- [ ] Coach koppelen aan klant (Pieter of externe coaches)
- [ ] Sessiekalender per traject

### 3.2 Sessieverslagen (privé)
- [ ] Coach schrijft verslag na elke sessie (Supabase, encrypted at rest)
- [ ] Klant kan eigen verslagen inzien, niet die van anderen
- [ ] RLS strikt: coach ziet alleen eigen klanten

### 3.3 Voortgang & reflectie
- [ ] Klant vult na elke sessie korte reflectievragenlijst in
- [ ] Voortgangsgrafiek zichtbaar in klantportal
- [ ] Exportfunctie: PDF-samenvatting van traject

### 3.4 Groepsprogramma's
- [ ] Thematische zeildagen (bijv. "Leiderschap op het water")
- [ ] Groepsaanmelding met maximaal deelnemers
- [ ] Aparte landingspagina per programma

---

## Fase 4 — Groei & marketing

**Doel:** Platform laten groeien via zichtbaarheid en partnerships.

### 4.1 SEO & content
- [ ] Blog/journaal over zeilen, coaching en natuur op het water
- [ ] Structured data (schema.org) voor bootverhuur en coaching

### 4.2 B2B teambuilding
- [ ] Aparte aanvraagflow voor bedrijven (offerte op maat)
- [ ] Factuurintegratie

### 4.3 Partnerships
- [ ] Koppeling met andere Randmeer-activiteiten (bijv. jachthaven agenda)
- [ ] Affiliate links of bundelpakketten met horeca

---

## Technische stack

| Laag | Keuze |
|---|---|
| Frontend | HTML/CSS (Fase 0–1), Next.js (Fase 2+) |
| Backend/DB | Supabase (Postgres + Auth + Storage) |
| Betaling | Stripe (iDEAL) |
| Mail | Resend |
| Hosting | Vercel |
| Domein | aquaductus.nl |

---

## Security-aandachtspunten (per fase)
- Fase 1: betalingsbevestiging altijd server-side valideren via Stripe webhook
- Fase 2: RLS verplicht op `boekingen` en `gebruikers`
- Fase 3: sessieverslagen encrypted at rest, nooit in URL
- Fase 4: GDPR-compliant mailinglist met expliciete opt-in
