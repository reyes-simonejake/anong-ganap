# Future Improvements Roadmap

This roadmap lists high-value improvements after the MVP release. Each item is prioritized to help decide what to build next.

## Prioritization Model
- Impact: user value and business value
- Effort: implementation complexity
- Priority: recommended order after MVP

## Priority 1: High Impact, Low To Medium Effort

| Improvement | Why It Matters | Effort | Priority |
| --- | --- | --- | --- |
| Real-time data quality upgrades | Better place and route accuracy improves trust | Medium | P1 |
| Weather alert notifications | Prevents failed plans due to sudden weather changes | Medium | P1 |
| Manual itinerary editing | Gives users control without losing AI speed | Low-Medium | P1 |
| Stronger invitation security | Protects personal data and share links | Medium | P1 |

### Implementation Notes
- Real-time data quality:
  - Add periodic refresh jobs for place and route data.
  - Use provider fallback strategy for degraded APIs.
- Weather alerts:
  - Add push notifications for severe weather changes.
  - Trigger proactive alternatives (indoor replacement plan).
- Manual editing:
  - Allow drag-to-reorder timeline cards.
  - Recalculate budget and travel estimates after edits.
- Invitation security:
  - Use signed URLs with expiration.
  - Add access checks for private invitation pages.

## Priority 2: High Impact, Higher Effort

| Improvement | Why It Matters | Effort | Priority |
| --- | --- | --- | --- |
| Social planning (group voting) | Improves collaboration for friends and families | High | P2 |
| AI personalization over time | Increases relevance of suggestions | High | P2 |
| Local booking integrations | Converts suggestions into direct actions | High | P2 |
| Event planning toolkit (RSVP, reminders) | Expands use cases beyond dates/hangouts | High | P2 |

### Implementation Notes
- Social planning:
  - shared plan room
  - voting on activities
  - conflict resolution for schedules
- AI personalization:
  - preference profile from accepted/rejected suggestions
  - optional feedback loop after each completed plan
- Booking integrations:
  - restaurant reservations
  - ride booking deep links
  - optional calendar sync

## Priority 3: Strategic Expansion

| Improvement | Why It Matters | Effort | Priority |
| --- | --- | --- | --- |
| Gamification and rewards | Improves retention and repeat usage | Medium-High | P3 |
| Multilingual support | Expands market reach, especially tourists | Medium | P3 |
| Monetization features | Supports sustainability and premium tiers | Medium-High | P3 |
| Offline itinerary mode | Improves reliability during poor connectivity | High | P3 |

### Implementation Notes
- Gamification:
  - completion streaks
  - points for plan creation and completion
  - optional local partner rewards
- Multilingual:
  - start with interface localization
  - then localize AI prompts and invitation outputs
- Monetization:
  - premium templates
  - advanced recommendation packs
  - sponsor integrations for curated experiences

## Security And Compliance Improvements (Continuous)
- enforce least-privilege access for APIs and database
- add structured audit logs for sensitive actions
- implement data retention and deletion controls
- document user consent for memory/photo storage

## Suggested Rollout Sequence
1. Weather alerts + manual itinerary editing
2. Data quality hardening + invitation security improvements
3. Social planning features
4. AI personalization layer
5. Booking integrations
6. Strategic expansions (gamification, multilingual, premium)
