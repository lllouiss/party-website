# Party Website — Schülerparty Anmeldung

## Deploy auf Vercel

### 1. Vercel Postgres (Neon) einrichten

1. [Vercel Dashboard](https://vercel.com) → Storage → Create Database → Neon Postgres
2. Projekt verknüpfen → `POSTGRES_URL` wird automatisch als Env-Variable gesetzt
3. In der Neon Console das `setup.sql` ausführen (einmalig):

```sql
-- Inhalt von setup.sql einfügen und ausführen
```

### 2. Environment Variables

Im Vercel Dashboard unter **Settings → Environment Variables** setzen:

| Variable         | Beschreibung                          |
|-----------------|---------------------------------------|
| `POSTGRES_URL`  | Automatisch von Neon gesetzt          |
| `ADMIN_PASSWORD`| Passwort für `/admin`                 |
| `SESSION_SECRET`| Mind. 32 Zeichen, zufällig generiert |

```bash
# SESSION_SECRET generieren:
openssl rand -base64 32
```

Lokal: `.env.example` → `.env.local` kopieren und ausfüllen.

### 3. Deployen

```bash
npm i -g vercel
vercel --prod
```

---

## Inhalte anpassen

### Gästeliste — `lib/guestlist.ts`
Namen im Format `"vorname nachname"` (lowercase) eintragen:
```ts
export const GUESTLIST: string[] = [
  "anna müller",
  "ben schneider",
];
```

### Party-Infos — `lib/config.ts`
Name, Datum, Ort, Preis, TWINT-Nummer und Event-Datum anpassen.

### Klassen — `lib/config.ts`
`KLASSEN`-Array bearbeiten.

---

## Lokale Entwicklung

```bash
npm install
cp .env.example .env.local
# .env.local mit echten Werten befüllen
npm run dev
```

## Routen

| Route              | Beschreibung                            |
|-------------------|-----------------------------------------|
| `/`               | Startseite mit Countdown                |
| `/register`       | Anmeldeformular (2 Schritte)            |
| `/confirm?id=X`   | Bestätigungsseite                       |
| `/admin/login`    | Admin-Login                             |
| `/admin`          | Dashboard (Tabelle, Stats, Filter)      |
| `/admin/export`   | CSV-Download                            |
