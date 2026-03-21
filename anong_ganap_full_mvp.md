# Anong Ganap? — AI-Powered Activity and Experience Planner

> A centralized AI-powered platform for generating complete, weather-aware activity itineraries for dates, hangouts, family outings, and solo adventures.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Objectives](#2-objectives)
3. [Target Users](#3-target-users)
4. [System Features](#4-system-features)
5. [System Architecture](#5-system-architecture)
6. [Database Design](#6-database-design)
7. [AI Workflow](#7-ai-workflow)
8. [Weather Integration](#8-weather-integration)
9. [Backend API Structure](#9-backend-api-structure)
10. [User Interface Design](#10-user-interface-design)
11. [Tech Stack](#11-tech-stack)
12. [MVP Development Plan](#12-mvp-development-plan)
13. [Testing and Quality Assurance](#13-testing-and-quality-assurance)
14. [Deployment and Hosting](#14-deployment-and-hosting)
15. [Future Enhancements](#15-future-enhancements)

---

## 1. Project Overview

### 1.1 Introduction

**Anong Ganap?** is an AI-powered planning platform that helps users create a complete itinerary for activities such as dates, hangouts, or personal adventures. Instead of switching between multiple apps for places, routes, and ideas, the system provides a complete experience plan in a single platform — including:

- Suggested locations
- Recommended activities
- Transportation routes
- Estimated costs
- Outfit themes
- Personalized invitations

### 1.2 Problem Statement

Many individuals struggle when planning activities because the process requires multiple steps:

- Finding a place to go
- Deciding what activities to do
- Searching for restaurants
- Planning transportation routes
- Budgeting expenses
- Choosing appropriate outfits
- Creating invitations

This fragmented process causes decision fatigue and time-consuming planning across multiple applications such as navigation apps, restaurant directories, and messaging platforms.

### 1.3 Proposed Solution

Anong Ganap? provides a centralized AI-powered platform where users input:

- Budget
- Location
- Activity type
- Time availability
- Transportation preference

The system automatically produces:

- A structured timeline of activities
- Location recommendations
- Transportation routes
- Estimated expenses
- Themed outfit suggestions
- Invitation messages

---

## 2. Objectives

### 2.1 General Objective

To develop an AI-assisted activity planning system that generates a complete itinerary for users based on their preferences and constraints.

### 2.2 Specific Objectives

- Simplify activity planning through automated itinerary generation
- Recommend nearby attractions, restaurants, and photo spots
- Provide step-by-step transportation guidance
- Suggest themed matching outfits for couples
- Generate personalized invitation messages
- Store activity memories for future reference

---

## 3. Target Users

| User Type | Purpose |
|-----------|---------|
| **Couples** | Plan romantic and memorable dates |
| **Friends** | Organize hangouts and social activities |
| **Families** | Plan family outings |
| **Tourists** | Generate travel itineraries when visiting new locations |
| **Solo Users** | Discover activities for personal leisure |

---

## 4. System Features

### 4.1 AI Itinerary Generator

The core feature of the system. Creates a detailed activity plan based on user inputs.

**Example output:**

```
3:00 PM – Travel to café
4:00 PM – Coffee break
5:30 PM – Park walk and photo session
6:30 PM – Sunset viewing
7:30 PM – Dinner at nearby restaurant
```

Each activity includes:
- Estimated cost
- Travel time
- Recommended locations
- Photo spots

### 4.2 Location Recommendation System

Analyzes nearby places and suggests locations such as:
- Cafes and restaurants
- Parks and tourist attractions
- Photo spots

Recommendations are based on user location, ratings, activity type, and budget compatibility.

### 4.3 Transportation Guidance

Provides detailed navigation instructions including:
- Train routes
- Jeepney routes
- Buses
- Ride-hailing services

Each route includes estimated travel time, cost estimate, and step-by-step commute instructions.

### 4.4 Matchy Outfit Recommendation System

Suggests coordinated outfits for couples based on activity type, weather conditions, location atmosphere, and time of day.

**Example suggestion:**

```
Theme: Casual Café Date

Person A:
  - White polo shirt
  - Denim jeans
  - White sneakers

Person B:
  - Beige dress
  - White cardigan
  - White sneakers
```

### 4.5 Invitation Generator

Once the itinerary is finalized, generates a personalized invitation including:
- Activity summary
- Event schedule
- Dress theme
- Location details

**Delivery options:**
- Email
- Shareable links
- Downloadable invitation cards

**Example invitation:**

```
I planned something special for us this Saturday.

3:00 PM – Coffee together
5:30 PM – Sunset walk
7:30 PM – Dinner

Dress Code: Café Minimalist
```

### 4.6 Memory Archive

After completing the activity, users may store:
- Photos
- Notes
- Visited locations

This feature helps couples and friends track their experiences over time.

---

## 5. System Architecture

### 5.1 Architecture Diagram

```
[React Native Mobile App]       [React Web Admin/Demo]
           │                            │
           └───────── REST API ─────────┘
                      │
              [Node.js + Express Backend]
                      │
┌─────────────┬───────────────┬───────────────┐
│ AI Service  │ Location/Map  │ Weather/Outfit│
│ (Itinerary,│  Service      │ Service       │
│ Invitation)│ (Foursquare,  │ (OpenWeather, │
│            │ OSM, OpenRoute)│ Outfit rules) │
└─────────────┴───────────────┴───────────────┘
                      │
                 [Database]
            (Supabase/Postgres)
```

### 5.2 Layer Descriptions

**Presentation Layer (Mobile + Web)**
- Collects user inputs
- Displays itineraries, maps, and outfit suggestions
- Manages invitations

**Application Layer (Node.js Backend)**
- Itinerary generation
- Activity recommendation
- Outfit generation
- Invitation creation
- Data processing
- Communication with external APIs

**Data Layer (Supabase/Postgres)**
- User accounts
- Activity plans
- Itinerary details
- Outfit themes
- Invitation records
- Memory archives

---

## 6. Database Design

### Schema

```sql
-- Users
CREATE TABLE users (
  user_id    SERIAL PRIMARY KEY,
  name       VARCHAR(255),
  email      VARCHAR(255),
  password_hash TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Plans
CREATE TABLE plans (
  plan_id        SERIAL PRIMARY KEY,
  user_id        INT REFERENCES users(user_id),
  title          VARCHAR(255),
  location       VARCHAR(255),
  budget         FLOAT,
  theme          VARCHAR(100),
  date_created   DATE,
  weather_summary TEXT
);

-- Activities
CREATE TABLE activities (
  activity_id    SERIAL PRIMARY KEY,
  plan_id        INT REFERENCES plans(plan_id),
  activity_name  VARCHAR(255),
  place_name     VARCHAR(255),
  latitude       FLOAT,
  longitude      FLOAT,
  start_time     TIME,
  estimated_cost FLOAT,
  indoor_outdoor VARCHAR(10)
);

-- Outfits
CREATE TABLE outfits (
  outfit_id        SERIAL PRIMARY KEY,
  plan_id          INT REFERENCES plans(plan_id),
  theme            VARCHAR(100),
  person_a_outfit  TEXT,
  person_b_outfit  TEXT,
  weather_adjusted BOOLEAN
);

-- Invitations
CREATE TABLE invitations (
  invitation_id      SERIAL PRIMARY KEY,
  plan_id            INT REFERENCES plans(plan_id),
  receiver_email     VARCHAR(255),
  invitation_message TEXT,
  sent_status        VARCHAR(20)
);

-- Memories (optional)
CREATE TABLE memories (
  memory_id   SERIAL PRIMARY KEY,
  plan_id     INT REFERENCES plans(plan_id),
  photo_url   TEXT,
  note        TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);
```

---

## 7. AI Workflow

### Step-by-Step Process

```
Step 1 – Input Collection
  └─ Location, budget, activity type, preferred time

Step 2 – Context Gathering
  ├─ Nearby attractions (Foursquare / OSM)
  ├─ Transportation routes (OpenRouteService)
  ├─ Weather forecast (OpenWeatherMap)
  └─ Past user plans (Supabase)

Step 3 – Activity Selection
  └─ AI filters and selects activities matching preferences
     ├─ Sunny → outdoor suggestions
     └─ Rainy → indoor alternatives

Step 4 – Budget Allocation
  └─ Total budget distributed across activities

Step 5 – Timeline Generation
  └─ Activities organized into a structured schedule

Step 6 – Outfit Generation
  └─ Coordinated outfits generated based on activity + weather

Step 7 – Invitation Creation
  └─ Personalized invitation message generated
```

---

## 8. Weather Integration

### 8.1 How It Works

The system integrates with **OpenWeatherMap** to retrieve:
- Temperature
- Rain probability
- Wind speed
- UV index

### 8.2 Dynamic Adjustments

| Weather Condition | Activity Response | Outfit Response |
|---|---|---|
| Sunny | Outdoor: parks, beaches, scenic spots | Light clothing, sunglasses, hat |
| Rainy | Indoor: cafes, museums, malls | Raincoat, umbrella, waterproof shoes |
| Cold | Cozy indoor or outdoor winter activities | Jacket, scarf, boots |
| Hot | Swimming, beaches, shaded parks | Light fabric, hat, sunscreen |

### 8.3 API Integration Example

```javascript
// Node.js Backend — OpenWeatherMap fetch
const axios = require('axios');
const weatherApiKey = process.env.WEATHER_API_KEY;

const getWeather = async (location) => {
  try {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherApiKey}&units=metric`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Weather API error:', error);
    return null;
  }
};
```

### 8.4 Outfit Rules Logic

```javascript
const weather = weatherData.weather[0].main; // e.g. "Clear", "Rain"

let outfitNote = '';
if (weather === 'Clear')  outfitNote = 'Light clothes, sunglasses';
if (weather === 'Rain')   outfitNote = 'Rain jacket, umbrella, waterproof shoes';
if (weather === 'Clouds') outfitNote = 'Light jacket, comfortable shoes';
```

### 8.5 User Journey Examples

**Scenario 1 — Sunny Day**
- Input: Saturday, ₱1,000, Date
- Weather: Sunny, 0% rain
- Output: Park → Photo spot → Outdoor restaurant
- Outfit: Casual attire, sunglasses, light jacket

**Scenario 2 — Rainy Day**
- Input: Saturday, ₱1,000, Date
- Weather: 90% chance of rain
- Output: Café → Museum → Indoor restaurant
- Outfit: Rain jacket, umbrella, waterproof shoes

---

## 9. Backend API Structure

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/plan/create` | Receive user input → generate AI itinerary → return plan |
| `GET` | `/plan/:id` | Retrieve stored plan for user |
| `POST` | `/outfit/generate` | Generate weather-aware matchy outfit |
| `GET` | `/weather/:lat/:lon` | Retrieve weather forecast (OpenWeatherMap) |
| `GET` | `/places/nearby` | Get nearby attractions and restaurants |
| `GET` | `/routes` | Get travel routes and directions |
| `POST` | `/invitation/create` | Generate HTML invitation |
| `POST` | `/send-invitation` | Send invitation via email API |

---

## 10. User Interface Design

### Mobile App Screens

| Screen | Description |
|--------|-------------|
| **Home** | Choose activity type: Date / Hangout / Family / Solo |
| **Input Screen** | Budget, location, mood, time, transport preference |
| **Itinerary Screen** | Timeline + map view + weather icons |
| **Outfit Screen** | Matchy outfit suggestions (weather-aware) |
| **Invitation Screen** | Preview and send invitation |
| **Plan Summary Screen** | Full itinerary, total cost, route map, outfit, invitation status |

### Web Admin / Demo (React)

- Dashboard to test AI outputs
- Review stored plans and itineraries
- Optional metrics display

---

## 11. Tech Stack

| Component | Technology | Notes |
|-----------|------------|-------|
| Mobile App | React Native / Expo | Free, cross-platform (iOS + Android) |
| Web Admin | React + TailwindCSS | Free, interactive demo portal |
| Backend | Node.js + Express | Free, REST APIs |
| Database | Supabase Free Tier | 500 MB storage, built-in auth |
| Maps | Leaflet + OpenStreetMap | Free tiles, offline possible |
| Routing | OpenRouteService Free Tier | Step-by-step directions |
| Places | Foursquare Dev Free | Nearby attractions and restaurants |
| AI | OpenAI API / Hugging Face | Itinerary, invitation, outfit suggestions |
| Weather | OpenWeatherMap Free Tier | Current + forecast, hourly |
| Email | Mailjet / Sendinblue Free Tier | Send invitations for free |
| Hosting | Render Free / Railway Free | 750–1,000 hrs/month free |

---

## 12. MVP Development Plan

### Phase 1 — Core MVP (4–6 weeks)

- [ ] React Native input and itinerary screen
- [ ] AI itinerary generation (weather-aware)
- [ ] Map integration and routes
- [ ] Matchy outfit generator (weather-adjusted)
- [ ] Invitation generation and free email send
- [ ] Supabase database storage for plans

### Phase 2 — Future Enhancements

- [ ] Offline maps and cached routes
- [ ] Surprise mode for hidden plans
- [ ] Memory archive with photo uploads
- [ ] Weather-adjusted dynamic notifications
- [ ] Social sharing and multiple invitation recipients

---

## 13. Testing and Quality Assurance

### Testing Strategy

| Type | Description | Tool |
|------|-------------|------|
| Unit Testing | Test individual functions (AI generation, data processing) | Jest |
| Integration Testing | Test frontend ↔ backend ↔ external API interactions | Jest + Supertest |
| End-to-End Testing | Simulate full user flows | Cypress |

### User Feedback

- Beta testing group for early feature validation
- In-app feedback surveys after plan completion

---

## 14. Deployment and Hosting

### Setup

| Layer | Service |
|-------|---------|
| Mobile App | Expo EAS Build → App Store / Play Store |
| Frontend Web | Vercel or Netlify |
| Backend | Render Free or Railway Free (Node.js) |
| Database | Supabase Free Tier (PostgreSQL) |

### CI/CD Pipeline

Use **GitHub Actions** for:
- Automatic test runs on every push
- Auto-deploy to Render / Vercel on merge to `main`

---

## 15. Future Enhancements

- **Weather-aware smart alerts** — notify users of changes to planned outdoor activities
- **Surprise mode** — hide plan details from the invitee until the day of
- **Offline mode** — cached maps and itineraries for tourists without data
- **Social sharing** — share plans and memories to social platforms
- **Couple compatibility recommendations** — AI suggestions based on mutual preferences
- **Event discovery integration** — pull in local events (concerts, festivals) as plan options
- **Learning model** — improve suggestions based on past activities and ratings
- **Premium features** — custom invitation templates, exclusive location data, unlimited plans

---

## Conclusion

**Anong Ganap?** provides a comprehensive solution to activity planning by combining artificial intelligence, location services, weather awareness, and experience design.

By automating itinerary creation and providing additional features such as weather-adjusted outfit recommendations and invitation generation, the platform simplifies the planning process and helps users create memorable experiences.

The system demonstrates how technology can enhance everyday social interactions by transforming complex, multi-step planning tasks into a simple and enjoyable process — all in one place.

---

*Documentation version: MVP 1.0 — Anong Ganap? Project*
