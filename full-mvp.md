# Anong Ganap? Full MVP Plan (Weather-Aware)

## 1. MVP Goal
Deliver a usable end-to-end planner that can:

1. collect user preferences,
2. generate a weather-aware itinerary,
3. suggest routes and places,
4. provide coordinated outfit suggestions,
5. generate and send invitations,
6. store the generated plan.

## 2. Product Boundaries

### In Scope
- React Native mobile app (primary user experience)
- Optional React web admin/demo (internal testing and showcase)
- Node.js + Express backend API
- Supabase/PostgreSQL storage
- Weather, places, routing, and AI integrations

### Out Of Scope
- direct booking and payment workflows
- advanced social collaboration features
- full offline navigation
- recommendation learning from long-term user behavior

## 3. Architecture

```text
[React Native App]       [React Web Admin/Demo]
         \                     /
          \--- REST API ------/
                   |
            [Node.js + Express]
                   |
     +-------------+-------------+
     |             |             |
[AI Service] [Location/Route] [Weather/Outfit]
     |             |             |
   LLM API    Places + Route APIs Weather API
                   |
              [Supabase/Postgres]
```

## 4. End-To-End User Flow

### Step 1: Input
User provides location, budget, date/time, activity type, mood, and transport preference.

### Step 2: Context Gathering
Backend retrieves:

- weather forecast
- nearby places
- route options

### Step 3: Plan Generation
AI composes a timeline and backend validates:

- budget compatibility
- time feasibility
- weather-safe activity selection

### Step 4: Outfit + Invitation
System generates weather-adjusted outfit suggestions and invitation content.

### Step 5: Save + Share
Plan is saved to database and invitation can be sent via email API.

## 5. MVP Deliverables

### Mobile App Screens
- Home
- Plan Setup
- Itinerary Result
- Outfit Suggestion
- Invitation Preview/Send
- Plan Summary

### Backend APIs
- POST /plan/create
- GET /plan/:id
- POST /outfit/generate
- GET /weather/:lat/:lon
- GET /places/nearby
- GET /routes
- POST /invitation/create
- POST /send-invitation

### Database Tables
- users
- plans
- activities
- outfits
- invitations
- memories (optional in MVP, required in next phase)

## 6. Build Plan By Phase

## Phase 1 (Weeks 1-2): Foundation
### Scope
- backend project setup
- database schema setup
- mobile app skeleton and navigation
- basic input form

### Exit Criteria
- app can submit planning input to backend
- backend health and auth-ready structure exist
- plans table can store test data

## Phase 2 (Weeks 3-4): Core Planning Engine
### Scope
- weather API integration
- places and routing API integration
- itinerary generation endpoint
- itinerary screen rendering

### Exit Criteria
- end-to-end generated plan appears in app
- budget and weather checks are applied
- route and place data shown in itinerary output

## Phase 3 (Weeks 5-6): Differentiators + Persistence
### Scope
- outfit generation endpoint and UI
- invitation generation and email sending
- save/retrieve plan flows
- test coverage for critical user paths

### Exit Criteria
- user can generate, save, reopen, and share a plan
- weather-aware outfit suggestions are shown
- happy-path E2E test passes

## 7. Acceptance Criteria

### Functional
- Given valid inputs, system returns itinerary with at least 3 activities.
- Each itinerary includes estimated timing and cost details.
- Rain forecast triggers indoor alternatives.
- Invitation can be generated from final plan.

### Quality
- Non-AI API p95 under 1.5 seconds in staging conditions.
- Failed external API calls return actionable fallback messages.
- No hardcoded secrets in codebase.

## 8. Suggested Tech Choices For MVP

| Layer | Selected Choice | Notes |
| --- | --- | --- |
| Mobile | React Native + Expo | Fast iteration for cross-platform app |
| Web admin/demo | React + Tailwind CSS | Optional, internal use |
| Backend | Node.js + Express | Simple REST architecture |
| Database | Supabase/PostgreSQL | Managed Postgres + auth options |
| AI | OpenAI API | Itinerary, outfit narrative, invitation text |
| Weather | OpenWeatherMap | Forecast-based adjustments |
| Places | Foursquare or Google Places | Nearby discovery |
| Routing | OpenRouteService | Travel estimates and route options |
| Email | Mailjet or Brevo (Sendinblue) | Invitation sending |

## 9. Risks During MVP

| Risk | Effect | Mitigation |
| --- | --- | --- |
| API quota exhaustion | Partial failures | Cache responses and add fallback provider options |
| Poor generated itinerary quality | Lower user trust | Add rules layer and prompt constraints |
| Slow external response time | Bad UX | Timeout strategy and staged loading UI |
| Cost estimate inaccuracies | User frustration | Present estimates as ranges |

## 10. Definition Of Done (MVP)
MVP is complete when all conditions below are true:

1. A new user can create a plan from input to summary without manual backend intervention.
2. The generated plan includes place suggestions, route hints, weather-aware logic, outfit suggestions, and invitation content.
3. Plan data persists and can be retrieved.
4. Core happy-path tests pass in CI.
5. Deployment is available in a staging environment.

## 11. Post-MVP Next Steps
- add memory archive with photos and notes
- add collaborative planning and voting
- add proactive weather alerts and replan suggestions
- add local bookings and payment integrations
