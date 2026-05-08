# CodePath Backend - Complete Setup Guide

Complete step-by-step guide to get your CodePath backend up and running.

## ✅ Prerequisites

- Node.js v24.14.1 or higher
- npm or yarn package manager
- Git (for version control)
- MongoDB Atlas account (or local MongoDB)
- Text editor (VS Code recommended)

---

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies

```bash
cd "d:\chrome\Ai Learning"
npm install
```

### Step 2: Configure Database

**Choose one option:**

#### Option A: MongoDB Atlas (Recommended)

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free account
3. Create M0 cluster (free tier)
4. Get connection string
5. Add to `.env.local`:

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

#### Option B: Local MongoDB

```bash
# Mac
brew install mongodb-community
brew services start mongodb-community

# Windows - download from mongodb.com/try/download/community
# Linux - follow https://docs.mongodb.com/manual/administration/install-on-linux/

# .env.local
MONGODB_URI=mongodb://localhost:27017/codepath
```

### Step 3: Set Environment Variables

Create `.env.local` in project root:

```env
# Database
MONGODB_URI=your_connection_string_here

# Gemini AI
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key_here

# Session
SESSION_SECRET=generate_random_32_character_string_here

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Initialize Database

```bash
node lib/init-database.js
```

Expected output:

```
🚀 Initializing CodePath Database...

📚 Creating collections...
  ✓ Created users collection
  ✓ Created sessions collection
  ... (more collections)

📖 Seeding sample courses...
  ✓ Created 5 sample courses

✅ Database initialization complete!
```

### Step 5: Start Development Server

```bash
npm run dev
```

Server runs at: `http://localhost:3000`

---

## 📋 What's Included

### Authentication System ✅

- Email/password registration with validation
- Secure login with bcrypt
- HTTP-only cookie sessions
- Password reset functionality
- Session refresh mechanism

### User Management ✅

- User profiles with avatar & bio
- Learning progress tracking
- Profile updates

### Roadmaps & Learning Paths ✅

- Create/edit/delete roadmaps
- Organize into modules/days
- Track completion progress
- AI-powered content generation (integration ready)

### Gamification ✅

- **Leaderboard**: Global ranking by points
- **Streaks**: Current and longest streaks
- **Points System**: Earn points for completing modules
- **Levels**: Auto-calculated from points
- **Badges**: Achievement system with 5 badge types
  - 🚀 First Step (1 roadmap)
  - 📚 Module Master (10 modules)
  - 🔥 Streak Warrior (7-day streak)
  - ⭐ Point Collector (100 points)
  - 🎓 Quiz Master (5 quizzes)

### Chat & AI Mentor ✅

- Store chat history in database
- Filter by roadmap
- Foundation for Gemini integration

### Course Management ✅

- Browse available courses
- Enroll in courses
- Track enrollments
- 5 sample courses pre-seeded

### Database ✅

- MongoDB with 12+ collections
- Automatic indexing for performance
- Proper relationships and references

---

## 📚 API Endpoints Reference

### Quick Access

**Authentication** (No auth required)

- `POST /api/auth/signup` - Register
- `POST /api/auth/signin` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh-session` - Refresh
- `POST /api/auth/reset-password` - Reset password

**User** (Auth required)

- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/progress` - Get progress

**Learning** (Auth required)

- `GET /api/roadmaps` - List roadmaps
- `POST /api/roadmaps` - Create roadmap
- `GET /api/roadmaps/:id` - Get roadmap
- `PUT /api/roadmaps/:id` - Update roadmap
- `DELETE /api/roadmaps/:id` - Delete roadmap
- `GET /api/modules/:id` - Get module
- `POST /api/modules/:id` - Complete module

**Chat** (Auth required)

- `GET /api/chat` - Get history
- `POST /api/chat` - Send message

**Gamification** (Auth required)

- `GET /api/gamification/stats` - Get stats
- `GET /api/gamification/badges` - Get badges

**Leaderboard** (No auth required)

- `GET /api/leaderboard` - Get leaderboard

**Courses** (Auth required)

