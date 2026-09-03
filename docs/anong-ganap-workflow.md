# Anong Ganap? - Project Workflow & Data Flow Documentation

## 📋 Overview
**Anong Ganap?** is a collaborative planning app where users create itineraries, invite friends, propose changes, and get weather-aware outfit suggestions.

---

## 🔄 Main Workflow Stages

### **Stage 1: Input Layer**
**Component:** User Input Form
- **Inputs:**
  - Location
  - Budget
  - Mood/Theme
  - Date
- **Output:** Form data sent to AI Engine
- **Purpose:** Capture user preferences for plan generation

---

### **Stage 2: AI Engine**
**Component:** AI Plan Generator
- **Input Source:** User Input Form data
- **External APIs:**
  - OpenAI (itinerary generation)
  - Weather API (weather data)
  - Location data (maps/places)
- **Processing:**
  - Generate 3 activities with times & costs
  - Retrieve weather forecast
  - Identify indoor/outdoor options
  - Generate backup plans
- **Output:** Generated plan data

---

### **Stage 3: Generated Plan Processing**
**Component:** AI Engine → Three Parallel Outputs

#### **3A: Itinerary System** 🗺️
- 3 activities with details
- Times and costs
- Indoor/outdoor classification
- Backup/alternative plans
- **Data forwarded to:** Collaboration System

#### **3B: Outfit System** 👔
- Color preferences
- Style suggestions
- Weather-adjusted recommendations
- Pinterest search links
- **Data forwarded to:** Collaboration System + Outfit Customization Flow

#### **3C: Weather Alert System** 🌤️
- Temperature readings
- Rain probability
- Weather-related advice
- Backup activity suggestions
- **Data forwarded to:** Collaboration System + Weather Adjustment Layer

---

### **Stage 4: Outfit Customization Flow**
**Sequence:** User Input → Pinterest API → Image Gallery → Selection

#### **Step 4.1: User Input**
- Select colors
- Choose style preferences
- Input: User preferences data

#### **Step 4.2: Pinterest API Integration**
- Search query: `{color} {style} {weather} outfit`
- Fetch Pinterest images matching preferences
- Output: 5 outfit suggestions

#### **Step 4.3: Image Gallery**
- Display 5 suggestions from Pinterest
- User reviews images
- User can remix/modify

#### **Step 4.4: Selection**
- User saves selected outfit
- Outfit data stored in database
- **Sent to:** Proposals system

---

### **Stage 5: Weather Adjustment Layer** 🌡️
**Triggers:** Real-time weather monitoring
- **Condition:** Temp > 30°C → Light fabrics recommendation
- **Condition:** Rain coming? → Add layer suggestion
- **Condition:** Cold? → Jacket suggestion
- **Output:** Weather-adjusted outfit recommendations
- **Application:** Applied to outfit suggestions before sending to collaborators

---

### **Stage 6: Collaboration System**

#### **6A: Send Invitation**
- **Input:** Generated plan + outfit selections
- **Method:** Email + shareable link
- **Mode:** Collaborative (allows suggestions)
- **Output:** Invitations sent to collaborators

#### **6B: Proposals System**
- **Input:** Invitation received by collaborators
- **Actions Available:**
  - Suggest alternative activity
  - Suggest alternative outfit
  - Suggest timing changes
  - Add reasons/comments
- **Voting System:** Collaborators vote on proposals
- **Output:** Proposal data with vote counts

#### **6C: Planner Review**
- **Input:** Proposals dashboard
- **Actions:**
  - Accept proposal (updates plan)
  - Reject proposal (keeps original)
  - Auto-update message sent
- **Output:** Final approved plan
- **Next:** Send updated notifications to all participants

---

### **Stage 7: Day-Of Execution**
**Real-time monitoring & notifications**

#### **7A: Weather Monitor** 🚨
- Real-time weather tracking
- Alert if conditions change significantly
- Suggest indoor backup if needed
- Trigger: Weather change > 5°C or rain alert

#### **7B: Real-Time Sync** 📲
- Status updates from participants
- Running late notifications
- Group status visibility
- Real-time plan adjustments

#### **7C: Outfit Reminder** 👔
- Photo of selected outfit
- Description of outfit
- Weather-specific notes
- Timing: 1-2 hours before event

---

### **Stage 8: Post-Event Loop** 📸
**Feedback & Learning**
- Capture photos from event
- Rate accuracy of:
  - Activity suggestions (1-5)
  - Outfit fit (1-5)
  - Weather predictions (1-5)
- Save memories/photos
- Collect user feedback
- **Purpose:** Improve AI recommendations for future plans

---

## 📊 Data Model

```
User
├─ Plan
│  ├─ Activities (3 + backups)
│  ├─ Outfit selections (per person)
│  ├─ Weather forecast
│  ├─ Collaborators list
│  │  ├─ Proposals (activity/outfit/timing)
│  │  └─ Votes
│  └─ Feedback (post-event)
└─ Memories (photos + notes)
```

**Database Tables:** ~10 tables
**Complexity:** Low-medium

---

## 🔀 Decision Trees & Branching Logic

### **Decision: Send Plan with Collaboration Enabled?**
```
Generated Plan
├─ YES → Send Invitation with collaborative mode enabled
│        → Enable Proposals system
│        → Show voting for collaborators
│        └─ Route to: Collaboration System
│
└─ NO → Send Plan as view-only
        → Skip Proposals system
        └─ Route directly to: Day-Of Execution
```

### **Decision: Weather Adjustment Needed?**
```
Weather Alert
├─ Temp > 30°C → Recommend light fabrics
├─ Rain coming? → Suggest layers/jacket
├─ Cold weather → Recommend jacket/sweater
└─ No adjustment needed → Use original outfit
```

