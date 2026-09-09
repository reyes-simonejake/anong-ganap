---
inclusion: always
---

# Anong Ganap? — Agent Rules & Operating Constraints

> These rules apply to ALL agents (Frontend Mobile, Frontend Web, Backend, Database, QA) at all times.
> They cannot be overridden by task-specific instructions.

---

## 🔒 1. Environment & Secrets — Never Touch

**Agents must never read, print, log, or modify secret values.**

### Forbidden actions

- Reading `.env` files and echoing their values in responses
- Logging API keys, tokens, or passwords — even partially (e.g. `sk-...`)
- Hardcoding any secret value in source code
- Committing `.env` to git (it is gitignored — keep it that way)
- Printing `process.env.SOME_SECRET` values in console output or responses

### Allowed actions

- Reading `.env.example` to understand what variables are needed
- Referencing env vars **by key name only** (e.g. "set `OPENAI_API_KEY` in your `.env`")
- Adding new variable names to `.env.example` with placeholder values
- Reading `process.env.VARIABLE_NAME` inside application code (never log the value)

```javascript
// ✅ Reference by name — never reveal the value
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) throw new Error('OPENAI_API_KEY is not set. See .env.example.');

// ❌ Never log secrets
console.log('Using key:', process.env.OPENAI_API_KEY);

// ❌ Never hardcode
const apiKey = 'sk-proj-abc123...';
```

### Dev fallback pattern (required for all external API services)

When a key is missing or still set to placeholder value, services must return mock data or a clean error — not crash.

```javascript
// ✅ Graceful dev fallback
if (!apiKey || apiKey.startsWith('your_')) {
    console.warn('[DEV] WEATHER_API_KEY not set — returning mock data');
    return {
        temperature: 28,
        description: 'Clear',
        humidity: 65,
        windSpeed: 3,
    };
}
```

---

## ✋ 2. Permission Required Before These Actions

**Always stop and ask the user before doing any of the following.**
Do not proceed even if it seems like the obvious next step.

### Git operations

- `git push` (to any branch)
- `git push --force` or `git push -f`
- `git commit` (stage and commit any files)
- `git merge` or `git rebase`
- Creating or deleting branches
- Opening pull requests

### File deletions

- Deleting any source file (`*.ts`, `*.tsx`, `*.js`, `*.css`, `*.sql`)
- Deleting config files (`package.json`, `tsconfig.json`, `.env.example`, `tailwind.config.js`, etc.)
- Deleting entire folders

### Dependency changes

- Adding new packages (`npm install <package>`)
- Removing packages (`npm uninstall <package>`)
- Upgrading major versions

### Database operations

- Running any `DROP TABLE`, `DELETE`, `TRUNCATE`, or destructive `ALTER TABLE` SQL
- Applying migrations to a production Supabase project

### Production changes

- Updating environment variables in a live deployment
- Modifying any file named `*.prod.*` or inside a `production/` folder

### How to ask

Before any of these, say:

> "I need to [action]. For example: push this branch to origin, or delete `planController.js`. Should I proceed?"

Wait for an explicit **yes** before acting.

---

## 📝 3. Code Style — Universal Rules

These apply across all files in all layers.

### 3.1 Formatting

- **Indentation**: 2 spaces — never tabs
- **Quotes**: single quotes `'` in JS/TS — never double quotes (except in JSX string props)
- **Semicolons**: always (JS/TS)
- **Max line length**: 100 characters — break long lines
- **Trailing commas**: always in multi-line arrays and objects
- **Empty lines**: one blank line between logical sections — never two or more consecutive blank lines

```typescript
// ✅
const plan = {
    title: 'Makati Date Night',
    location: 'Makati',
    budget: 2000,
};

// ❌ double quotes, no trailing comma
const plan = {
    title: 'Makati Date Night',
    location: 'Makati',
    budget: 2000,
};
```

### 3.2 Imports — Order and Grouping

Always group imports in this order, with a blank line between each group:

```typescript
// 1. Node built-ins (backend only)
import path from 'path';
import fs from 'fs';

// 2. External packages
import express from 'express';
import axios from 'axios';

// 3. Internal — absolute or aliased paths
import { supabase } from '../config/supabase.js';
import { validate } from '../middleware/validate.js';

// 4. Types (always last)
import type { Plan } from '../../shared/types.js';
```

### 3.3 No `console.log` in Committed Code

`console.log` is for debugging only. Remove before committing.

