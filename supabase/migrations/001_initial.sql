-- Aquaductus database schema
-- Bewaartermijn persoonlijke data: 7 jaar (fiscale plicht)

-- DIENSTEN (statische data)
CREATE TABLE IF NOT EXISTS diensten (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  naam text NOT NULL,
  beschrijving text,
  prijs_per_persoon integer NOT NULL, -- in centen
  max_personen integer NOT NULL,
  duur_uren numeric NOT NULL,
  actief boolean DEFAULT true
);

-- Seed diensten
INSERT INTO diensten (id, naam, beschrijving, prijs_per_persoon, max_personen, duur_uren) VALUES
  (gen_random_uuid(), 'Recreatief zeilen', 'Ontspan en vaar mee op de Randmeren vanuit Harderwijk. Voor families, koppels en vriendengroepen.', 7500, 8, 4),
  (gen_random_uuid(), 'Coachingssessie', 'Persoonlijke coachingssessie op het water. De perfecte metafoor voor leiderschap en samenwerking.', 15000, 2, 3),
  (gen_random_uuid(), 'Teambuilding', 'Versterk de samenwerking binnen uw team door samen te zeilen. Inclusief evaluatie.', 9500, 16, 6);

-- BESCHIKBAARHEID
CREATE TABLE IF NOT EXISTS beschikbaarheid (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  datum date NOT NULL,
  dienst_id uuid REFERENCES diensten(id),
  max_plaatsen integer NOT NULL,
  geboekte_plaatsen integer DEFAULT 0,
  geblokkeerd boolean DEFAULT false,
  UNIQUE(datum, dienst_id)
);

-- BOEKINGEN
-- Bewaartermijn: 7 jaar (fiscale plicht, art. 52 AWR)
CREATE TABLE IF NOT EXISTS boekingen (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  klant_id uuid REFERENCES auth.users(id),
  gast_naam text,
  gast_email text,
  gast_telefoon text,
  dienst_id uuid REFERENCES diensten(id),
  datum date NOT NULL,
  aantal_personen integer NOT NULL,
  totaal_prijs integer NOT NULL, -- in centen
  status text CHECK (status IN ('pending', 'betaald', 'bevestigd', 'geannuleerd')) DEFAULT 'pending',
  stripe_session_id text,
  stripe_payment_intent_id text,
  notities text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS boekingen
ALTER TABLE boekingen ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Klant ziet eigen boekingen" ON boekingen
  FOR SELECT USING (auth.uid() = klant_id);
CREATE POLICY "Klant maakt boeking" ON boekingen
  FOR INSERT WITH CHECK (true);

-- REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  boeking_id uuid REFERENCES boekingen(id),
  klant_naam text NOT NULL,
  rating integer CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  tekst text NOT NULL,
  goedgekeurd boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Iedereen ziet goedgekeurde reviews" ON reviews
  FOR SELECT USING (goedgekeurd = true);
CREATE POLICY "Review aanmaken" ON reviews
  FOR INSERT WITH CHECK (true);

-- CADEAUBONNEN
CREATE TABLE IF NOT EXISTS cadeaubonnen (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  waarde integer NOT NULL, -- in centen
  koper_email text NOT NULL,
  ontvanger_email text,
  ontvanger_naam text,
  bericht text,
  geldig_tot date NOT NULL,
  ingewisseld boolean DEFAULT false,
  ingewisseld_bij uuid REFERENCES boekingen(id),
  stripe_session_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cadeaubonnen ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Koper ziet eigen cadeaubonnen" ON cadeaubonnen
  FOR SELECT USING (true); -- code-based lookup via service role

-- COACHING TRAJECTEN
-- Bewaartermijn: 7 jaar na afloop traject (fiscale plicht)
CREATE TABLE IF NOT EXISTS coaching_trajecten (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  klant_id uuid REFERENCES auth.users(id),
  coach_id uuid REFERENCES auth.users(id),
  naam text NOT NULL,
  status text CHECK (status IN ('intake', 'actief', 'afgerond', 'gepauzeerd')) DEFAULT 'intake',
  start_datum date,
  eind_datum date,
  notities text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coaching_trajecten ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Klant ziet eigen trajecten" ON coaching_trajecten
  FOR SELECT USING (auth.uid() = klant_id OR auth.uid() = coach_id);

-- COACHING SESSIES
CREATE TABLE IF NOT EXISTS coaching_sessies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  traject_id uuid REFERENCES coaching_trajecten(id),
  boeking_id uuid REFERENCES boekingen(id),
  datum date,
  verslag_encrypted text, -- AES-256-GCM encrypted at app layer
  verslag_iv text, -- AES-GCM IV (base64)
  verslag_auth_tag text, -- AES-GCM auth tag (base64)
  verslag_coach_notities text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coaching_sessies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Toegang via traject" ON coaching_sessies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM coaching_trajecten t
      WHERE t.id = traject_id
      AND (t.klant_id = auth.uid() OR t.coach_id = auth.uid())
    )
  );

-- REFLECTIES
CREATE TABLE IF NOT EXISTS reflecties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sessie_id uuid REFERENCES coaching_sessies(id),
  klant_id uuid REFERENCES auth.users(id),
  vraag_1 text, -- Wat heb je geleerd?
  vraag_2 text, -- Wat was lastig?
  vraag_3 text, -- Volgende stap?
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reflecties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Klant ziet eigen reflecties" ON reflecties
  FOR SELECT USING (auth.uid() = klant_id);
CREATE POLICY "Klant maakt reflectie" ON reflecties
  FOR INSERT WITH CHECK (auth.uid() = klant_id);

-- GROEPSPROGRAMMAS
CREATE TABLE IF NOT EXISTS groepsprogrammas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  naam text NOT NULL,
  beschrijving text,
  datum date NOT NULL,
  max_deelnemers integer NOT NULL,
  prijs_per_persoon integer NOT NULL,
  slug text UNIQUE NOT NULL,
  actief boolean DEFAULT true
);

-- BLOG POSTS
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  titel text NOT NULL,
  samenvatting text,
  inhoud text, -- markdown
  gepubliceerd boolean DEFAULT false,
  gepubliceerd_op timestamptz,
  seo_titel text,
  seo_beschrijving text,
  created_at timestamptz DEFAULT now()
);

-- Helper functie: updated_at automatisch bijwerken
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER boekingen_updated_at
  BEFORE UPDATE ON boekingen
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- pg_cron: stuur review-uitnodiging na boeking (vereist pg_cron extensie)
-- SELECT cron.schedule('review-uitnodigingen', '0 8 * * *', $$
--   SELECT net.http_post(
--     url := current_setting('app.site_url') || '/api/reviews/uitnodiging',
--     headers := '{"Content-Type": "application/json"}',
--     body := '{}'
--   ) FROM boekingen
--   WHERE status = 'bevestigd'
--   AND datum = current_date - interval '1 day'
--   LIMIT 1;
-- $$);
