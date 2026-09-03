# Agent Guided Prompts

Each file here is a pre-filled prompt to copy-paste when starting a task with a specific agent. They prevent generic, low-quality output — especially in UI work.

## How to Use

1. Open the prompt file for the agent you need
2. Copy the prompt block
3. Fill in the bracketed sections (`[DESCRIBE THE SCREEN]`, `[LIST THE FIELDS]`, etc.)
4. Paste it as your message to Kiro
5. Kiro will follow the anti-slop rules and produce grounded, project-specific output

## Files

| Prompt                      | Use When                                                |
| --------------------------- | ------------------------------------------------------- |
| `frontend-mobile-prompt.md` | Building any React Native screen or component           |
| `frontend-web-prompt.md`    | Building any web dashboard page or component            |
| `backend-prompt.md`         | Adding routes, controllers, or services                 |
| `database-prompt.md`        | Writing schema migrations, queries, or RLS policies     |
| `qa-prompt.md`              | Reviewing a feature, writing tests, or doing a QA audit |

## What "AI Slop" Looks Like — and What We're Avoiding

| Slop                                | What We Do Instead                       |
| ----------------------------------- | ---------------------------------------- |
| Generic white card + title + button | Design for the screen's specific purpose |
| "Lorem ipsum" or "Title here"       | Real Anong Ganap? copy everywhere        |
| Hardcoded `#6366f1` in StyleSheet   | `colors.primary` from constants          |
| `padding: 16`                       | `spacing.lg` from constants              |
| No loading/error/empty state        | All three states required                |
| Raw "1200" displayed as budget      | "₱1,200" formatted for humans            |
| Raw ISO timestamp                   | "Sep 4, 2026 · 3:00 PM"                  |
| Same font size for everything       | Clear 3-level hierarchy per screen       |
| Tailwind soup in JSX                | One semantic class name per element      |
| `// TODO: implement` stub committed | Real implementation or flagged stub      |
