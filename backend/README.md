# Anong Ganap? Backend API

Node.js + Express backend for the AI-powered activity planner.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`

4. Run development server:
```bash
npm run dev
```

## API Endpoints

### Plans
- `POST /api/plan/create` - Create new activity plan
- `GET /api/plan/:id` - Get plan by ID
- `GET /api/plan` - Get all plans

### Outfits
- `POST /api/outfit/generate` - Generate outfit suggestions

### Weather
- `GET /api/weather/:location` - Get weather data

### Places
- `GET /api/places/nearby?location=...&type=...` - Get nearby places

### Invitations
- `POST /api/invitation/create` - Generate invitation message
- `POST /api/invitation/send` - Send invitation via email

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration (Supabase, etc.)
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── services/        # Business logic & external APIs
│   └── server.js        # Entry point
├── .env.example
└── package.json
```

## External APIs Used

- OpenAI - AI itinerary & invitation generation
- OpenWeatherMap - Weather data
- Foursquare - Places & attractions
- Supabase - Database
- Mailjet/SendinBlue - Email service
