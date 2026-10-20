# BeautyBook – Frontend

Web aplikacija za online rezervaciju termina u salonima, berbernicama, spa centrima i sl. Korisnici pretražuju salone i zakazuju termine, a vlasnici salona upravljaju uslugama, timom i rezervacijama kroz dashboard.

Backend API (Node/Express + MySQL) nalazi se u zasebnom repozitorijumu (`backend`).

## Tehnologije

- React 19 + TypeScript, Vite
- React Router 7
- Tailwind CSS 4, Radix UI, shadcn-style komponente, lucide / heroicons
- Axios

## Funkcionalnosti

- Javne stranice: početna, pretraga salona, usluge, stranica salona (`/salon/:slug`), pravne stranice
- Autentikacija (prijava / registracija), profil i sigurnosna podešavanja
- Kreiranje salona kroz višekoračnu formu (osnovni podaci, detalji, usluge, tim)
- Dashboard salona: rezervacije, usluge (sa fazama aktivno/pasivno vrijeme), tim, blokirana vremena, ručno zakazivanje, podešavanja
- Omiljeni saloni, obavještenja, pomjeranje termina
- Admin pregled salona
- SEO meta tagovi

## Pokretanje

```bash
npm install
npm run dev
```

Aplikacija se pokreće na `http://localhost:5173`.

### Okruženje

Napravi `.env` (ili `.env.development`) fajl:

```
VITE_API_URL="http://localhost:8000/api"
```

### Skripte

| Komanda           | Opis                          |
| ----------------- | ----------------------------- |
| `npm run dev`     | Razvojni server               |
| `npm run build`   | Provjera tipova i build       |
| `npm run preview` | Pregled produkcijskog builda  |
| `npm run lint`    | ESLint                        |

## Struktura

```
src/
  components/   UI, sekcije, salon forme i dashboard, konteksti
  config/       Axios instanca
  helpers/      API pozivi i pomoćne funkcije
  layouts/      Main, Salon i Auth layout
  pages/        admin, public, salon, user
  routes/       definicije ruta i ProtectedRoute
```
