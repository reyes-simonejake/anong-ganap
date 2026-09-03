# Anong Ganap? 🎉

AI-powered collaborative activity planner for Filipino friend groups and couples.

---

## Project Structure

```
anong-ganap/
├── backend/         — Express.js API (Node.js)
├── mobile/          — React Native / Expo app
├── web/             — React admin/web dashboard (Vite)
├── landing/         — Landing page (Vite + Tailwind)
├── shared/          — Shared TypeScript types
└── docs/            — Documentation
```

---

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env   # fill in your API keys
npm install
npm run dev            # runs on http://localhost:5000
```

**Required env vars:**
| Key | Where to get it |
|-----|----------------|
| `SUPABASE_URL` | Supabase project settings |
| `SUPABASE_ANON_KEY` | Supabase project settings |
| `OPENAI_API_KEY` | platform.openai.com |
| `WEATHER_API_KEY` | openweathermap.org |
| `FOURSQUARE_API_KEY` | developer.foursquare.com |
| `EMAIL_API_KEY` / `EMAIL_API_SECRET` | mailjet.com |

**Set up Supabase tables:**
Run `backend/supabase-schema.sql` in your Supabase SQL editor.

---

### 2. Web Admin

```bash
cd web
cp .env.example .env   # set VITE_API_URL=http://localhost:5000
npm install
npm run dev            # runs on http://localhost:5173
```

---

### 3. Mobile App

```bash
cd mobile
npm install
npm start              # Expo dev server
```

> When testing on a physical device, update `EXPO_PUBLIC_API_URL` in `mobile/.env`
> to your machine's local IP address (e.g. `http://192.168.1.x:5000`).

---

## API Endpoints

| Method | Route                                | Description                  |
| ------ | ------------------------------------ | ---------------------------- |
| `POST` | `/api/plan/create`                   | Generate AI itinerary        |
| `GET`  | `/api/plan`                          | List all plans               |
| `GET`  | `/api/plan/:id`                      | Get single plan + activities |
| `POST` | `/api/outfit/generate`               | Generate outfit suggestions  |
| `GET`  | `/api/weather/:location`             | Get current weather          |
| `GET`  | `/api/places/nearby?location=&type=` | Get nearby places            |
| `POST` | `/api/invitation/create`             | Generate invite message      |
| `POST` | `/api/invitation/send`               | Send invitation email        |
| `GET`  | `/health`                            | Health check                 |

---

## Tech Stack

- **Backend:** Node.js, Express, Supabase (PostgreSQL), OpenAI, Axios
- **Mobile:** React Native, Expo, NativeWind
- **Web:** React, Vite, TailwindCSS, React Router
- **APIs:** OpenWeatherMap, Foursquare Places, Mailjet

---

## MVP Status

See `backend/anong-ganap-workflow.md` for the full workflow and `docs/` for detailed specs.
