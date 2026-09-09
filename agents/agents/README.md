# Anong Ganap? — Agent Directory

Each file in this folder defines a specialized agent with its own scope, stack, rules, and quality checklist.

## Agents

| Agent               | File                 | Scope                                             |
| ------------------- | -------------------- | ------------------------------------------------- |
| **Frontend Mobile** | `frontend-mobile.md` | `mobile/` — React Native, Expo, NativeWind        |
| **Frontend Web**    | `frontend-web.md`    | `web/` — React, Vite, CSS architecture            |
| **Backend**         | `backend.md`         | `backend/` — Express, services, error handling    |
| **Database**        | `database.md`        | Supabase schema, RLS, query patterns              |
| **QA**              | `qa.md`              | Testing, contract validation, workflow compliance |

## How to Use

When asking Kiro to do work, tell it which agent context to use:

- "Using the **Backend Agent**, add a proposals route"
- "Using the **Frontend Mobile Agent**, build the ActivityCard component"
- "Using the **QA Agent**, check the plan creation flow end to end"
- "Using the **Database Agent**, add an index for invitations"

Each agent will only touch its own scope and follow the rules in its file.

## Source of Truth

All rules are derived from:

- `anong_ganap_coding_guidelines.md` — master coding standards
- `backend/anong-ganap-workflow.md` — feature workflow and data flow
- `backend/supabase-schema.sql` — database schema
