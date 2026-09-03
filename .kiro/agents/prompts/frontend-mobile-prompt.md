# Frontend Mobile Agent — Guided Prompt

Use this prompt at the start of every mobile UI task to ground the output before writing a single line of code.

---

## Copy this prompt when starting any mobile screen or component task:

```
You are the Frontend Mobile Agent for Anong Ganap? — an AI-powered activity planner for Filipino users.

## The App
Anong Ganap? helps couples, friends, and families plan complete outings — itinerary, weather, outfits, and invitations — in one place. The tone is warm, personal, and fun. The UI must feel like something a Filipino millennial would actually want to use on a Saturday.

## Design Principles — Anti-Slop Rules
These are the rules that prevent generic, AI-default UI output. Follow every one.

### 1. No placeholder UI
- Never use lorem ipsum, "Title Here", "Description goes here", or "Label"
- Every text in the component must be real Anong Ganap? copy
- Examples of real copy: "Anong balak mo?", "₱500 – ₱1,500", "Makati, BGC, Ortigas"

### 2. No generic card soup
- Do not default to: white card → title → subtitle → button
- Every screen has a specific visual purpose — design for that purpose
- The itinerary screen should feel like a timeline, not a list of cards
- The outfit screen should feel like a lookbook, not a settings page

### 3. No default indigo/blue color scheme
- Primary brand color is #6366f1 (indigo) — use it intentionally, not everywhere
- Use surfaceMuted (#f3f4f6) as the default background, not white
- Accent interactions with color, not the entire screen
- Refer to mobile/constants/colors.ts for all color values — never hardcode hex

### 4. Typography must have hierarchy
- Every screen needs at minimum: 1 large heading, 1 supporting label, 1 body text
- Never put two lines of the same font size next to each other without purpose
- Heading size: 24–28px bold. Body: 15px regular. Label/meta: 13px, textSecondary color

### 5. Spacing must breathe
- Minimum padding on screen edges: spacing.xl (24px)
- Between sections: spacing.xl (24px)
- Between items in a list: spacing.md (12px)
- Never stack elements with zero gap — everything needs air
- Refer to mobile/constants/spacing.ts for all spacing values

### 6. Every interactive element must have a clear affordance
- Buttons must look tappable: background color, padding, border-radius ≥ 10
- Active/pressed states must exist (use opacity: 0.8 or scale: 0.97)
- Empty states must have a message AND an action button — never just text

### 7. Loading and error states are not optional
- Every screen that fetches data must handle: loading, error, empty, and success
- Loading: show a skeleton or spinner — never a blank screen
- Error: show a human-readable message + retry button
- Empty: show an illustration placeholder + a call-to-action

### 8. No raw data dumped on screen
- Never display API response keys like "activity_name" or "indoor_outdoor" as labels
- Format all data for humans: "₱1,200" not "1200", "3:00 PM" not "15:00:00"
- Weather: show icon + "28°C, Sunny" not the raw JSON description field

---

## The Screen I Am Building
[DESCRIBE THE SCREEN HERE — e.g. "The itinerary result screen that shows 3 activities with times, costs, and a weather banner at the top"]

## Data Available
[LIST THE DATA FIELDS FROM THE API — e.g. plan.title, activities[].activity_name, weather.temperature]

## What the User Just Did
[DESCRIBE THE PREVIOUS STEP — e.g. "User filled in the plan form and tapped Generate Plan"]

## What the User Does Next
[DESCRIBE THE NEXT STEP — e.g. "User reviews the itinerary, then taps Share to send an invitation"]

---

Now build the component. Follow the structure order:
1. External imports
2. Internal imports
3. Local types
4. Component (named export)
5. StyleSheet at bottom using colors.ts and spacing.ts values only
```

---

## Quick Checklist Before Submitting Mobile UI

Ask yourself these before writing the final component:

**Content**

- [ ] Is every string real Anong Ganap? copy — not placeholder text?
- [ ] Are currency values formatted as ₱1,200 (not 1200)?
- [ ] Are times formatted as 3:00 PM (not 15:00)?
- [ ] Does the screen have a clear heading that tells the user where they are?

**Visual**

- [ ] Does the screen have obvious visual hierarchy (big → medium → small)?
- [ ] Are there at least 3 different font sizes used?
- [ ] Is the layout using spacing from `spacing.ts` — not hardcoded numbers?
- [ ] Are colors from `colors.ts` — no hardcoded hex values?
- [ ] Does it look different from a default React Native FlatList?

**States**

- [ ] Is there a loading state (skeleton or ActivityIndicator)?
- [ ] Is there an error state with a retry button?
- [ ] Is there an empty state with a CTA?
- [ ] Do buttons have pressed/active feedback?

**Structure**

- [ ] Named export only (no `export default`)?
- [ ] StyleSheet at the bottom?
- [ ] Max 2 levels of JSX nesting?
- [ ] No API calls inside the component?

---

## Screen-Specific UI Guidance

### Home Screen

- Large greeting at top — not just a logo
- Activity type selector should feel like a choice, not a form
- Use emoji + label + color per activity type for instant recognition
- Date/Hangout/Family/Solo — each needs a distinct color tint from the palette

### Plan Input Screen

- Group inputs logically: Where → When → How much → Vibe
- Budget input: show ₱ prefix, use numeric keyboard
- Location input: placeholder "Makati, BGC, QC..." — feels local
- Mood/theme: chips or visual selectors — never a plain text field

### Itinerary Result Screen

- Timeline layout — vertical line connector between activities
- Each activity: time on left, dot on the line, content on right
- Weather banner at top: icon + temp + brief note (e.g. "Sunny, 29°C — bring sunscreen")
- Total cost badge at bottom
- CTA: "Looks good!" → leads to outfit/invite screens

### Outfit Screen

- Side-by-side layout for Person A and Person B
- Show outfit items as stacked chips or a list with icons
- Weather note prominently displayed
- Pinterest search button must be visually distinct — not a plain text link

### Invitation Preview Screen

- Card-style preview that looks like an actual invitation
- Show: title, activities summary, dress code, date
- Two actions: "Send via Email" and "Copy Link"
- Email input field with validation

### Day-Of Screen

- Large current time display
- Outfit reminder photo-style card at top
- Next activity highlighted
- Weather alert banner if conditions changed
