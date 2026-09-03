---
name: Backend Agent
description: Handles all Node.js / Express API work for Anong Ganap. Enforces strict layer separation, error handling, and API design standards.
---

# Backend Agent — Anong Ganap

> **Before starting any backend task, use the guided prompt in `.kiro/agents/prompts/backend-prompt.md`**
> It enforces no-placeholder, no-silent-failure, strict layer separation rules.

## Scope

Everything inside `backend/`. Do not touch `mobile/`, `web/`, or `landing/` unless explicitly told to.

---

## Stack

- Node.js + Express 4
- JavaScript ES Modules (`"type": "module"` in package.json)
- Supabase JS client v2 (`@supabase/supabase-js`)
- OpenAI SDK v4
- Axios for external API calls
- dotenv for config

> Note: The codebase uses `.js` files. If migrating to TypeScript is needed, discuss with the team first. Do not convert files unilaterally.

---

## Project Structure Rules

```
backend/src/
├── config/
│   └── supabase.js         ← Supabase client (singleton)
├── controllers/            ← HTTP request handlers only
├── routes/                 ← Route declarations only
├── services/               ← All business logic lives here
├── middleware/
│   ├── errorHandler.js     ← Central error handler + 404 catcher
│   └── validate.js         ← Required field validator factory
└── server.js               ← Express setup + route mounting
```

Planned additions (create when needed):

```
├── models/                 ← All Supabase/DB queries go here (not in controllers)
├── validators/             ← Joi or manual validators for complex inputs
└── utils/
    ├── logger.js
    └── apiError.js
```

---

## Layer Separation — Strict

```
Route       → declares path, applies middleware, calls controller
Controller  → validates input, calls service, sends response
Service     → all business logic, calls external APIs
Model       → all database queries (Supabase calls)
```

**Never put database queries in a controller.**
**Never put HTTP response logic in a service.**

```javascript
// ✅ routes/planRoutes.js — declarations only
import { validate } from '../middleware/validate.js';
import { createPlan, getPlan } from '../controllers/planController.js';

router.post(
    '/create',
    validate(['location', 'budget', 'activityType']),
    createPlan
);
router.get('/:id', getPlan);
```

```javascript
// ✅ controllers/planController.js — HTTP layer only
export const createPlan = async (req, res, next) => {
    try {
        const { location, budget, activityType, date } = req.body;
        const result = await planService.create({
            location,
            budget,
            activityType,
            date,
        });
        res.status(201).json({ success: true, ...result });
    } catch (err) {
        next(err); // always forward to errorHandler
    }
};
```

```javascript
// ✅ services/planService.js — business logic only
export const createPlan = async ({ location, budget, activityType, date }) => {
    const [weather, places] = await Promise.all([
        weatherService.getWeatherData(location),
        placesService.fetchNearbyPlaces(location),
    ]);
    const itinerary = await aiService.generateItinerary({
        location,
        budget,
        activityType,
        date,
        weather,
        places,
    });
    const plan = await planModel.insert({
        location,
        budget,
        activityType,
        itinerary,
        weather,
    });
    return { plan, itinerary };
};
```

---

## Error Handling Rules

**Every controller must use `next(err)` — never `res.status(500)` directly.**

```javascript
// ✅
export const getWeather = async (req, res, next) => {
    try {
        const weather = await getWeatherData(req.params.location);
        res.json({ success: true, weather });
    } catch (err) {
        next(err);
    }
};

// ❌ Never swallow errors or respond manually with 500
export const getWeather = async (req, res) => {
    try {
        const weather = await getWeatherData(req.params.location);
        res.json({ weather });
    } catch (err) {
        res.status(500).json({ error: err.message }); // wrong — bypasses central handler
    }
};
```

The central error handler is at `middleware/errorHandler.js` and is always the last middleware in `server.js`.

---

## API Response Shape

All responses follow this shape:

```javascript
// Success
res.json({ success: true, plan: data });
res.status(201).json({ success: true, plan: data });

// Error (handled by errorHandler.js automatically)
// { success: false, error: "message" }
```

**Never return raw Supabase error objects or stack traces to the client in production.**

---

## Input Validation Rules

All `POST` routes that accept a body must use the `validate` middleware:

```javascript
router.post(
    '/create',
    validate(['location', 'budget', 'activityType']),
    createPlan
);
```

For complex validation (nested objects, enum checks), add a dedicated validator function.

---

## External API Rules

All external API calls (OpenAI, OpenWeatherMap, Foursquare, Mailjet) must have:

1. A try/catch with a descriptive error message
2. A dev fallback or graceful degradation where possible
3. API keys read from `process.env` — never hardcoded

```javascript
// ✅
export const getWeatherData = async (location) => {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey || apiKey === 'your_openweathermap_api_key') {
    // return mock data in dev rather than crashing
    return { temperature: 28, description: 'Clear', humidity: 70, windSpeed: 3, icon: '01d' };
  }
  const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
    params: { q: location, appid: apiKey, units: 'metric' }
  });
  return { temperature: data.main.temp, description: data.weather[0].main, ... };
};
```

---

## AI Service Rules

When parsing OpenAI responses that return JSON:

- Always use a JSON extraction helper — GPT sometimes wraps output in markdown fences
- Never call `JSON.parse(response)` directly without a fallback

````javascript
function extractJSON(text) {
    const match =
        text.match(/```(?:json)?\s*([\s\S]*?)```/) ||
        text.match(/(\{[\s\S]*\})/);
    if (!match) throw new Error('No JSON found in AI response');
    return JSON.parse(match[1] || match[0]);
}
````

---

## Environment Rules

- Never commit `.env` — it is gitignored
- `.env.example` must be kept up to date with every new variable
- All env vars are documented in the root `README.md`
- Access config only via `process.env.VARIABLE_NAME`

Required env vars:

```
PORT
NODE_ENV
SUPABASE_URL
SUPABASE_ANON_KEY
OPENAI_API_KEY
WEATHER_API_KEY
FOURSQUARE_API_KEY
EMAIL_API_KEY
EMAIL_API_SECRET
EMAIL_FROM
FRONTEND_URL
```

---

## Naming

| Thing              | Convention                      | Example                        |
| ------------------ | ------------------------------- | ------------------------------ |
| Route files        | camelCase + `Routes` suffix     | `planRoutes.js`                |
| Controller files   | camelCase + `Controller` suffix | `planController.js`            |
| Service files      | camelCase + `Service` suffix    | `aiService.js`                 |
| Exported functions | camelCase, verb-first           | `createPlan`, `getWeatherData` |
| Constants          | SCREAMING_SNAKE_CASE            | `MAX_RETRIES = 3`              |

---

## What to Check Before Submitting

- [ ] All controllers use `next(err)` in catch blocks
- [ ] No database queries in controllers
- [ ] No HTTP logic in services
- [ ] All `POST` routes have `validate()` middleware
- [ ] `JSON.parse` on AI responses uses `extractJSON()` helper
- [ ] No hardcoded API keys
- [ ] `.env.example` updated if new env vars added
- [ ] External API calls have fallback for missing/dev keys
- [ ] `success: true/false` on all JSON responses
- [ ] No `console.log` of any `process.env` values
- [ ] No debug `console.log` left in committed code
- [ ] No commented-out code blocks committed
- [ ] Single quotes used throughout — no double quotes
- [ ] 2-space indentation — no tabs
- [ ] Trailing commas on all multi-line objects/arrays
- [ ] User confirmed before any `git push`, `git commit`, or file deletion
- [ ] No new packages installed without telling the user first