- `GET /api/courses` - List courses
- `POST /api/courses` - Enroll
- `GET /api/courses/enrollments` - My enrollments

---

## 🧪 Testing the APIs

### Using Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Import collection from `docs/codepath-api.postman_collection.json`
3. Set base URL to `http://localhost:3000`

### Using cURL

#### Test Sign Up

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test123Test",
    "name":"Test User"
  }'
```

#### Test Sign In

```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email":"test@example.com",
    "password":"Test123Test"
  }'
```

#### Test Get Profile

```bash
curl http://localhost:3000/api/users/profile \
  -b cookies.txt
```

#### Test Create Roadmap

```bash
curl -X POST http://localhost:3000/api/roadmaps \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title":"React Mastery",
    "topic":"React",
    "duration_days":30,
    "generateAI":true
  }'
```

---

## 🔧 File Structure

```
app/
├── api/
│   ├── auth/
│   │   ├── signup/route.js           ✅ Register
│   │   ├── signin/route.js           ✅ Login
│   │   ├── logout/route.js           ✅ Logout
│   │   ├── refresh-session/route.js  ✅ Session refresh
│   │   └── reset-password/route.js   ✅ Password reset
│   ├── users/
│   │   ├── profile/route.js          ✅ User profile
│   │   └── progress/route.js         ✅ Learning progress
│   ├── roadmaps/
│   │   ├── route.js                  ✅ List & create
│   │   └── [id]/route.js             ✅ Get, update, delete
│   ├── modules/
│   │   └── [id]/route.js             ✅ Get & complete
│   ├── chat/
│   │   └── route.js                  ✅ Chat history
│   ├── gamification/
│   │   ├── stats/route.js            ✅ Get stats
│   │   └── badges/route.js           ✅ Get badges
│   ├── courses/
│   │   ├── route.js                  ✅ List & enroll
│   │   └── enrollments/route.js      ✅ My courses
│   └── leaderboard/
│       └── route.js                  ✅ Leaderboard

lib/
├── mongodb.js                        ✅ Database connection
├── auth-utils.js                     ✅ Auth helpers
├── api-middleware.js                 ✅ Middleware
├── validation-schemas.js             ✅ Zod schemas
├── init-database.js                  ✅ Setup script
└── api-client.js                     📝 Frontend integration

docs/
├── BACKEND_GUIDE.md                  📖 Full API docs
├── MONGODB_SETUP.md                  🗄️ Database setup
├── API_INTEGRATION.md                🔌 Frontend examples
└── BACKEND_SETUP.md                  📝 This file
```

---

## 🔐 Security Features

✅ **Password Security**

- Bcrypt hashing with 10 salt rounds
- Password validation (8+ chars, uppercase, lowercase, numbers)
- Secure password reset with tokens

✅ **Session Management**

- HTTP-only cookies (prevents XSS)
- Secure flag on production
- 7-day expiration
- Database-backed sessions

✅ **Input Validation**

- Zod schema validation on all endpoints
- Type checking
- Format validation
- Length limits

✅ **Authentication**

- All sensitive endpoints require valid session
- Middleware-based auth protection
- Ownership verification for user resources

---

## 🐛 Troubleshooting

### MongoDB Connection Failed

**Problem**: "connect ECONNREFUSED 127.0.0.1:27017"

**Solutions:**

```bash
# Check MongoDB is running
# Mac: brew services list
# Windows: Check Services app
# Docker: docker ps

# Test connection
mongosh "your_connection_string"

# Verify MONGODB_URI in .env.local
```

### "Unauthorized" on Protected Routes

**Problem**: Getting 401 on endpoints that require auth

**Solutions:**

```bash
# 1. Sign in first to get session cookie
# 2. Include credentials in fetch:
   fetch(url, { credentials: 'include' })
# 3. Check cookie is being set:
   Application > Cookies in DevTools
```

### "Invalid input" Validation Errors

**Problem**: 400 with validation errors

**Solutions:**

```bash
# Check request body matches schema
# Example: email must be valid format
#          password must have uppercase + lowercase + number
# See docs/BACKEND_GUIDE.md for exact requirements
```

### Database Collections Not Creating

**Problem**: Collections don't exist after init script

**Solutions:**

```bash
# Re-run init script
node lib/init-database.js

