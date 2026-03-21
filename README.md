# Anong Ganap?

Anong Ganap? is an AI-powered planner that builds complete activity itineraries for dates, hangouts, family trips, and solo adventures.

## What Problem It Solves
Planning one activity usually requires switching between multiple apps for places, routes, budgeting, outfit ideas, and invitations. This creates decision fatigue and wastes time.

## Core Value
The app combines planning tasks into one flow:

- Generates a full itinerary from simple user inputs.
- Recommends places and routes based on budget, time, and location.
- Adjusts activities and outfit suggestions based on weather.
- Creates invitation messages users can share instantly.
- Stores plans and memories for future reference.

## MVP Scope
The MVP focuses on a complete end-to-end planning flow:

1. Collect user preferences (location, budget, mood, date, duration, transport).
2. Generate a weather-aware itinerary.
3. Show place recommendations and route options.
4. Suggest coordinated outfits.
5. Generate and send invitations.
6. Save plans in the database.

## Target Users
- Couples planning dates
- Friends planning hangouts
- Families planning outings
- Tourists exploring unfamiliar places
- Solo users discovering personal activities

## Architecture At A Glance
- Client apps: React Native mobile app, optional React web admin/demo
- Backend: Node.js + Express REST API
- Data: PostgreSQL (Supabase)
- Integrations: AI provider, weather API, maps/routing API, places API, email API

## Tech Stack Summary
- Mobile: React Native + Expo
- Web admin/demo: React + Tailwind CSS
- Backend: Node.js + Express
- Database: Supabase/PostgreSQL
- AI: OpenAI API (with optional fallback provider)
- Weather: OpenWeatherMap
- Maps and routing: OpenStreetMap + OpenRouteService
- Places: Foursquare or Google Places
- Hosting: Vercel (frontend) + Render (backend)

## Project Structure

```
anong-ganap/
├── backend/           # Node.js + Express API (server-side logic)
├── landing/           # Public landing page (marketing site for users)
├── web/               # Admin dashboard (internal management)
├── mobile/            # React Native mobile app (Expo - user app)
├── shared/            # Shared types and constants
└── docs/              # Documentation
```

## Quick Start

### Landing Page (Public Site)
```bash
cd landing
npm install
npm run dev
```
Visit http://localhost:5173 - This is what users see when they visit your site.

### Admin Dashboard
```bash
cd web
npm install
npm run dev
```
Visit http://localhost:5173 - Internal dashboard for managing plans and users.

### Mobile App (User App)
```bash
cd mobile
npm install
npm start
```
Scan QR code with Expo Go app.

### Backend API
```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file
npm run dev
```

## Documentation Map
- [docs/anong_ganap_full_mvp.md](docs/anong_ganap_full_mvp.md): Complete MVP specification
- [docs/documentation.md](docs/documentation.md): Full product and technical specification
- [docs/full-mvp.md](docs/full-mvp.md): MVP execution plan and delivery milestones
- [docs/techstack.md](docs/techstack.md): Detailed technology decisions
- [docs/future-improvements.md](docs/future-improvements.md): Post-MVP roadmap and enhancements

## Current Status
✅ Backend API structure complete
✅ Landing page created (public-facing marketing site)
✅ Admin dashboard initialized (internal management)
✅ Mobile app initialized with NativeWind
✅ Project structure organized with clear separation
🔄 Next: Configure environment variables and connect external APIs

## Project Separation

- **landing/** - Public marketing website (what users see on the internet)
- **web/** - Admin dashboard (for internal team to manage plans, users, analytics)
- **mobile/** - User-facing mobile app (where users create and view their plans)
- **backend/** - API server (handles all business logic and data)