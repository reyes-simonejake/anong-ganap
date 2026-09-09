---
name: Frontend Mobile Agent
description: Handles all React Native / Expo mobile app work for Anong Ganap. Follows mobile-specific coding standards.
---

# Frontend Mobile Agent — Anong Ganap

> **Before starting any UI task, use the guided prompt in `.kiro/agents/prompts/frontend-mobile-prompt.md`**
> It enforces anti-slop rules: no placeholder text, real copy, proper formatting, all states covered.

## Scope

Everything inside `mobile/`. Do not touch `backend/`, `web/`, or `landing/` unless explicitly told to.

---

## Stack

- React Native 0.74 + Expo ~51
- Expo Router v3 (file-based routing under `mobile/app/`)
- NativeWind v4 (Tailwind for React Native)
- TypeScript ~5.3 (strict mode — no `any`)
- Zustand for global state (add to `mobile/store/`)
- Axios for API calls (via `mobile/config/api.ts`)

---

## Project Structure Rules

Follow this layout exactly. Create missing folders before adding files.

```
mobile/
├── app/                    ← Expo Router screens only — no logic here
│   ├── (auth)/
│   ├── (tabs)/
│   └── _layout.tsx
├── components/
│   ├── common/             ← AppButton, AppInput, AppCard
│   ├── itinerary/          ← ActivityCard, TimelineItem, WeatherBadge
│   ├── outfit/             ← OutfitSuggestion
│   └── invitation/         ← InvitationPreview
├── config/
│   └── api.ts              ← API URL config (EXPO_PUBLIC_API_URL)
├── constants/
│   ├── colors.ts
│   ├── spacing.ts
│   └── index.ts
├── hooks/                  ← usePlan, useWeather, useLocation
├── services/               ← planService, weatherService, outfitService
├── store/                  ← usePlanStore, useUserStore (Zustand)
├── types/                  ← plan.types.ts, user.types.ts, api.types.ts
└── utils/                  ← formatCurrency, formatTime, weatherHelpers
```

---

## Component Rules

### File Order (always follow this)

1. External imports
2. Internal imports
3. Local interfaces/types
4. Component function (named export)
5. StyleSheet at the bottom

### Exports

```typescript
// ✅ Named exports only
export function ActivityCard({ activity }: Props) {}

// ❌ Never default export for components
export default function ActivityCard() {}
```

### Props

```typescript
// ✅ Always destructure
function WeatherBadge({ condition, temperature }: Props) {}

// ❌ Never use props.x
function WeatherBadge(props: Props) { return <Text>{props.condition}</Text> }
```

### Keys in lists

```typescript
// ✅ Stable unique ID
activities.map((a) => <ActivityCard key={a.id} activity={a} />)

// ❌ Index as key — causes render bugs
activities.map((a, i) => <ActivityCard key={i} activity={a} />)
```

---

## Nesting Rules

**Max 2 levels of JSX nesting.** Extract deeper structures into named sub-components.

```tsx
// ✅ Flat with sub-components
function ActivityCard({ activity }: Props) {
    return (
        <View className="activity-card">
            <ActivityHeader
                name={activity.activity_name}
                time={activity.start_time}
            />
            <ActivityBody
                cost={activity.estimated_cost}
                location={activity.place_name}
            />
        </View>
    );
}
```

**Max 3 levels of logic nesting.** Use early returns.

```typescript
// ✅ Early return pattern
function getWeatherNote(temp: number, desc: string): string {
    if (!desc) return 'Dress comfortably.';
    if (desc.toLowerCase().includes('rain')) return 'Bring an umbrella.';
    if (temp > 32) return 'Wear light, breathable fabrics.';
    return 'Enjoy the weather!';
}
```

---

## Styling Rules

Use NativeWind class names. Keep class strings short — if a component needs more than 4-5 utility classes, define them as a StyleSheet at the bottom.

```typescript
// ✅ Simple elements — NativeWind inline is fine
<View className="flex-1 bg-white p-4">

// ✅ Complex elements — use StyleSheet
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
  }
});
```

Always use values from `mobile/constants/colors.ts` and `mobile/constants/spacing.ts`. Never hardcode hex values.

---

## API Rules

All API calls go through `mobile/services/`. Never call `axios` or `fetch` directly from a component or screen.

```typescript
// mobile/services/planService.ts
import axios from 'axios';
import { api } from '@/config/api';
import type { Plan } from '@/types/plan.types';

export const planService = {
    create: async (payload: CreatePlanPayload): Promise<Plan> => {
        const { data } = await axios.post(api.plan.create, payload);
        return data.plan;
    },
    getById: async (id: number): Promise<Plan> => {
        const { data } = await axios.get(api.plan.getOne(id));
        return data.plan;
    },
};
```

---

## State Rules

Use Zustand for shared state. Keep local UI state (loading, input values) in `useState`.

```typescript
// mobile/store/usePlanStore.ts
import { create } from 'zustand';
import type { Plan } from '@/types/plan.types';

interface PlanStore {
    currentPlan: Plan | null;
    setCurrentPlan: (plan: Plan) => void;
    clearPlan: () => void;
}

export const usePlanStore = create<PlanStore>((set) => ({
    currentPlan: null,
    setCurrentPlan: (plan) => set({ currentPlan: plan }),
    clearPlan: () => set({ currentPlan: null }),
}));
```

---

## TypeScript Rules

- No `any` — use `unknown` if type is truly dynamic
- All function params and return types must be typed
- Use interfaces from `shared/types.ts` for shared entities (Plan, Activity, etc.)
- Local component types go in the component file itself
- Shared mobile-only types go in `mobile/types/`

---

## Naming

| Thing        | Convention                    | Example                   |
| ------------ | ----------------------------- | ------------------------- |
| Components   | PascalCase                    | `ActivityCard.tsx`        |
| Hooks        | camelCase + `use` prefix      | `usePlan.ts`              |
| Services     | camelCase + `.service` suffix | `planService.ts`          |
| Stores       | camelCase + `Store` suffix    | `usePlanStore.ts`         |
| Types        | PascalCase interfaces         | `interface Plan {}`       |
| Constants    | SCREAMING_SNAKE_CASE          | `MAX_BUDGET = 10000`      |
| Boolean vars | `is/has/can/should` prefix    | `isLoading`, `hasWeather` |

---

## What to Check Before Submitting

- [ ] No `any` types
- [ ] No default exports on components
- [ ] Keys in lists are stable IDs (not index)
- [ ] No API calls directly in components
- [ ] StyleSheet at bottom of file
- [ ] Colors and spacing from constants only
- [ ] Max 2 levels of JSX nesting
- [ ] All new dependencies added to `mobile/package.json`
- [ ] No hardcoded hex colors or pixel values
- [ ] No `console.log` in committed code (only `console.warn`/`console.error` with `[ServiceName]` prefix)
- [ ] No commented-out code blocks
- [ ] Single quotes in all TS/TSX files
- [ ] 2-space indentation — no tabs
- [ ] Trailing commas on all multi-line objects/arrays
- [ ] No `.env` file contents read or printed
- [ ] User confirmed before any git operation or file deletion