# Or manually create:
# Connect to MongoDB and run:
# db.createCollection('users')
# db.createCollection('roadmaps')
# etc.
```

---

## 📊 Database Monitoring

### MongoDB Atlas Web Console

1. Go to [atlas.mongodb.com](https://atlas.mongodb.com)
2. Click "Clusters" → "Browse Collections"
3. View data in real-time

### MongoDB Compass (GUI)

1. Download from [mongodb.com/compass](https://mongodb.com/products/compass)
2. Connect with MONGODB_URI
3. Browse collections visually

### Command Line

```bash
mongosh "your_uri"
use codepath
db.users.find().pretty()
db.roadmaps.countDocuments()
```

---

## 🎯 Next Development Steps

### Phase 1: Enhance Core (Week 1-2)

- [ ] Connect Gemini AI to /api/chat
- [ ] Implement `/api/gemini/*` routes
- [ ] Add email notifications for password reset
- [ ] Add avatar upload to cloud storage

### Phase 2: Frontend Integration (Week 2-3)

- [ ] Create signup/login pages
- [ ] Build dashboard with stats
- [ ] Create roadmap builder UI
- [ ] Implement progress tracking UI

### Phase 3: Advanced Features (Week 3-4)

- [ ] Rate limiting middleware
- [ ] Advanced gamification
- [ ] Quiz system
- [ ] Search and filtering

### Phase 4: Production Ready (Week 4+)

- [ ] API rate limiting
- [ ] Error logging and monitoring
- [ ] Performance optimization
- [ ] Security audit
- [ ] Load testing

---

## 📚 Documentation

- **Full API Reference**: [docs/BACKEND_GUIDE.md](./BACKEND_GUIDE.md)
- **Database Setup**: [docs/MONGODB_SETUP.md](./MONGODB_SETUP.md)
- **Frontend Integration**: [docs/API_INTEGRATION.md](./API_INTEGRATION.md)
- **Architecture**: See collection diagrams above

---

## 💡 Key Concepts

### Session Management

Sessions are stored in MongoDB with 7-day expiration. On login, an HTTP-only cookie is set. This cookie is automatically included in all requests (credentials: 'include'). The middleware verifies the session token.

### Gamification Points

- 10 points per completed module
- Streaks auto-update daily on module completion
- Badges auto-earned when requirements met
- Level = (points / 100) + 1

### Roadmaps

User creates roadmap → system generates modules (if AI enabled) → user marks modules complete → progress tracked → points awarded

---

## 🆘 Support

**Common Issues:**

- See [Troubleshooting](#-troubleshooting) section
- Check specific guide in `docs/` folder
- Review API response error messages

**Example Error Response:**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "password",
      "message": "Password must contain uppercase letters"
    }
  ]
}
```

---

## ✨ Features Ready to Build

Your backend infrastructure supports:

✅ Multi-user learning platform
✅ Personalized learning paths
✅ Progress tracking and analytics
✅ Gamification and competition
✅ AI-powered content (Gemini integration ready)
✅ Social features (leaderboards, streaks)
✅ Course management
✅ Chat history and AI mentor

---

## 📝 Environment Checklist

Before going production:

- [ ] MONGODB_URI configured
- [ ] SESSION_SECRET is 32+ random characters
- [ ] NEXT_PUBLIC_GEMINI_API_KEY added
- [ ] NEXT_PUBLIC_APP_URL is correct
- [ ] All endpoints tested
- [ ] Database backups configured
- [ ] Error logging set up
- [ ] Rate limiting implemented
- [ ] CORS configured
- [ ] HTTPS enforced (production)

---

## 🎉 You're Ready!

Your CodePath backend is ready to go. Next steps:

1. **Test All APIs** - Use Postman or cURL
2. **Build Frontend** - Integrate with React components
3. **Connect Gemini** - Add AI features
4. **Deploy** - Set up on production server
5. **Monitor** - Track usage and errors

---

Happy coding! 🚀

Last Updated: January 2024
