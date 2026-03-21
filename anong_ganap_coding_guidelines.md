# Anong Ganap? — Coding Guidelines

> **This document is the single source of truth for all code written in this project.**
> Every developer — frontend, backend, or fullstack — must read and follow these guidelines before writing a single line of code.

---

## Table of Contents

1. [Core Philosophy](#1-core-philosophy)
2. [Project Structure](#2-project-structure)
3. [Naming Conventions](#3-naming-conventions)
4. [General Code Rules](#4-general-code-rules)
5. [Nesting Rules — Flat is Always Better](#5-nesting-rules--flat-is-always-better)
6. [Frontend — React Native](#6-frontend--react-native)
7. [Frontend — Web (React)](#7-frontend--web-react)
8. [Styling Guidelines — Tailwind + main.css](#8-styling-guidelines--tailwind--maincss)
9. [Backend — Node.js + Express](#9-backend--nodejs--express)
10. [Database — Supabase / PostgreSQL](#10-database--supabase--postgresql)
11. [API Design Standards](#11-api-design-standards)
12. [Swagger / OpenAPI Documentation](#12-swagger--openapi-documentation)
13. [Environment & Config](#13-environment--config)
14. [Error Handling](#14-error-handling)
15. [Git Workflow](#15-git-workflow)
16. [Comments & Documentation](#16-comments--documentation)
17. [Code Review Checklist](#17-code-review-checklist)

---

## 1. Core Philosophy

These four principles govern every decision made in this codebase:

```
Readable   >   Clever
Consistent >   Personal preference
Explicit   >   Implicit
Simple     >   Over-engineered
```

When in doubt, write code that the next developer can understand without asking you.

---

## 2. Project Structure

### 2.1 Mobile App (React Native)

```
mobile/
├── app/                        # Expo Router screens
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/
│   │   ├── home.tsx
│   │   ├── plan.tsx
│   │   └── memories.tsx
│   └── _layout.tsx
│
├── components/                 # Reusable UI components
│   ├── common/                 # Buttons, inputs, cards
│   │   ├── AppButton.tsx
│   │   ├── AppInput.tsx
│   │   └── AppCard.tsx
│   ├── itinerary/
│   │   ├── ActivityCard.tsx
│   │   ├── TimelineItem.tsx
│   │   └── WeatherBadge.tsx
│   ├── outfit/
│   │   └── OutfitSuggestion.tsx
│   └── invitation/
│       └── InvitationPreview.tsx
│
├── hooks/                      # Custom hooks
│   ├── usePlan.ts
│   ├── useWeather.ts
│   └── useLocation.ts
│
├── services/                   # API call functions
│   ├── api.ts                  # Axios instance + base config
│   ├── planService.ts
│   ├── weatherService.ts
│   └── outfitService.ts
│
├── store/                      # Global state (Zustand)
│   ├── usePlanStore.ts
│   └── useUserStore.ts
│
├── types/                      # TypeScript interfaces
│   ├── plan.types.ts
│   ├── user.types.ts
│   └── api.types.ts
│
├── utils/                      # Pure helper functions
│   ├── formatCurrency.ts
│   ├── formatTime.ts
│   └── weatherHelpers.ts
│
├── constants/                  # App-wide constants
│   ├── colors.ts
│   ├── spacing.ts
│   └── endpoints.ts
│
└── assets/
    ├── fonts/
    └── images/
```

### 2.2 Web Admin (React)

```
web/
├── src/
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   └── PlanDetails.tsx
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   └── utils/
├── public/
└── index.html
```

### 2.3 Backend (Node.js + Express)

```
backend/
├── src/
│   ├── routes/                 # Route declarations only
│   │   ├── plan.routes.ts
│   │   ├── outfit.routes.ts
│   │   ├── weather.routes.ts
│   │   └── invitation.routes.ts
│   │
│   ├── controllers/            # Request handlers
│   │   ├── plan.controller.ts
│   │   ├── outfit.controller.ts
│   │   ├── weather.controller.ts
│   │   └── invitation.controller.ts
│   │
│   ├── services/               # Business logic
│   │   ├── ai.service.ts
│   │   ├── plan.service.ts
│   │   ├── outfit.service.ts
│   │   ├── weather.service.ts
│   │   └── invitation.service.ts
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── validate.middleware.ts
│   │   └── errorHandler.middleware.ts
│   │
│   ├── models/                 # DB query functions
│   │   ├── plan.model.ts
│   │   ├── activity.model.ts
│   │   └── user.model.ts
│   │
│   ├── validators/             # Request body schemas
│   │   ├── plan.validator.ts
│   │   └── invitation.validator.ts
│   │
│   ├── types/
│   │   ├── plan.types.ts
│   │   └── express.d.ts
│   │
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── apiError.ts
│   │   └── formatResponse.ts
│   │
│   ├── config/
│   │   ├── db.ts
│   │   └── env.ts
│   │
│   └── app.ts                  # Express app setup
│
├── index.ts                    # Server entry point
├── .env
├── .env.example
└── tsconfig.json
```

---

## 3. Naming Conventions

### 3.1 Files and Folders

| Type | Convention | Example |
|------|------------|---------|
| React components | PascalCase | `ActivityCard.tsx` |
| Hooks | camelCase with `use` prefix | `usePlan.ts` |
| Services | camelCase with `.service` suffix | `plan.service.ts` |
| Controllers | camelCase with `.controller` suffix | `plan.controller.ts` |
| Routes | camelCase with `.routes` suffix | `plan.routes.ts` |
| Types/interfaces | camelCase with `.types` suffix | `plan.types.ts` |
| Utilities | camelCase | `formatCurrency.ts` |
| Constants | camelCase | `colors.ts` |
| Folders | kebab-case or camelCase | `common/`, `itinerary/` |

### 3.2 Variables and Functions

```typescript
// ✅ Variables — camelCase, descriptive
const activityList = [];
const isWeatherLoading = false;
const selectedBudget = 1000;

// ❌ Never — vague, single letters, or abbreviations
const a = [];
const d = false;
const b = 1000;

// ✅ Functions — camelCase, verb-first
function generateItinerary() {}
function fetchNearbyPlaces() {}
function formatActivityTime() {}

// ❌ Never — noun-only or unclear intent
function itinerary() {}
function places() {}
function time() {}

// ✅ Boolean variables — start with is / has / can / should
const isLoading = true;
const hasWeatherData = false;
const canSendInvitation = true;
const shouldShowOutfit = false;
```

### 3.3 TypeScript Interfaces and Types

```typescript
// ✅ Interfaces — PascalCase, descriptive nouns
interface Plan {
  id: string;
  userId: string;
  title: string;
  budget: number;
  location: string;
  activities: Activity[];
  createdAt: Date;
}

interface Activity {
  id: string;
  planId: string;
  name: string;
  placeName: string;
  estimatedCost: number;
  startTime: string;
  isOutdoor: boolean;
}

// ✅ Type aliases — PascalCase
type ActivityType = 'date' | 'hangout' | 'family' | 'solo';
type WeatherCondition = 'Clear' | 'Rain' | 'Clouds' | 'Hot';

// ✅ API response wrappers
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface ApiError {
  success: false;
  error: string;
  statusCode: number;
}
```

### 3.4 Constants

```typescript
// ✅ Constants — SCREAMING_SNAKE_CASE
const MAX_BUDGET = 10000;
const DEFAULT_ACTIVITY_DURATION = 90; // minutes
const API_TIMEOUT = 5000; // ms

// ✅ Object constant keys — SCREAMING_SNAKE_CASE
const WEATHER_CONDITIONS = {
  CLEAR: 'Clear',
  RAIN: 'Rain',
  CLOUDS: 'Clouds',
} as const;

const ACTIVITY_TYPES = {
  DATE: 'date',
  HANGOUT: 'hangout',
  FAMILY: 'family',
  SOLO: 'solo',
} as const;
```

### 3.5 Database (SQL)

```sql
-- Tables — snake_case, plural
users
activity_plans
plan_activities
outfit_suggestions
invitation_records

-- Columns — snake_case
user_id
plan_id
activity_name
start_time
estimated_cost
is_outdoor
created_at
updated_at

-- Indexes — idx_{table}_{column}
idx_plans_user_id
idx_activities_plan_id
```

---

## 4. General Code Rules

### 4.1 TypeScript — Always

```typescript
// ✅ Always type function parameters and return values
function calculateTotalCost(activities: Activity[]): number {
  return activities.reduce((sum, activity) => sum + activity.estimatedCost, 0);
}

// ✅ Never use `any` — use `unknown` if type is truly unknown
function parseApiResponse(data: unknown): Plan {
  // validate and cast
}

// ❌ Forbidden
function doSomething(data: any): any {
  return data;
}
```

### 4.2 Functions — One Responsibility

```typescript
// ✅ One function does one thing
function filterOutdoorActivities(activities: Activity[]): Activity[] {
  return activities.filter((a) => a.isOutdoor);
}

function filterByBudget(activities: Activity[], maxBudget: number): Activity[] {
  return activities.filter((a) => a.estimatedCost <= maxBudget);
}

// ❌ Avoid functions that do too much
function processActivities(activities: Activity[], budget: number, weather: string) {
  // filtering + budget checking + weather logic all in one — split these up
}
```

### 4.3 Early Returns

```typescript
// ✅ Fail fast — handle errors and edge cases first
function getWeatherOutfitNote(condition: string): string {
  if (!condition) return 'Dress comfortably.';
  if (condition === 'Rain') return 'Bring a raincoat and umbrella.';
  if (condition === 'Clear') return 'Light clothing and sunglasses recommended.';
  return 'Check the forecast before heading out.';
}

// ❌ Avoid deeply nested if-else chains
function getWeatherOutfitNote(condition: string): string {
  if (condition) {
    if (condition === 'Rain') {
      return 'Bring a raincoat...';
    } else {
      if (condition === 'Clear') {
        return 'Light clothing...';
      }
    }
  }
  return 'Default';
}
```

### 4.4 No Magic Numbers or Strings

```typescript
// ✅ Always name your values
const MAX_ACTIVITIES_PER_PLAN = 8;
const MIN_BUDGET_PHP = 100;

if (activities.length > MAX_ACTIVITIES_PER_PLAN) {
  throw new Error('Too many activities in one plan.');
}

// ❌ Magic numbers are unreadable
if (activities.length > 8) {
  throw new Error('Too many activities.');
}
```

### 4.5 Immutability

```typescript
// ✅ Never mutate parameters — return new values
function addActivity(plan: Plan, activity: Activity): Plan {
  return {
    ...plan,
    activities: [...plan.activities, activity],
  };
}

// ❌ Do not mutate the original object
function addActivity(plan: Plan, activity: Activity): void {
  plan.activities.push(activity); // mutates — avoid
}
```

---

## 5. Nesting Rules — Flat is Always Better

> **Rule: Maximum 2 levels of nesting in JSX. Maximum 2 levels in CSS/Tailwind selectors. Maximum 3 levels in logic (if/else, loops).**
> Deep nesting is the number one cause of unreadable, unmaintainable code. It cannot be searched, it cannot be refactored safely, and it breaks git diffs.

### 5.1 JSX — No Deep Nesting

```tsx
// ❌ BAD — 5 levels deep, impossible to scan
function ActivityCard({ activity }: Props) {
  return (
    <View>
      <View>
        <View>
          <View>
            <Text>{activity.name}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ✅ GOOD — extract into named sub-components
function ActivityCard({ activity }: Props) {
  return (
    <View className="activity-card">
      <ActivityHeader name={activity.name} time={activity.startTime} />
      <ActivityBody cost={activity.estimatedCost} location={activity.placeName} />
    </View>
  );
}

function ActivityHeader({ name, time }: { name: string; time: string }) {
  return (
    <View className="activity-header">
      <Text className="activity-title">{name}</Text>
      <Text className="activity-time">{time}</Text>
    </View>
  );
}

function ActivityBody({ cost, location }: { cost: number; location: string }) {
  return (
    <View className="activity-body">
      <Text className="activity-location">{location}</Text>
      <Text className="activity-cost">₱{cost}</Text>
    </View>
  );
}
```

### 5.2 Logic — No Deep Nesting

```typescript
// ❌ BAD — 4 levels of nesting, hard to follow
function getOutfitTheme(weather: string, activityType: string, timeOfDay: string) {
  if (weather) {
    if (activityType === 'date') {
      if (weather === 'Rain') {
        if (timeOfDay === 'evening') {
          return 'Cozy Evening Rainy Date';
        } else {
          return 'Rainy Daytime Date';
        }
      } else {
        return 'Sunny Date';
      }
    }
  }
  return 'Casual';
}

// ✅ GOOD — flat, early returns, readable
function getOutfitTheme(weather: string, activityType: string, timeOfDay: string): string {
  if (!weather || activityType !== 'date') return 'Casual';
  if (weather === 'Rain' && timeOfDay === 'evening') return 'Cozy Evening Rainy Date';
  if (weather === 'Rain') return 'Rainy Daytime Date';
  return 'Sunny Date';
}
```

### 5.3 CSS / Tailwind — No Deep Selector Nesting

```css
/* ❌ BAD — deeply nested selectors in CSS */
.plan-card {
  .header {
    .content {
      .title {
        .icon {
          color: orange;
        }
      }
    }
  }
}

/* ✅ GOOD — flat, BEM-style class names in main.css */
.plan-card { }
.plan-card__header { }
.plan-card__title { }
.plan-card__icon { }
```

### 5.4 Objects and Config — No Deep Nesting

```typescript
// ❌ BAD — deeply nested config object
const config = {
  api: {
    services: {
      weather: {
        endpoints: {
          forecast: '/forecast',
        },
      },
    },
  },
};
// Used as: config.api.services.weather.endpoints.forecast

// ✅ GOOD — flat, named constants
const WEATHER_FORECAST_ENDPOINT = '/forecast';
const WEATHER_CURRENT_ENDPOINT = '/weather';
```

---

## 6. Frontend — React Native

### 6.1 Component Structure

Every component file follows this exact order:

```typescript
// 1. Imports — external libraries first, then internal
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import { ActivityCard } from '@/components/itinerary/ActivityCard';
import { usePlan } from '@/hooks/usePlan';
import { formatActivityTime } from '@/utils/formatTime';
import { colors, spacing } from '@/constants';
import type { Activity } from '@/types/plan.types';

// 2. Types / interfaces for this component only
interface Props {
  activity: Activity;
  onPress: (id: string) => void;
  isHighlighted?: boolean;
}

// 3. Component — functional, typed props
export function TimelineItem({ activity, onPress, isHighlighted = false }: Props) {
  // 3a. State
  const [isExpanded, setIsExpanded] = useState(false);

  // 3b. Hooks
  const { selectedPlan } = usePlan();

  // 3c. Derived values
  const formattedTime = formatActivityTime(activity.startTime);

  // 3d. Handlers
  const handlePress = () => {
    onPress(activity.id);
    setIsExpanded((prev) => !prev);
  };

  // 3e. Effects
  useEffect(() => {
    // side effects go here
  }, [activity.id]);

  // 3f. Render
  return (
    <Pressable style={[styles.container, isHighlighted && styles.highlighted]} onPress={handlePress}>
      <Text style={styles.time}>{formattedTime}</Text>
      <Text style={styles.name}>{activity.name}</Text>
    </Pressable>
  );
}

// 4. Styles — at the bottom, always
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  highlighted: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  time: {
    fontSize: 13,
    color: colors.textSecondary,
    width: 56,
  },
  name: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
  },
});
```

### 6.2 Component Rules

```typescript
// ✅ Named exports only — no default exports for components
export function ActivityCard() {}

// ❌ Avoid default exports — harder to trace in large codebases
export default function ActivityCard() {}

// ✅ Destructure props — never use props.something
function WeatherBadge({ condition, temperature }: Props) {}

// ❌ Avoid
function WeatherBadge(props: Props) {
  return <Text>{props.condition}</Text>;
}
```

### 6.3 Lists and Keys

```typescript
// ✅ Always use stable, unique keys — never array index
activities.map((activity) => (
  <ActivityCard key={activity.id} activity={activity} />
));

// ❌ Index as key causes rendering bugs
activities.map((activity, index) => (
  <ActivityCard key={index} activity={activity} />
));
```

### 6.4 Custom Hooks

```typescript
// ✅ Extract logic into hooks — keep components thin
// hooks/usePlan.ts
export function usePlan() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlan = async (planId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await planService.getById(planId);
      setPlan(data);
    } catch (err) {
      setError('Failed to load plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return { plan, isLoading, error, fetchPlan };
}
```

---

## 7. Frontend — Web (React)

### 7.1 Page vs Component

```typescript
// pages/ — route-level components, minimal logic
// components/ — reusable, pure UI blocks

// ✅ Page: thin, orchestrates components + hooks
export function DashboardPage() {
  const { plans, isLoading } = usePlans();

  if (isLoading) return <LoadingSpinner />;

  return (
    <main className="dashboard">
      <PageHeader title="Plans" />
      <PlanGrid plans={plans} />
    </main>
  );
}
```

### 7.2 Avoid Inline Logic in JSX

```tsx
// ✅ Extract to variables
const hasActivities = activities.length > 0;
const sortedActivities = [...activities].sort((a, b) =>
  a.startTime.localeCompare(b.startTime)
);

return (
  <View>
    {hasActivities && <ActivityList activities={sortedActivities} />}
  </View>
);

// ❌ Do not cram logic into JSX
return (
  <View>
    {activities.length > 0 &&
      <ActivityList
        activities={[...activities].sort((a, b) => a.startTime.localeCompare(b.startTime))}
      />}
  </View>
);
```

---

## 8. Styling Guidelines — Tailwind + main.css

> **The rule: All reusable styles are defined once in `main.css` using `@layer components`. Components call a single class name. No Tailwind utility soup in JSX files.**

This keeps JSX clean, makes styles searchable and replaceable in one place, and lets every developer know exactly where the styles live.

### 8.1 How It Works

```
main.css  ← define all component styles here using @layer components
    │
    └── imported once in main.tsx / index.tsx
            │
            └── every component just uses the class name
                  e.g. className="activity-card"
```

### 8.2 File Structure

```
web/src/styles/
├── main.css              ← root file, imports everything below
├── base.css              ← resets, root variables, body defaults
├── components/
│   ├── buttons.css       ← .btn, .btn-primary, .btn-ghost
│   ├── cards.css         ← .card, .activity-card, .outfit-card
│   ├── forms.css         ← .input, .label, .form-group
│   ├── badges.css        ← .badge, .weather-badge
│   ├── layout.css        ← .container, .page, .section
│   └── typography.css    ← .heading, .subtext, .label-sm
└── utilities.css         ← one-off helpers only (not reused styles)
```

### 8.3 `main.css` — Root Import File

```css
/* web/src/styles/main.css */
/* Import order matters — base first, then components, then utilities */

@import "tailwindcss";

@import "./base.css";
@import "./components/typography.css";
@import "./components/layout.css";
@import "./components/buttons.css";
@import "./components/cards.css";
@import "./components/forms.css";
@import "./components/badges.css";
@import "./utilities.css";
```

```tsx
/* web/src/main.tsx — imported once at the root */
import './styles/main.css';
```

### 8.4 `base.css` — Tokens and Resets

```css
/* styles/base.css */

@layer base {
  :root {
    /* Brand */
    --color-primary:        #F97316;
    --color-primary-light:  #FED7AA;
    --color-primary-dark:   #C2410C;

    /* Backgrounds */
    --color-bg:             #FAFAF9;
    --color-surface:        #FFFFFF;
    --color-surface-muted:  #F5F4F2;

    /* Borders */
    --color-border:         #E5E5E3;
    --color-border-strong:  #D1D0CE;

    /* Text */
    --color-text:           #1C1B1A;
    --color-text-secondary: #6B6A67;
    --color-text-muted:     #9CA3AF;
    --color-text-inverse:   #FFFFFF;

    /* Semantic */
    --color-success:        #16A34A;
    --color-warning:        #D97706;
    --color-error:          #DC2626;
    --color-info:           #2563EB;

    /* Weather */
    --color-sunny:          #F59E0B;
    --color-rainy:          #3B82F6;
    --color-cloudy:         #6B7280;

    /* Spacing scale */
    --space-1: 4px;
    --space-2: 8px;
    --space-3: 12px;
    --space-4: 16px;
    --space-5: 24px;
    --space-6: 32px;
    --space-7: 48px;

    /* Radius */
    --radius-sm:  6px;
    --radius-md:  10px;
    --radius-lg:  14px;
    --radius-xl:  20px;
    --radius-full: 9999px;

    /* Typography */
    --font-sans: 'Plus Jakarta Sans', sans-serif;
    --font-size-xs:   11px;
    --font-size-sm:   13px;
    --font-size-base: 15px;
    --font-size-md:   17px;
    --font-size-lg:   20px;
    --font-size-xl:   24px;
    --font-size-2xl:  30px;
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: var(--font-sans);
    font-size: var(--font-size-base);
    color: var(--color-text);
    background-color: var(--color-bg);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }
}
```

### 8.5 `components/cards.css` — Example Component Layer

```css
/* styles/components/cards.css */

@layer components {

  /* Base card — all cards inherit this */
  .card {
    @apply bg-white rounded-xl border border-gray-100 p-4;
    background-color: var(--color-surface);
    border-color: var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
  }

  /* Activity card — shown in the itinerary timeline */
  .activity-card {
    @apply card flex items-start gap-3;
    transition: box-shadow 0.15s ease;
  }

  .activity-card:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  }

  .activity-card__time {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    min-width: 52px;
    padding-top: 2px;
  }

  .activity-card__body {
    flex: 1;
  }

  .activity-card__name {
    font-size: var(--font-size-base);
    font-weight: 500;
    color: var(--color-text);
  }

  .activity-card__location {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin-top: var(--space-1);
  }

  .activity-card__cost {
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--color-primary);
    margin-top: var(--space-1);
  }

  /* Outfit card */
  .outfit-card {
    @apply card;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4);
  }

  .outfit-card__person {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .outfit-card__label {
    font-size: var(--font-size-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--color-text-muted);
  }

  .outfit-card__item {
    font-size: var(--font-size-sm);
    color: var(--color-text);
  }
}
```

### 8.6 `components/buttons.css`

```css
/* styles/components/buttons.css */

@layer components {

  /* Base button — all buttons extend this */
  .btn {
    @apply inline-flex items-center justify-center gap-2;
    font-size: var(--font-size-sm);
    font-weight: 500;
    border-radius: var(--radius-md);
    padding: var(--space-2) var(--space-4);
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
    text-decoration: none;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Primary — main CTA */
  .btn-primary {
    @apply btn;
    background-color: var(--color-primary);
    color: var(--color-text-inverse);
  }

  .btn-primary:hover {
    background-color: var(--color-primary-dark);
  }

  /* Secondary — subdued action */
  .btn-secondary {
    @apply btn;
    background-color: var(--color-surface-muted);
    color: var(--color-text);
    border-color: var(--color-border);
  }

  .btn-secondary:hover {
    background-color: var(--color-border);
  }

  /* Ghost — for less prominent actions */
  .btn-ghost {
    @apply btn;
    background-color: transparent;
    color: var(--color-text-secondary);
  }

  .btn-ghost:hover {
    background-color: var(--color-surface-muted);
    color: var(--color-text);
  }

  /* Size variants */
  .btn-sm {
    font-size: var(--font-size-xs);
    padding: var(--space-1) var(--space-3);
  }

  .btn-lg {
    font-size: var(--font-size-md);
    padding: var(--space-3) var(--space-6);
    border-radius: var(--radius-lg);
  }
}
```

### 8.7 `components/forms.css`

```css
/* styles/components/forms.css */

@layer components {

  .form-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .label {
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--color-text);
  }

  .label-hint {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    font-weight: 400;
  }

  .input {
    width: 100%;
    font-size: var(--font-size-base);
    color: var(--color-text);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-2) var(--space-3);
    height: 40px;
    outline: none;
    transition: border-color 0.15s ease;
    font-family: var(--font-sans);
  }

  .input:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.12);
  }

  .input::placeholder {
    color: var(--color-text-muted);
  }

  .input-error {
    border-color: var(--color-error);
  }

  .input-error:focus {
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.12);
  }

  .error-message {
    font-size: var(--font-size-xs);
    color: var(--color-error);
  }
}
```

### 8.8 `components/badges.css`

```css
/* styles/components/badges.css */

@layer components {

  .badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    font-size: var(--font-size-xs);
    font-weight: 500;
    padding: 2px 10px;
    border-radius: var(--radius-full);
    white-space: nowrap;
  }

  /* Weather badges */
  .badge-sunny {
    @apply badge;
    background-color: #FEF9C3;
    color: #92400E;
  }

  .badge-rainy {
    @apply badge;
    background-color: #DBEAFE;
    color: #1E40AF;
  }

  .badge-cloudy {
    @apply badge;
    background-color: #F3F4F6;
    color: #374151;
  }

  /* Status badges */
  .badge-success {
    @apply badge;
    background-color: #DCFCE7;
    color: #166534;
  }

  .badge-warning {
    @apply badge;
    background-color: #FEF3C7;
    color: #92400E;
  }

  .badge-error {
    @apply badge;
    background-color: #FEE2E2;
    color: #991B1B;
  }

  /* Activity type badges */
  .badge-date     { @apply badge; background-color: #FDF2F8; color: #9D174D; }
  .badge-hangout  { @apply badge; background-color: #EEF2FF; color: #3730A3; }
  .badge-family   { @apply badge; background-color: #ECFDF5; color: #065F46; }
  .badge-solo     { @apply badge; background-color: #FFF7ED; color: #9A3412; }
}
```

### 8.9 How to Use in Components — The Right Way

```tsx
// ✅ CORRECT — single class name, all styling in main.css
function ActivityCard({ activity }: Props) {
  return (
    <div className="activity-card">
      <span className="activity-card__time">{activity.startTime}</span>
      <div className="activity-card__body">
        <p className="activity-card__name">{activity.name}</p>
        <p className="activity-card__location">{activity.placeName}</p>
        <p className="activity-card__cost">₱{activity.estimatedCost}</p>
      </div>
    </div>
  );
}

// ❌ WRONG — Tailwind soup directly in JSX
function ActivityCard({ activity }: Props) {
  return (
    <div className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <span className="text-sm text-gray-500 min-w-[52px] pt-0.5">{activity.startTime}</span>
      <div className="flex-1">
        <p className="text-base font-medium text-gray-900">{activity.name}</p>
        <p className="text-sm text-gray-500 mt-1">{activity.placeName}</p>
        <p className="text-sm font-medium text-orange-500 mt-1">₱{activity.estimatedCost}</p>
      </div>
    </div>
  );
}
```

### 8.10 Rules Summary

| Rule | Reason |
|------|--------|
| All styles defined in `main.css` via `@layer components` | One place to find any style |
| Components use one class name per element | JSX stays readable |
| CSS variables for all colors, spacing, and radii | Easy global theming |
| Never hardcode hex values in CSS | Use variables from `base.css` |
| BEM naming: `.block__element--modifier` | Flat, predictable, no nesting needed |
| Tailwind `@apply` only inside `main.css` | Never in JSX class attributes |
| Max 2 levels of CSS selector nesting | Keeps styles replaceable |
| No `!important` | Fix the specificity instead |

---

## 9. Backend — Node.js + Express

### 9.1 Layer Separation — Strict Rules

```
Route     → declares the path and calls the controller
Controller → validates input, calls service, sends response
Service    → contains all business logic
Model      → contains all database queries
```

```typescript
// ✅ routes/plan.routes.ts — declarations only
import { Router } from 'express';
import { PlanController } from '@/controllers/plan.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { validatePlanInput } from '@/validators/plan.validator';

const router = Router();

router.post('/', authenticate, validatePlanInput, PlanController.create);
router.get('/:id', authenticate, PlanController.getById);

export default router;
```

```typescript
// ✅ controllers/plan.controller.ts — handles HTTP, nothing else
import { Request, Response, NextFunction } from 'express';
import { PlanService } from '@/services/plan.service';
import { ApiError } from '@/utils/apiError';

export class PlanController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await PlanService.createPlan(req.user.id, req.body);
      res.status(201).json({ success: true, data: plan });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await PlanService.getPlanById(req.params.id, req.user.id);
      if (!plan) throw new ApiError(404, 'Plan not found.');
      res.status(200).json({ success: true, data: plan });
    } catch (error) {
      next(error);
    }
  }
}
```

```typescript
// ✅ services/plan.service.ts — all business logic lives here
import { PlanModel } from '@/models/plan.model';
import { AIService } from '@/services/ai.service';
import { WeatherService } from '@/services/weather.service';
import type { CreatePlanInput, Plan } from '@/types/plan.types';

export class PlanService {
  static async createPlan(userId: string, input: CreatePlanInput): Promise<Plan> {
    // 1. Gather context
    const weather = await WeatherService.getForecast(input.location);
    const nearbyPlaces = await PlacesService.getNearby(input.location, input.activityType);

    // 2. Generate itinerary via AI
    const itinerary = await AIService.generateItinerary({
      ...input,
      weather,
      nearbyPlaces,
    });

    // 3. Persist to database
    const plan = await PlanModel.create({ userId, ...itinerary });

    return plan;
  }

  static async getPlanById(planId: string, userId: string): Promise<Plan | null> {
    return PlanModel.findByIdAndUserId(planId, userId);
  }
}
```

```typescript
// ✅ models/plan.model.ts — database queries only
import { supabase } from '@/config/db';
import type { Plan } from '@/types/plan.types';

export class PlanModel {
  static async create(data: Omit<Plan, 'id' | 'createdAt'>): Promise<Plan> {
    const { data: plan, error } = await supabase
      .from('plans')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return plan;
  }

  static async findByIdAndUserId(id: string, userId: string): Promise<Plan | null> {
    const { data, error } = await supabase
      .from('plans')
      .select('*, activities(*)')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) return null;
    return data;
  }
}
```

### 9.2 Async / Await

```typescript
// ✅ Always use async/await — never raw .then() chains
const weather = await WeatherService.getForecast(location);
const places = await PlacesService.getNearby(location);

// ❌ Avoid
WeatherService.getForecast(location)
  .then((weather) => {
    PlacesService.getNearby(location)
      .then((places) => { /* callback hell */ });
  });
```

### 9.3 Parallel Calls

```typescript
// ✅ Run independent async calls in parallel with Promise.all
const [weather, nearbyPlaces, userHistory] = await Promise.all([
  WeatherService.getForecast(location),
  PlacesService.getNearby(location, activityType),
  UserService.getPastPlans(userId),
]);

// ❌ Awaiting them sequentially wastes time
const weather = await WeatherService.getForecast(location);
const nearbyPlaces = await PlacesService.getNearby(location, activityType);
const userHistory = await UserService.getPastPlans(userId);
```

---

## 10. Database — Supabase / PostgreSQL

### 10.1 Query Rules

```typescript
// ✅ Select only the columns you need
const { data } = await supabase
  .from('plans')
  .select('id, title, location, budget, created_at')
  .eq('user_id', userId);

// ❌ Never select * in production queries
const { data } = await supabase
  .from('plans')
  .select('*');
```

```typescript
// ✅ Always check for errors
const { data, error } = await supabase.from('plans').insert(payload).select().single();
if (error) throw new Error(`DB insert failed: ${error.message}`);
```

### 10.2 Migrations

```sql
-- migrations/001_create_users.sql
-- One file per migration, numbered sequentially
-- Never modify an existing migration — create a new one

CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255)  NOT NULL,
  email       VARCHAR(255)  NOT NULL UNIQUE,
  password_hash TEXT        NOT NULL,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Always add indexes for foreign keys and commonly filtered columns
CREATE INDEX idx_users_email ON users(email);
```

### 10.3 Row-Level Security (RLS)

```sql
-- Always enable RLS on every table
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

-- Users can only see their own plans
CREATE POLICY "Users can view own plans"
  ON plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plans"
  ON plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

## 11. API Design Standards

### 11.1 Response Format

All API responses follow this exact shape — no exceptions:

```typescript
// ✅ Success response
{
  "success": true,
  "data": { ... }
}

// ✅ Success with pagination
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10
  }
}

// ✅ Error response
{
  "success": false,
  "error": "Plan not found.",
  "statusCode": 404
}
```

### 11.2 HTTP Status Codes

| Situation | Code |
|-----------|------|
| Success (read) | `200 OK` |
| Success (created) | `201 Created` |
| Bad request / validation fail | `400 Bad Request` |
| Not authenticated | `401 Unauthorized` |
| No permission | `403 Forbidden` |
| Not found | `404 Not Found` |
| Server error | `500 Internal Server Error` |

### 11.3 Endpoint Naming

```
# ✅ Use nouns, not verbs. Use plural resource names.
POST   /plans              → create a plan
GET    /plans/:id          → get one plan
GET    /plans              → list all plans
PATCH  /plans/:id          → update a plan
DELETE /plans/:id          → delete a plan

POST   /invitations        → create invitation
POST   /invitations/send   → send it (action sub-resource)

# ❌ Do not use verbs in paths
POST /createPlan
GET  /getPlanById
POST /sendInvitation
```

---

## 12. Swagger / OpenAPI Documentation

> **Every route must have a Swagger doc block. No undocumented endpoints.**
> Swagger is the contract between the backend and frontend teams. If it isn't in Swagger, frontend devs don't know it exists.

### 12.1 Setup — `swagger.ts`

```typescript
// src/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Anong Ganap? API',
      version: '1.0.0',
      description: 'REST API for the Anong Ganap? activity planning platform.',
    },
    servers: [
      { url: 'http://localhost:3000/api', description: 'Development' },
      { url: 'https://api.ananggganap.app/api', description: 'Production' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // Reusable schemas — defined here, referenced in route docs
        Plan: {
          type: 'object',
          properties: {
            id:        { type: 'string', format: 'uuid' },
            userId:    { type: 'string', format: 'uuid' },
            title:     { type: 'string', example: 'Saturday Café Date' },
            location:  { type: 'string', example: 'BGC, Taguig' },
            budget:    { type: 'number', example: 1500 },
            theme:     { type: 'string', example: 'Romantic' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Activity: {
          type: 'object',
          properties: {
            id:            { type: 'string', format: 'uuid' },
            planId:        { type: 'string', format: 'uuid' },
            activityName:  { type: 'string', example: 'Coffee break' },
            placeName:     { type: 'string', example: 'Toby\'s Estate BGC' },
            startTime:     { type: 'string', example: '14:00' },
            estimatedCost: { type: 'number', example: 250 },
            isOutdoor:     { type: 'boolean', example: false },
          },
        },
        ApiError: {
          type: 'object',
          properties: {
            success:    { type: 'boolean', example: false },
            error:      { type: 'string', example: 'Plan not found.' },
            statusCode: { type: 'integer', example: 404 },
          },
        },
        ApiSuccess: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data:    { type: 'object' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  // Scan these files for JSDoc @swagger annotations
  apis: ['./src/routes/*.ts'],
};

export function setupSwagger(app: Express): void {
  const spec = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
  console.log('📖 Swagger docs: http://localhost:3000/api-docs');
}
```

```typescript
// src/app.ts
import { setupSwagger } from '@/config/swagger';
setupSwagger(app);
```

### 12.2 How to Document a Route

Every route file annotates each endpoint using JSDoc `@swagger` blocks directly above the route declaration.

```typescript
// src/routes/plan.routes.ts

/**
 * @swagger
 * /plans:
 *   post:
 *     summary: Create a new activity plan
 *     description: Generates a complete AI-powered itinerary based on user input, weather, and nearby places.
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [location, budget, activityType, startTime]
 *             properties:
 *               location:
 *                 type: string
 *                 example: "BGC, Taguig"
 *               budget:
 *                 type: number
 *                 example: 1500
 *               activityType:
 *                 type: string
 *                 enum: [date, hangout, family, solo]
 *                 example: "date"
 *               startTime:
 *                 type: string
 *                 example: "14:00"
 *               mood:
 *                 type: string
 *                 example: "Romantic"
 *               transportPreference:
 *                 type: string
 *                 enum: [commute, rideshare, own_vehicle]
 *                 example: "commute"
 *     responses:
 *       201:
 *         description: Plan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Plan'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/', authenticate, validatePlanInput, PlanController.create);

/**
 * @swagger
 * /plans/{id}:
 *   get:
 *     summary: Get a plan by ID
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The plan ID
 *     responses:
 *       200:
 *         description: Plan retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Plan'
 *       404:
 *         description: Plan not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/:id', authenticate, PlanController.getById);
```

### 12.3 Tags — Organize Endpoints by Resource

```typescript
// Every route file declares its own tag at the top

/**
 * @swagger
 * tags:
 *   - name: Plans
 *     description: Create and retrieve activity plans
 *   - name: Outfits
 *     description: Generate coordinated outfit suggestions
 *   - name: Weather
 *     description: Retrieve weather forecasts for a location
 *   - name: Invitations
 *     description: Generate and send activity invitations
 *   - name: Auth
 *     description: User registration and login
 */
```

### 12.4 Swagger Rules

| Rule | Detail |
|------|--------|
| Every route has a `@swagger` block | No undocumented endpoints |
| Use `$ref` for shared schemas | Never copy-paste schema definitions |
| Tag every endpoint | Keeps Swagger UI organized by resource |
| Document all response codes | At minimum: success, 400, 401, 404, 500 |
| Include request body examples | Use realistic Philippine context (`BGC`, `₱1500`) |
| Keep Swagger in the route file | Not in controllers or services |
| Run `swagger-jsdoc` in CI | Fail the build if Swagger generation errors |

---

## 13. Environment & Config

### 13.1 `.env.example` — always keep this updated

```bash
# App
NODE_ENV=development
PORT=3000

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# OpenAI
OPENAI_API_KEY=your_openai_key

# OpenWeatherMap
WEATHER_API_KEY=your_weather_key

# Foursquare
FOURSQUARE_API_KEY=your_foursquare_key

# OpenRouteService
OPENROUTE_API_KEY=your_openroute_key

# Email
MAILJET_API_KEY=your_mailjet_key
MAILJET_SECRET_KEY=your_mailjet_secret
```

### 13.2 Config Loader — `config/env.ts`

```typescript
// config/env.ts
// Validate all env vars at startup — fail loudly if anything is missing

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.string().default('3000'),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_KEY: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  WEATHER_API_KEY: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
```

### 13.3 Rules

- **Never commit `.env`** — it is in `.gitignore`
- **Always update `.env.example`** when adding a new env variable
- **Never hardcode API keys, URLs, or secrets** anywhere in the codebase
- Import from `config/env.ts` — never from `process.env` directly in service files

---

## 14. Error Handling

### 14.1 Custom ApiError Class

```typescript
// utils/apiError.ts
export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}
```

### 14.2 Global Error Middleware

```typescript
// middlewares/errorHandler.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/utils/apiError';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      statusCode: err.statusCode,
    });
  }

  // Unexpected errors — log and return generic message
  console.error('[UNHANDLED ERROR]', err);
  return res.status(500).json({
    success: false,
    error: 'Something went wrong. Please try again.',
    statusCode: 500,
  });
}
```

### 14.3 Frontend Error Handling

```typescript
// ✅ Always handle loading, error, and empty states in components
function ItineraryScreen() {
  const { plan, isLoading, error } = usePlan();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!plan) return <EmptyState message="No plan found." />;

  return <PlanDetails plan={plan} />;
}
```

---

## 15. Git Workflow

### 15.1 Branch Naming

```
main                          → production-ready code only
develop                       → integration branch

feature/plan-generation       → new features
fix/weather-api-timeout       → bug fixes
chore/update-dependencies     → maintenance
docs/update-readme            → documentation
```

### 15.2 Commit Messages — Conventional Commits

```
feat: add weather-aware outfit generation
fix: handle null response from OpenWeatherMap API
chore: upgrade axios to v1.7
docs: add API endpoint documentation
refactor: extract itinerary logic into PlanService
test: add unit tests for formatCurrency utility
style: apply consistent spacing in ActivityCard
```

**Format:** `type: short description` (max 72 characters)
**Types:** `feat` `fix` `chore` `docs` `refactor` `test` `style` `perf`

### 15.3 Rules

- Never push directly to `main` or `develop`
- Every feature needs a pull request with at least one reviewer
- Squash commits before merging
- Delete the branch after merging

---

## 16. Comments & Documentation

### 16.1 When to Comment

```typescript
// ✅ Comment WHY — not what (the code shows what)
// OpenWeatherMap returns temperature in Kelvin by default.
// We pass `units=metric` to get Celsius for Philippine users.
const weatherUrl = `...&units=metric`;

// ✅ Comment complex business logic
// Budget is distributed proportionally:
// 40% food, 30% activities, 20% transport, 10% buffer
function allocateBudget(totalBudget: number): BudgetBreakdown {}

// ❌ Do not comment the obvious
// Set isLoading to true
setIsLoading(true);
```

### 16.2 JSDoc for Exported Functions and Services

```typescript
/**
 * Generates a complete activity itinerary for a user.
 *
 * @param userId - The authenticated user's ID
 * @param input  - Plan creation parameters (location, budget, activity type, etc.)
 * @returns      - A fully structured Plan with activities, outfit, and invitation
 * @throws       - ApiError 400 if input is invalid
 * @throws       - ApiError 503 if AI or weather service is unavailable
 */
static async createPlan(userId: string, input: CreatePlanInput): Promise<Plan> {}
```

### 16.3 TODO Format

```typescript
// TODO(juan): Implement offline caching for maps — Phase 2
// FIXME(dev): OpenRoute sometimes returns null for jeepney routes — investigate
// NOTE: Foursquare free tier is limited to 100 calls/hour — monitor usage
```

---

## 17. Code Review Checklist

Before submitting a pull request, every developer runs through this list. If any item is unchecked, the PR is not ready.

### Code Quality
- [ ] No `any` types used anywhere
- [ ] No hardcoded hex values, magic numbers, or raw strings
- [ ] No unused variables, imports, or dead code
- [ ] Functions have a single clear responsibility
- [ ] Early returns used — no deeply nested if/else chains
- [ ] Max 3 levels of nesting in logic blocks
- [ ] Max 2 levels of JSX nesting per component (extract if deeper)

### Structure & Naming
- [ ] Files placed in the correct folder per the project structure
- [ ] Naming follows conventions (PascalCase components, camelCase hooks/services, SCREAMING_SNAKE_CASE constants)
- [ ] No business logic in controllers (belongs in services)
- [ ] No DB queries outside of model files
- [ ] No API calls directly inside components (belongs in services/hooks)

### Frontend — General
- [ ] Loading, error, and empty states all handled
- [ ] Lists use stable, unique keys (never array index)
- [ ] No logic inside JSX return — extracted to variables or sub-components

### Frontend — Styling (Web)
- [ ] All new styles written in `main.css` under `@layer components`
- [ ] No Tailwind utility classes written directly in JSX
- [ ] Components reference a single class name per element (`.activity-card`, `.btn-primary`)
- [ ] No inline `style={{}}` attributes
- [ ] All colors use CSS variables from `base.css` (no raw hex in CSS files)
- [ ] No `!important` used
- [ ] Max 2 levels of CSS selector nesting

### Frontend — Styling (React Native)
- [ ] All styles in `StyleSheet.create()` at the bottom of the file
- [ ] All colors from `constants/colors.ts`
- [ ] All spacing from `constants/spacing.ts`
- [ ] No inline style objects in JSX

### Backend
- [ ] All routes have authentication middleware (where applicable)
- [ ] All request bodies validated before reaching the controller
- [ ] Errors thrown as `ApiError` with correct HTTP status codes
- [ ] Independent async calls use `Promise.all` — not sequential await
- [ ] No `process.env` accessed directly — use `config/env.ts`

### Swagger / API Docs
- [ ] Every new or changed route has a complete `@swagger` JSDoc block
- [ ] Request body schema documented with required fields and examples
- [ ] All response codes documented (200/201, 400, 401, 404, 500 minimum)
- [ ] New schemas added to `swagger.ts` `components.schemas` and use `$ref`
- [ ] Swagger UI loads without errors after changes (`/api-docs`)

### Database
- [ ] No `SELECT *` queries — only columns needed
- [ ] All Supabase responses check for `error`
- [ ] New tables have RLS policies defined
- [ ] New migration file created — existing migrations not modified

### Security & Config
- [ ] No secrets, API keys, or credentials in source code
- [ ] `.env.example` updated for every new environment variable
- [ ] `.env` is in `.gitignore` and never committed

### Git
- [ ] Branch name follows convention (`feature/`, `fix/`, `chore/`, `docs/`)
- [ ] Commit messages follow Conventional Commits format
- [ ] No merge commits — rebased on `develop` before PR

### Documentation
- [ ] Complex business logic has explanatory comments (why, not what)
- [ ] All exported service functions have JSDoc blocks
- [ ] `README.md` updated if setup steps or env vars changed

---

*Anong Ganap? Coding Guidelines — v2.0*
*This document is owned by the whole team. If a rule needs changing, raise it in a PR — don't silently ignore it.*
