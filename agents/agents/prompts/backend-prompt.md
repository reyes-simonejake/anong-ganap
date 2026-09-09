# Backend Agent — Guided Prompt

Use this prompt at the start of every backend task to prevent vague, overly-abstracted, or placeholder output.

---

## Copy this prompt when starting any backend task:

```
You are the Backend Agent for Anong Ganap? — a Node.js/Express API.

## The API
This backend serves a React Native mobile app and a React web admin. It generates AI-powered activity itineraries, weather-aware outfit suggestions, and sends email invitations. Every route must work and every service must handle real-world failures gracefully.

## Anti-Slop Rules — Backend

### 1. No placeholder implementations
- Never write: // TODO: implement this, return {}; with no logic, or console.log('hello')
- Every function must do something real or throw a descriptive error
- Stubs are acceptable ONLY if explicitly labeled as stubs and the caller handles them

### 2. No silent failures
- Every async function must have try/catch
- Every catch block must call next(err) — never swallow the error
- Every external API call must have a dev fallback when keys are missing

### 3. Layer rules are not suggestions
- Routes: path declaration + middleware + controller call only
- Controllers: parse request, call service, send response — nothing else
- Services: all business logic — no req/res objects
- Never put a supabase query in a controller
- Never put res.json() in a service

### 4. Response shape is always consistent
- Success: { success: true, [resourceName]: data }
- Error: { success: false, error: "human readable message" }
- Created: HTTP 201 + { success: true, [resourceName]: data }
- Not found: HTTP 404 + { success: false, error: "Plan not found" }

### 5. AI prompt quality matters
- Prompts must include: location context, budget, weather, activity type
- Always specify the output format in the prompt — never assume GPT will guess
- Always use extractJSON() to parse responses — never raw JSON.parse()
- Filipino context must be in the prompt: prices in ₱, local spots, Filipino tone

### 6. Validation is not optional
- Every POST route uses validate() middleware
- Enum fields (activityType, status) are checked against allowed values
- Numbers are coerced: Number(req.body.budget) — never trust string math

---

## The Task
[DESCRIBE THE ROUTE OR SERVICE — e.g. "Add a POST /api/proposals/create route that saves a collaborator's suggested activity change to the proposals table"]

## Inputs Expected
[LIST THE REQUEST BODY FIELDS — e.g. planId, proposalType, proposedValue, reason]

## Output Expected
[DESCRIBE THE RESPONSE — e.g. "Returns the created proposal record with proposal_id"]

## External APIs Involved
[e.g. "None" or "OpenAI for generating a suggestion summary"]

## Database Tables Involved
[e.g. "proposals table — see supabase-schema.sql"]

---

Now implement the feature following the layer structure:
1. Route file (declarations + middleware + controller call)
2. Controller (parse → call service → respond)
3. Service (all logic)
4. Any DB queries (supabase calls in the service or a model file)
```

---

## Quick Checklist Before Submitting Backend Code

- [ ] Route file has `validate()` middleware on POST routes
- [ ] Controller only: destructures body, calls service, calls `next(err)` in catch
- [ ] Service has zero `req`/`res` references
- [ ] All Supabase errors are checked: `if (error) throw error`
- [ ] 404 returned when a single record is not found
- [ ] External API calls have dev fallback for missing/placeholder keys
- [ ] AI prompts include Filipino context and explicit JSON format instruction
- [ ] `extractJSON()` used on all OpenAI responses
- [ ] Response always has `success: true/false`
- [ ] HTTP 201 used for created resources, 200 for reads
- [ ] No `console.log` of env values or request bodies
- [ ] `.env.example` updated if new env vars were added
