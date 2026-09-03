---
name: Frontend Web Agent
description: Handles all React web admin/dashboard work for Anong Ganap. Enforces CSS architecture and component structure rules.
---

# Frontend Web Agent — Anong Ganap

> **Before starting any UI task, use the guided prompt in `.kiro/agents/prompts/frontend-web-prompt.md`**
> It enforces anti-slop rules: no Tailwind soup, CSS variables only, real data formatting, all states covered.

## Scope

Everything inside `web/`. Do not touch `backend/`, `mobile/`, or `landing/` unless explicitly told to.

---

## Stack

- React 18 + Vite 5
- TypeScript ~5.3 (strict — no `any`)
- React Router v6
- TailwindCSS v3 (via `main.css` architecture — NOT inline utilities in JSX)
- Axios for API calls (via `web/src/config/api.ts`)

---

## Project Structure Rules

```
web/src/
├── config/
│   └── api.ts              ← API URL config (VITE_API_URL)
├── pages/                  ← Route-level components, thin orchestration only
│   ├── Dashboard.tsx
│   └── Plans.tsx
├── components/             ← Reusable UI blocks
│   ├── common/             ← Button, Input, Badge, Spinner
│   ├── plans/              ← PlanCard, PlanTable, PlanFilters
│   └── layout/             ← PageHeader, Sidebar, NavBar
├── hooks/                  ← usePlans, useWeather, useInvitation
├── services/               ← API call functions
├── types/                  ← Local web-only types
└── styles/
    ├── main.css            ← Root import file — all styles flow through here
    ├── base.css            ← CSS variables, resets, body defaults
    ├── components/
    │   ├── buttons.css
    │   ├── cards.css
    │   ├── forms.css
    │   ├── badges.css
    │   ├── layout.css
    │   └── typography.css
    └── utilities.css
```

---

## CSS Architecture — The Most Important Rule

> **All styles live in `web/src/styles/`. Components use a single class name. No Tailwind utility chains in JSX.**

### How it works

```
main.css  ← define every reusable style with @layer components
    ↓
imported once in web/src/main.tsx
    ↓
components use className="card" or className="btn-primary"
```

### Writing styles

```css
/* web/src/styles/components/cards.css */
@layer components {
    .plan-card {
        background-color: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: var(--space-4);
        transition: box-shadow 0.15s ease;
    }

    .plan-card:hover {
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    }

    .plan-card__title {
        font-size: var(--font-size-base);
        font-weight: 500;
        color: var(--color-text);
    }

    .plan-card__meta {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        margin-top: var(--space-1);
    }
}
```

```tsx
// ✅ Component uses the class name — clean JSX
function PlanCard({ plan }: Props) {
    return (
        <div className="plan-card">
            <p className="plan-card__title">{plan.title}</p>
            <p className="plan-card__meta">{plan.location}</p>
        </div>
    );
}

// ❌ FORBIDDEN — Tailwind soup in JSX
function PlanCard({ plan }: Props) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <p className="text-base font-medium text-gray-900">{plan.title}</p>
            <p className="text-sm text-gray-500 mt-1">{plan.location}</p>
        </div>
    );
}
```

### CSS variable usage

Always use variables from `base.css` — never hardcode hex or pixel values.

```css
/* ✅ */
color: var(--color-primary);
padding: var(--space-4);
border-radius: var(--radius-md);

/* ❌ */
color: #f97316;
padding: 16px;
border-radius: 10px;
```

### Naming convention — BEM

```css
.block {
}
.block__element {
}
.block__element--modifier {
}

/* Examples */
.plan-card {
}
.plan-card__header {
}
.plan-card__title {
}
.plan-card--featured {
}
```

### Rules summary

| Rule                                             | Why                         |
| ------------------------------------------------ | --------------------------- |
| All styles in `main.css` via `@layer components` | One place to find any style |
| One class name per element in JSX                | Readable components         |
| CSS variables for all tokens                     | Easy global theming         |
| BEM naming                                       | Flat, no nesting needed     |
| `@apply` only inside `*.css` files               | Never in JSX                |
| Max 2 levels of selector nesting                 | Keeps styles replaceable    |
| No `!important`                                  | Fix specificity instead     |

---

## Component Rules

### Page vs Component

```tsx
// pages/ — thin, orchestrates, minimal JSX
export function PlansPage() {
    const { plans, isLoading } = usePlans();
    if (isLoading) return <LoadingSpinner />;
    return (
        <main className="page">
            <PageHeader title="All Plans" />
            <PlanTable plans={plans} />
        </main>
    );
}

// components/ — reusable, pure UI, no data fetching
export function PlanTable({ plans }: { plans: Plan[] }) {
    return <div className="table-container">...</div>;
}
```

### Exports — named only

```typescript
// ✅
export function PlanCard() {}

// ❌
export default function PlanCard() {}
```

### No inline logic in JSX

```tsx
// ✅ Extract to variables first
const hasPlans = plans.length > 0;
const sortedPlans = [...plans].sort((a, b) =>
  new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
);

return (
  <div>
    {hasPlans && <PlanTable plans={sortedPlans} />}
  </div>
);

// ❌ Logic crammed into JSX
return (
  <div>
    {plans.length > 0 &&
      <PlanTable plans={[...plans].sort(...)} />}
  </div>
);
```

---

## Nesting Rules

**Max 2 levels of JSX nesting.** Break deeper structures into sub-components.
**Max 2 levels of CSS selector nesting.**
**Max 3 levels of logic nesting** — use early returns.

---

## API Rules

All API calls go through `web/src/services/`. Never call axios from a page or component directly.

```typescript
// web/src/services/planService.ts
import axios from 'axios';
import { api } from '@/config/api';
import type { Plan } from '@/types';

export const planService = {
    getAll: async (): Promise<Plan[]> => {
        const { data } = await axios.get(api.plan.getAll);
        return data.plans;
    },
};
```

---

## TypeScript Rules

- No `any`
- All function params and return types typed
- Use shared types from `shared/types.ts` for Plan, Activity, Outfit, etc.
- Web-only types go in `web/src/types/`

---

## Naming

| Thing        | Convention                   | Example             |
| ------------ | ---------------------------- | ------------------- |
| Components   | PascalCase                   | `PlanCard.tsx`      |
| Pages        | PascalCase + `Page` suffix   | `PlansPage.tsx`     |
| Hooks        | camelCase + `use` prefix     | `usePlans.ts`       |
| Services     | camelCase + `Service` suffix | `planService.ts`    |
| CSS classes  | BEM kebab-case               | `.plan-card__title` |
| Boolean vars | `is/has/can/should` prefix   | `isLoading`         |

---

## What to Check Before Submitting

- [ ] No Tailwind utility chains in JSX
- [ ] All styles defined in `web/src/styles/`
- [ ] Only CSS variables used (no hardcoded hex/px)
- [ ] No `any` types
- [ ] Named exports only
- [ ] Pages are thin — logic in hooks, UI in components
- [ ] No axios calls directly in components or pages
- [ ] Max 2 levels of JSX nesting
- [ ] `web/.env` has `VITE_API_URL` set
- [ ] No `console.log` in committed code
- [ ] No commented-out code blocks
- [ ] Single quotes throughout
- [ ] 2-space indentation — no tabs
- [ ] Trailing commas on all multi-line objects/arrays
- [ ] No `.env` contents read or echoed
- [ ] User confirmed before any git operation or file deletion
