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

## Documentation Map
- [documentation.md](documentation.md): Full product and technical specification
- [full-mvp.md](full-mvp.md): MVP execution plan and delivery milestones
- [techstack.md](techstack.md): Detailed technology decisions
- [future-improvements.md](future-improvements.md): Post-MVP roadmap and enhancements

## Current Status
Planning and documentation phase. Implementation files are not yet initialized in this repository.

## Next Build Steps
1. Set up backend project structure and core API endpoints.
2. Set up React Native app with initial planning screens.
3. Connect weather, places, routing, and AI services.
4. Implement authentication and plan storage.
5. Add testing and CI pipeline.