```javascript
// ✅ Acceptable in development only (remove before commit)
console.log('DEBUG plan:', plan);

// ✅ Intentional logging — use descriptive prefix
console.error('[planController] Failed to create plan:', err.message);
console.warn('[weatherService] API key not set — using mock data');

// ❌ Never leave in production code
console.log(apiKey);
console.log('here');
console.log(req.body);
```

### 3.4 No Commented-Out Code in Commits

Commented-out code is noise. If you need to preserve something, use git history.

```typescript
// ❌ Do not commit commented-out code
// const oldFetch = await axios.get(url);
// if (result) {
//   doSomething();
// }

// ✅ Either keep it or delete it
```

Exception: commented-out code in `.env.example` as documentation is fine.

### 3.5 Function Length

Functions should be readable in one screen (~40 lines max).
If a function exceeds this, extract named sub-functions.

```typescript
// ❌ 80-line function doing everything
export const createPlan = async (req, res, next) => {
    // ... 80 lines of weather + AI + DB + email logic
};

// ✅ Orchestrator calls focused functions
export const createPlan = async (req, res, next) => {
    try {
        const context = await gatherPlanContext(req.body);
        const itinerary = await generateItinerary(context);
        const saved = await savePlanToDatabase(itinerary, req.body);
        res.status(201).json({ success: true, ...saved });
    } catch (err) {
        next(err);
    }
};
```

### 3.6 Descriptive Variable Names

No single letters, abbreviations, or vague names in committed code.

```typescript
// ✅
const activityList = [];
const isWeatherLoading = false;
const currentPlanId = req.params.id;

// ❌
const a = [];
const flag = false;
const id = req.params.id;
const tmp = await fetchData();
const res2 = await axios.get(url);
```

### 3.7 No `any` Type

Use `unknown` if the type is truly dynamic, then narrow it.

```typescript
// ✅
function parseResponse(data: unknown): Plan {
    if (typeof data !== 'object' || data === null)
        throw new Error('Invalid response');
    return data as Plan;
}

// ❌
function parseResponse(data: any): any {
    return data;
}
```

---

## 🔁 4. Change Proposal Rules

When making changes to existing code (not creating new files), always:

1. **Show what will change** before applying it — describe the before/after
2. **Change one thing at a time** — don't bundle unrelated refactors with feature work
3. **State which files will be modified** before touching them
4. **Never silently rename** exported functions, types, or database columns — these are breaking changes that need coordination

```
✅ Before editing planController.js:
"I'm going to update createPlan() in planController.js to add the date field.
The only change is adding `date` to the destructured body and passing it to the service.
Should I proceed?"

❌ Silently refactoring 4 files while fixing a bug in one
```

---

## 🗂️ 5. File Creation Rules

Before creating a new file:

- Check if a similar file already exists
- Place it in the correct folder per the project structure in `anong_ganap_coding_guidelines.md`
- Follow the naming convention for that file type
- Never create files outside the defined project structure without asking first

```
✅ Creating a new hook:
mobile/hooks/useOutfit.ts   ← correct location

❌ Creating files in wrong locations:
mobile/useOutfit.ts         ← missing hooks/ folder
mobile/app/useOutfit.ts     ← hooks don't go in app/
```

---

## 🚫 6. What Agents Must Never Do (Unconditionally)

These are hard stops — no exceptions, no asking:

| Action                                                      | Reason                 |
| ----------------------------------------------------------- | ---------------------- |
| Read and print `.env` contents                              | Exposes secrets        |
| Hardcode API keys in source files                           | Security risk          |
| Run `git push` without permission                           | Irreversible on remote |
| Run `DROP TABLE` or `DELETE FROM` without explicit approval | Data loss              |
| Delete source files without explicit approval               | Irreversible           |
| Install packages without telling the user                   | Breaks reproducibility |
| Modify `package.json` version fields                        | Can break installs     |
| Write to `*.prod.*` config files                            | Affects live users     |

---

## ✅ 7. Pre-Action Checklist

Before writing or modifying any code, confirm:

- [ ] I know which layer this code belongs to (route / controller / service / model / component)
- [ ] I am not touching files outside my agent's scope
- [ ] I am not reading or printing any secret values
- [ ] I am not committing or pushing without permission
- [ ] The change follows the naming conventions in `anong_ganap_coding_guidelines.md`
- [ ] I have described what I'm about to change before making the change
