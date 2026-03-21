# Anong Ganap? Technology Stack

This document defines the recommended stack for MVP delivery and near-term growth.

## 1. Final MVP Stack (Recommended)

| Layer | Selected Technology | Reason |
| --- | --- | --- |
| Mobile app | React Native + Expo | Fast cross-platform delivery for iOS and Android |
| Web admin/demo | React + Tailwind CSS | Lightweight dashboard and project demo support |
| Backend API | Node.js + Express | Simple, reliable REST services and broad ecosystem |
| Database | Supabase PostgreSQL | Managed relational storage with easy scaling |
| ORM | Prisma | Type-safe data access and migration support |
| AI generation | OpenAI API | High-quality natural language generation |
| Places data | Foursquare or Google Places | Nearby attractions and restaurant discovery |
| Routing | OpenRouteService | Cost-effective route and travel estimates |
| Weather | OpenWeatherMap | Forecast-driven itinerary and outfit adjustments |
| Authentication | Firebase Auth or Supabase Auth | Secure and quick auth integration |
| File storage | Cloudinary or Firebase Storage | Media storage for memories and invitation assets |
| Notifications | Firebase Cloud Messaging | Push notifications for reminders and alerts |
| Email sending | Mailjet or Brevo | Invitation email delivery |
| Frontend hosting | Vercel | Fast deployment for web dashboard |
| Backend hosting | Render | Simple deployment for Node.js APIs |
| CI/CD | GitHub Actions | Automated lint, test, and deploy workflows |
| Monitoring | Sentry + analytics tool | Error visibility and usage insights |

## 2. Stack Decisions By Capability

## Frontend
- Mobile-first product: React Native with Expo.
- Optional web dashboard: React for internal tools and demos.
- Shared API client layer to reduce duplicate logic.

## Backend
- Express REST API with modular services:
  - planning service
  - weather service
  - places and routing service
  - outfit and invitation service

## Data
- PostgreSQL as source of truth.
- Prisma migrations for schema evolution.
- Optional Redis later for response caching.

## AI + External APIs
- AI provider for itinerary, invitation, and narrative outfit output.
- Weather and route APIs as contextual signal providers.
- Add fallback providers to reduce downtime risk.

## 3. Alternatives And When To Use Them

| Area | Primary Choice | Alternative | Use Alternative When |
| --- | --- | --- | --- |
| Places | Foursquare | Google Places | Need broader POI coverage or richer metadata |
| Routing | OpenRouteService | Google Directions | Need transit detail in regions with better Google support |
| Auth | Firebase/Supabase Auth | Auth0 | Need enterprise identity features and advanced policies |
| Storage | Cloudinary/Firebase Storage | AWS S3 | Need tighter AWS ecosystem integration |
| Hosting | Render | AWS | Need advanced scaling and custom infra controls |

## 4. Security Baseline
- Use environment variables for all API keys and secrets.
- Enforce HTTPS for all clients and integrations.
- Add request validation at API boundaries.
- Implement per-user data authorization checks.
- Rotate secrets on a fixed schedule.

## 5. Suggested Environment Variables

```env
NODE_ENV=
PORT=

DATABASE_URL=

OPENAI_API_KEY=
WEATHER_API_KEY=
PLACES_API_KEY=
ROUTING_API_KEY=

EMAIL_API_KEY=
EMAIL_FROM=

AUTH_PROVIDER=
JWT_SECRET=

SENTRY_DSN=
```

## 6. Testing And Quality Tooling
- Unit tests: Jest
- API integration tests: Supertest (Node.js)
- End-to-end tests: Cypress (web) and mobile E2E option later
- Lint/format: ESLint + Prettier

## 7. Deployment Strategy
1. Deploy backend to staging.
2. Run smoke tests against staging APIs.
3. Deploy web admin/demo.
4. Publish mobile preview build (Expo).
5. Promote to production after quality checks pass.

## 8. Scalability Path
- Phase 1: single region managed services (MVP)
- Phase 2: add Redis caching and queue-based background jobs
- Phase 3: split API into service modules if traffic requires isolation
- Phase 4: multi-region strategy if user base becomes geographically broad

## 9. Final Recommendation
For speed, cost control, and maintainability, use:

- React Native + Expo
- Node.js + Express
- Supabase PostgreSQL + Prisma
- OpenAI + OpenWeatherMap + OpenRouteService + Foursquare
- Vercel (web) + Render (backend)
- GitHub Actions + Sentry

This combination is practical for MVP delivery while remaining flexible for future scale.
