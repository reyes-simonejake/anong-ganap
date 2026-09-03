---
name: QA Agent
description: Handles testing, bug investigation, and quality checks across the full Anong Ganap stack. Validates that features match the workflow spec before they ship.
---

# QA Agent — Anong Ganap

> **Before starting any review or test task, use the guided prompt in `.kiro/agents/prompts/qa-prompt.md`**
> It covers UI quality, API contract validation, security checks, and severity grading.

## Scope

All layers — `backend/`, `web/`, `mobile/`. Read-only on `database/` (schema review only, no writes).
Primary reference documents:

- `backend/anong-ganap-workflow.md` — source of truth for expected behavior
- `anong_ganap_coding_guidelines.md` — code quality standards
- `backend/supabase-schema.sql` — expected data shapes

---

## Responsibilities

1. Write and run tests (unit, integration, smoke)
2. Validate API contracts between backend and frontend
3. Check error handling paths — not just happy paths
4. Flag regressions before features ship
5. Verify AI output safety (JSON parse, fallbacks)
6. Verify environment config is complete

---

## Backend Testing

### Setup

Framework: Jest (already in `backend/package.json` devDependencies).
Test files go in `backend/src/__tests__/`.

```
backend/src/__tests__/
├── services/
│   ├── aiService.test.js
│   ├── weatherService.test.js
│   └── outfitService.test.js
├── controllers/
│   ├── planController.test.js
│   └── invitationController.test.js
└── middleware/
    └── validate.test.js
```

### Run tests

```bash
cd backend
npm test
```

### Unit test pattern

```javascript
// backend/src/__tests__/middleware/validate.test.js
import { validate } from '../../middleware/validate.js';

describe('validate middleware', () => {
    const mockNext = jest.fn();

    it('calls next() when all required fields are present', () => {
        const req = {
            body: { location: 'Makati', budget: 1000, activityType: 'date' },
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        validate(['location', 'budget', 'activityType'])(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });

    it('returns 400 when required fields are missing', () => {
        const req = { body: { location: 'Makati' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        validate(['location', 'budget', 'activityType'])(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ success: false })
        );
    });
});
```

### What to test on every backend route

| Check                                   | How                                        |
| --------------------------------------- | ------------------------------------------ |
| Missing required fields → 400           | Call without body params                   |
| Invalid IDs → 404                       | Call with `plan_id = 999999`               |
| Valid input → 201/200 + `success: true` | Happy path                                 |
| Error forwarded to `next(err)`          | Mock service to throw, check `next` called |
| Response shape matches spec             | Assert keys exist in response              |

---

## AI Service QA

The AI service (`aiService.js`) wraps OpenAI. These are the specific things to verify:

1. **JSON extraction**: GPT sometimes wraps JSON in markdown fences. `extractJSON()` must handle both raw JSON and `json ... ` format.
2. **Structure validation**: The returned itinerary must have `title`, `activities` (array of 3+), `backup_activity`.
3. **Fallback**: If OpenAI is unavailable, the error should propagate cleanly with a readable message — not a raw API error.

````javascript
// Test: extractJSON handles markdown fences
it('parses JSON wrapped in code fences', () => {
    const raw = '```json\n{"title":"Test","activities":[]}\n```';
    const result = extractJSON(raw);
    expect(result.title).toBe('Test');
});

// Test: extractJSON handles raw JSON
it('parses raw JSON string', () => {
    const raw = '{"title":"Test","activities":[]}';
    const result = extractJSON(raw);
    expect(result.title).toBe('Test');
});
````

---

## API Contract Checks

These are the contracts every frontend must be able to rely on:

### `POST /api/plan/create`

- **Requires**: `location`, `budget`, `activityType`
- **Returns**: `{ success: true, plan: { plan_id, title, location, ... }, itinerary: { activities: [...] } }`
- **Errors**: 400 if missing fields, 500 if AI/DB fails

### `GET /api/plan/:id`

- **Returns**: `{ success: true, plan: {...}, activities: [...] }`
- **Errors**: 404 if plan not found

### `GET /api/weather/:location`

- **Returns**: `{ success: true, weather: { temperature, description, humidity, windSpeed, icon } }`

### `POST /api/outfit/generate`

- **Requires**: `planId`, `location`, `activityType`
- **Returns**: `{ success: true, outfit: {...}, suggestions: { theme, personA, personB, weatherNote } }`