### **Decision: Proposal Acceptance**
```
Planner Reviews Proposal
├─ ACCEPT → Update plan with new activity/outfit
│          → Send notification to all collaborators
│          └─ Auto-update collaborative mode
│
└─ REJECT → Keep original plan
           → Notify proposer (optional)
           └─ Proposal marked as rejected
```

---

## 📱 Core User Flows

### **Flow 1: Create & Send Plan** ⏱️ 3-5 minutes
1. User fills input form (location, budget, mood, date)
2. AI generates itinerary (3 activities)
3. Select outfit theme from suggestions
4. Decision: Allow suggestions? (YES/NO)
5. Send invitation via email + link
6. ✅ Plan created and shared

### **Flow 2: Invitee Proposes Alternatives** ⏱️ 2 minutes
1. Receive invitation (email/link)
2. View full plan and outfit
3. Click "Suggest Alternative"
4. Pick different activity or outfit
5. Add reason for proposal
6. Submit (enters voting system)
7. ✅ Proposal submitted

### **Flow 3: Planner Reviews & Approves** ⏱️ 5 minutes for 5 proposals
1. Open proposals dashboard
2. Read each alternative with reasons
3. View vote count from collaborators
4. For each proposal: ACCEPT or REJECT
5. Plan auto-updates
6. Send notifications to all participants
7. ✅ Finalized plan distributed

### **Flow 4: Day-Of Execution** ⏱️ Passive/Real-time
1. Open app
2. See outfit reminder (photo + description)
3. Receive weather alert (if changed)
4. Update group status if running late
5. Group sees your status in real-time
6. Event completes
7. ✅ Event happens

---

## 🔌 External API Integration Points

| API | Purpose | Trigger | Data Flow |
|-----|---------|---------|-----------|
| **OpenAI** | Itinerary generation | User submits form | Plan data → API → Activities |
| **Weather API** | Real-time weather | Form submit + Day-Of | Location → API → Weather alert |
| **Google Maps/OSM** | Location data, routing | Form submit | Location string → API → Coordinates |
| **Pinterest API** | Outfit image search | Outfit customization | Style params → API → Image URLs |
| **Foursquare/Places** | Activity recommendations | Itinerary generation | Location + category → API → Places |
| **Email (SendGrid)** | Invite notifications | Plan created + Review | Plan data → Email template → Recipient |
| **Cloudinary/Firebase** | Image storage | Post-event photos | Photo upload → CDN → Stored URL |

---

## 🔐 Data Movement & Security Points

### **Sensitive Data Flows:**
1. **User Input → AI Engine** - Budget, location, preferences
2. **User Account Data** - Email, password (encrypted)
3. **Collaborator List** - Shared with plan (email addresses)
4. **Photos/Memories** - User-generated content, stored securely

### **Authentication Gates:**
- User signup/login (Supabase Auth)
- Invitation acceptance (token verification)
- Plan access control (owner + invited only)

---

## 📈 Workflow Performance Metrics

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| Plans created per user/week | 2-3 | Engagement |
| Proposals per plan | 1-2 | Collaboration adoption |
| Proposal acceptance rate | 60%+ | Feature usefulness |
| Day-1 retention | 40%+ | User satisfaction |
| Day-7 retention | 20%+ | Product viability |
| Plan completion rate | 70%+ | Execution success |
| Outfit satisfaction rating | 4+/5 | AI quality |
| Weather alert usefulness | 4+/5 | Personalization value |

---

## ⚠️ Critical Error Handling Points

### **Stage 2: AI Generation Fails**
- Fallback: Use static template itineraries
- Notify user: "Using default suggestions"
- Retry: Allow user to regenerate

### **Stage 3: Weather API Unavailable**
- Fallback: Use historical weather data
- Disable weather alerts
- Show cached forecast if available

### **Stage 4: Pinterest API Limit Exceeded**
- Fallback: Show pre-curated outfit templates
- Queue retry for 1 hour later
- Notify user: "Using preset styles"

### **Stage 6: Email Delivery Fails**
- Log error with timestamp
- Retry: 3 attempts over 24 hours
- Fallback: Show share link for manual sharing

### **Stage 7: Real-Time Sync Offline**
- Queue updates locally
- Sync when connection restored
- Show "Last synced: X minutes ago"

---

## 🚀 Implementation Order (MVP)

1. **Week 1-2:** User auth + plan creation form
2. **Week 3-4:** AI integration + itinerary display
3. **Week 5-6:** Invitation system + proposals
4. **Week 7-8:** Outfit system + weather integration
5. **Week 9-10:** Day-Of execution + notifications
6. **Week 11-12:** Testing + polish + soft launch

---

## 🔗 Agent Integration Points

### **For Shell Script Agents (agents.sh):**
```bash
# Example agent tasks:
1. Monitor weather changes → Trigger alerts
2. Check proposal votes → Auto-accept if >60%
3. Send daily plan reminders → Scheduled notifications
4. Archive completed plans → Post-event cleanup
5. Generate weekly engagement reports → Analytics
```

### **For MCP Connectors:**
- Email connector (SendGrid/SMTP)
- Database connector (Supabase PostgreSQL)
- Weather connector (OpenWeather API)
- Image storage connector (Cloudinary/Firebase)
- Notification connector (Firebase Cloud Messaging)

---

## 📝 Notes for Developers/Agents

- **Modularity:** Each stage is independent; can be updated without affecting others
- **Scalability:** Data flows are designed to handle 1-1000+ users
- **Error Resilience:** Fallbacks exist for all external API calls
- **User Experience:** Notifications keep users informed at key decision points
- **Feedback Loop:** Post-event data improves AI for future recommendations

---

**Last Updated:** September 2026
**Status:** MVP Phase 1-2
**Next Review:** After soft launch (week 12)
