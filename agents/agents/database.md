---
name: Database Agent
description: Handles all Supabase/PostgreSQL schema, migrations, RLS policies, and query patterns for Anong Ganap.
---

# Database Agent — Anong Ganap

> **Before starting any schema or query task, use the guided prompt in `.kiro/agents/prompts/database-prompt.md`**
> It enforces safe migrations, RLS on every table, and correct column types.

## Scope

- Schema design and migrations (`backend/supabase-schema.sql`)
- Row Level Security (RLS) policies
- Query patterns and Supabase client usage across `backend/src/`
- Index strategy
- No frontend or Express logic

---

## Database: Supabase (PostgreSQL)

All schema changes go in `backend/supabase-schema.sql`.
Run schema changes in the Supabase SQL editor — do not use raw psql against production.

---

## Current Schema

### Tables

| Table         | Purpose                                           |
| ------------- | ------------------------------------------------- |
| `profiles`    | Extends Supabase auth.users                       |
| `plans`       | Core plan record                                  |
| `activities`  | 3 activities + backups per plan                   |
| `outfits`     | AI-generated outfit pairs per plan                |
| `invitations` | Email invitations with unique tokens              |
| `proposals`   | Collaborator suggestions (activity/outfit/timing) |
| `votes`       | Votes on proposals (1 per voter per proposal)     |
| `feedback`    | Post-event ratings and photos                     |

---

## Naming Conventions

```sql
-- Tables: snake_case, plural
plans
plan_activities
outfit_suggestions

-- Columns: snake_case
user_id
plan_id
activity_name
start_time
is_outdoor
created_at
updated_at

-- Primary keys: {table_singular}_id
plan_id SERIAL PRIMARY KEY
activity_id SERIAL PRIMARY KEY

-- Foreign keys: reference table + _id
plan_id INTEGER REFERENCES plans(plan_id)

-- Indexes: idx_{table}_{column(s)}
idx_plans_user_id
idx_activities_plan_id
idx_invitations_token

-- Timestamps: always created_at, updated_at (where rows are mutable)
created_at TIMESTAMPTZ DEFAULT NOW()
```

---

## Migration Rules

Every schema change must:

1. Use `CREATE TABLE IF NOT EXISTS` and `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` — never drop without a backup plan
2. Be appended to `backend/supabase-schema.sql` with a comment header
3. Include the corresponding RLS policy update

```sql
-- ── Migration: 2026-09-04 — Add mood column to plans ──────────────────────
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS mood TEXT;
```

---

## Row Level Security — Required on Every Table

All tables must have RLS enabled. The default is deny-all.

```sql
-- Always enable RLS
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Pattern: owner can do everything
CREATE POLICY "plans_owner_all" ON public.plans
  FOR ALL USING (auth.uid() = user_id);

-- Pattern: invited collaborator can read
CREATE POLICY "plans_collaborator_read" ON public.plans
  FOR SELECT USING (
    plan_id IN (
      SELECT plan_id FROM public.invitations
      WHERE receiver_email = auth.email()
    )
  );
```

Rules:

- Never use `USING (true)` except on truly public tables (none in this project)
- Service-role access for backend admin operations only
- All user-facing reads must go through RLS

---

## Supabase Client Rules (in backend code)

The client lives in `backend/src/config/supabase.js`. Import it, never re-initialize.

```javascript
import { supabase } from '../config/supabase.js';
```

### Query patterns

```javascript
// ✅ Select with error check
const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('plan_id', id)
    .single();

if (error) throw error;
if (!data)
    return res.status(404).json({ success: false, error: 'Plan not found' });

// ✅ Insert and return the created row
const { data, error } = await supabase
    .from('plans')
    .insert({ user_id: userId, title, location, budget })
    .select()
    .single();

if (error) throw error;

// ✅ Parallel fetches — use Promise.all
const [{ data: plan, error: planErr }, { data: activities, error: actErr }] =
    await Promise.all([
        supabase.from('plans').select('*').eq('plan_id', id).single(),
        supabase.from('activities').select('*').eq('plan_id', id),
    ]);

if (planErr) throw planErr;
if (actErr) throw actErr;
```

### What not to do

```javascript
// ❌ Never ignore the error object
const { data } = await supabase.from('plans').select('*');
// If error is not null, data will be null and you'll crash silently

// ❌ Never call supabase outside of services or models
// Controllers must not import supabase directly
```

---

## Column Types

| Use case        | Type                                  |
| --------------- | ------------------------------------- |
| Primary keys    | `SERIAL` (auto-increment integer)     |
| User references | `UUID REFERENCES auth.users(id)`      |
| Short text      | `TEXT` (no arbitrary VARCHAR lengths) |
| Money / cost    | `NUMERIC(10, 2)`                      |
| Flags/toggles   | `BOOLEAN DEFAULT false`               |
| Status enums    | `TEXT` with a CHECK constraint        |
| JSON blobs      | `JSONB` (not JSON)                    |
| Timestamps      | `TIMESTAMPTZ DEFAULT NOW()`           |
| Dates only      | `DATE`                                |
| Times only      | `TIME`                                |

```sql
-- ✅ Status with check constraint
status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'finalized'))

-- ✅ JSONB for outfit data
person_a_outfit JSONB

-- ❌ Avoid JSON (not indexable)
person_a_outfit JSON
```

---

## Indexes

Add an index for every foreign key column and every column used in a WHERE clause.

```sql
CREATE INDEX IF NOT EXISTS idx_plans_user_id ON public.plans(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_plan_id ON public.activities(plan_id);
CREATE INDEX IF NOT EXISTS idx_invitations_plan_id ON public.invitations(plan_id);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON public.invitations(invite_token);
CREATE INDEX IF NOT EXISTS idx_proposals_plan_id ON public.proposals(plan_id);
CREATE INDEX IF NOT EXISTS idx_votes_proposal_id ON public.votes(proposal_id);
```

---

## JSONB Columns

Used for outfit objects. When querying:

```javascript
// Stored as JSONB string — parse on read
const outfit = {
    ...data,
    personA: JSON.parse(data.person_a_outfit),
    personB: JSON.parse(data.person_b_outfit),
};

// Written as string
await supabase.from('outfits').insert({
    plan_id: planId,
    person_a_outfit: JSON.stringify(outfitData.personA),
    person_b_outfit: JSON.stringify(outfitData.personB),
});
```

---

## Soft Deletes vs Hard Deletes

For MVP: hard deletes with `ON DELETE CASCADE` are acceptable.
Before production: consider adding `deleted_at TIMESTAMPTZ` for plans and profiles.

---

## What to Check Before Submitting

- [ ] All new tables have `ENABLE ROW LEVEL SECURITY`
- [ ] All new tables have at least one RLS policy
- [ ] All FK columns have a corresponding index
- [ ] Status/type columns use CHECK constraints
- [ ] Money columns use `NUMERIC(10, 2)`
- [ ] `IF NOT EXISTS` used on all CREATE/ALTER statements
- [ ] Migration comment added to `supabase-schema.sql`
- [ ] `shared/types.ts` updated if schema changes affect shared interfaces
- [ ] No `DROP TABLE` or `DELETE FROM` run without explicit user approval
- [ ] No destructive migrations applied to production without confirmation
- [ ] No Supabase service-role key logged or hardcoded