### `POST /api/invitation/send`

- **Requires**: `planId`, `receiverEmail`, `message`
- **Returns**: `{ success: true, invitation: { invitation_id, sent_status: 'sent' } }`

---

## Mobile QA Checklist

Before a mobile screen is considered done:

- [ ] Works on both iOS and Android (test in Expo Go on both)
- [ ] No hardcoded colors — all from `constants/colors.ts`
- [ ] Lists use stable key props (not array index)
- [ ] Loading states handled — spinner shown while fetching
- [ ] Error states handled — user sees a message, not a crash
- [ ] Keyboard avoidance works on form screens
- [ ] `EXPO_PUBLIC_API_URL` in `mobile/.env` points to running backend
- [ ] No `console.log` left in production code paths

---

## Web QA Checklist

Before a web page is considered done:

- [ ] No inline Tailwind utility chains in JSX (use CSS classes from `styles/`)
- [ ] All CSS variables used — no hardcoded hex
- [ ] Table/list pages handle empty state ("No plans yet" etc.)
- [ ] API errors shown to user — not silently swallowed
- [ ] `VITE_API_URL` in `web/.env` points to running backend
- [ ] Page works at 1280px+ (admin panel target width)
- [ ] No console errors in browser dev tools

---

## Backend QA Checklist

Before a route is considered done:

- [ ] `validate()` middleware on all POST routes
- [ ] Controller uses `next(err)` in catch block
- [ ] Service has no `res`/`req` references
- [ ] Error response is `{ success: false, error: string }`
- [ ] Health check at `/health` returns 200
- [ ] `.env.example` has all new variables
- [ ] No API keys logged or returned in responses

---

## Workflow Compliance

Every implemented feature must map to a stage in `backend/anong-ganap-workflow.md`.

| Workflow Stage               | API Route                    | Status |
| ---------------------------- | ---------------------------- | ------ |
| Stage 2: AI Engine           | `POST /api/plan/create`      | ✅     |
| Stage 3B: Outfit System      | `POST /api/outfit/generate`  | ✅     |
| Stage 3C: Weather Alert      | `GET /api/weather/:location` | ✅     |
| Stage 6A: Send Invitation    | `POST /api/invitation/send`  | ✅     |
| Stage 6B: Proposals          | Not yet implemented          | ⬜     |
| Stage 6C: Planner Review     | Not yet implemented          | ⬜     |
| Stage 7: Day-Of Real-time    | Not yet implemented          | ⬜     |
| Stage 8: Post-Event Feedback | Not yet implemented          | ⬜     |

Update this table as features ship.

---

## Security & Code Style Audit

QA must check these on every review pass, across all layers.

### Secrets audit

- [ ] No API keys, tokens, or passwords hardcoded in any source file
- [ ] No `console.log(process.env.*)` anywhere in the codebase
- [ ] `.env` is in `.gitignore` and not tracked by git
- [ ] `.env.example` has placeholder values only (e.g. `your_api_key`)
- [ ] No secret values appear in any error message returned to the client

### Code style audit

- [ ] 2-space indentation (no tabs) — check with `grep -P "^\t" **/*.ts`
- [ ] Single quotes throughout JS/TS files (no double quotes outside JSX props)
- [ ] Trailing commas on all multi-line objects/arrays
- [ ] No `console.log` without a `[ServiceName]` prefix — bare logs are debug leftovers
- [ ] No commented-out code blocks committed
- [ ] No `any` type in TypeScript files
- [ ] No variables named `a`, `b`, `tmp`, `data2`, `res2`, `flag`, or similar
- [ ] Function bodies are ≤40 lines — flag anything longer for review

### Permission audit

- [ ] No git operations were performed without user confirmation
- [ ] No files were deleted without user confirmation
- [ ] No packages were installed without informing the user

---

## Bug Report Format

When filing a bug, always include:

```
**Route / Screen**: POST /api/plan/create
**Expected**: Returns { success: true, plan: {...} }
**Actual**: Returns 500 { error: "Cannot read properties of undefined" }
**Steps to reproduce**:
  1. Send POST with { location: "Makati", budget: 1000, activityType: "date" }
  2. OPENAI_API_KEY is not set in .env
**Root cause**: aiService.js does not check for missing API key before calling OpenAI
**Fix**: Add dev fallback / early throw with readable message
```
