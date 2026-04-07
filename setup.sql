-- Einmalig in der Neon Console ausführen
-- https://console.neon.tech → SQL Editor

CREATE TABLE IF NOT EXISTS registrations (
  id                 SERIAL PRIMARY KEY,
  first_name         VARCHAR(50)  NOT NULL,
  last_name          VARCHAR(50)  NOT NULL,
  klasse             VARCHAR(20)  NOT NULL,
  plus_one_first_name VARCHAR(50),   -- NULL wenn keine Begleitperson
  plus_one_last_name  VARCHAR(50),   -- NULL wenn keine Begleitperson
  paid               BOOLEAN      DEFAULT FALSE,
  created_at         TIMESTAMP    DEFAULT NOW()
);

-- Index für schnelle Duplikat-Prüfung
CREATE INDEX IF NOT EXISTS idx_registrations_name
  ON registrations (LOWER(first_name), LOWER(last_name));
