-- Einmalig in der Neon Console ausführen
-- https://console.neon.tech → SQL Editor

-- Anmeldungen
CREATE TABLE IF NOT EXISTS registrations (
  id                   SERIAL PRIMARY KEY,
  first_name           VARCHAR(50)  NOT NULL,
  last_name            VARCHAR(50)  NOT NULL,
  phone                VARCHAR(20)  NOT NULL,
  plus_one_first_name  VARCHAR(50),
  plus_one_last_name   VARCHAR(50),
  paid                 BOOLEAN      DEFAULT FALSE,
  plus_one_paid        BOOLEAN      DEFAULT FALSE,
  created_at           TIMESTAMP    DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_registrations_name
  ON registrations (LOWER(first_name), LOWER(last_name));

-- Gästeliste (im Admin-Backend editierbar)
CREATE TABLE IF NOT EXISTS guestlist (
  id        SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL UNIQUE
);
