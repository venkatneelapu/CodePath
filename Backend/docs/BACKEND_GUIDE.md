# CodePath Backend Documentation

## Overview

The CodePath backend is built on **MongoDB** with **Next.js API Routes**. It provides secure authentication, learning path management, gamification features, and AI-powered content generation.

---

## Quick Start

### 1. Environment Setup

Create a `.env.local` file in the project root:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

# Gemini AI
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# Session Management
SESSION_SECRET=generate_a_random_32_char_string_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
npm install
```

This installs the required packages:

- `bcryptjs` - Password hashing
- `mongodb` - Database driver
- `cookie` - Session management
- `zod` - Input validation

### 3. Initialize Database

```bash
node lib/init-database.js
```

This creates all necessary collections and seeds sample data.

### 4. Start Development Server

```bash
npm run dev
```

Navigate to `http://localhost:3000`

---

## Architecture

### Database Structure

#### Collections Overview

```
users
├── id (ObjectId)
├── email (unique)
├── password_hash
├── name
├── avatar_url
├── bio
├── created_at
└── updated_at

roadmaps
├── id (ObjectId)
├── user_id (ref: users)
├── title
├── description
├── topic
├── duration_days
├── status (active|paused|completed)
├── created_at
└── updated_at

modules
├── id (ObjectId)
├── roadmap_id (ref: roadmaps)
├── title
├── content
├── duration_day
├── module_order
├── created_at
└── generated (flag for AI content)

progress
├── id (ObjectId)
├── user_id (ref: users)
├── module_id (ref: modules)
├── completed
├── completion_date
└── created_at

leaderboard
├── id (ObjectId)
├── user_id (ref: users)
├── username
├── points
├── rank
├── level
├── created_at
└── updated_at

streaks
├── id (ObjectId)
├── user_id (ref: users, unique)
├── current_streak
├── longest_streak
├── last_activity_date
├── created_at
└── updated_at

badges
├── id (ObjectId)
├── user_id (ref: users)
├── badge_id
├── name
├── description
├── icon
└── earned_at

chat_history
├── id (ObjectId)
├── user_id (ref: users)
├── roadmap_id (ref: roadmaps, optional)
├── role (user|assistant)
├── content
└── created_at

courses
├── id (ObjectId)
├── title
├── description
├── category
├── difficulty
├── duration_hours
└── created_at

enrollments
├── id (ObjectId)
├── user_id (ref: users)
├── course_id (ref: courses)
├── enrolled_date
├── progress
├── status (active|completed)
└── created_at
```

---

## API Endpoints

### Authentication

#### **POST /api/auth/signup**

Register a new user.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Signup successful",
  "data": {
    "user_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Validations:**

- Email must be valid and unique
- Password: min 8 chars, 1 uppercase, 1 lowercase, 1 number
- Name: 2-100 characters

---

#### **POST /api/auth/signin**

Authenticate user and create session.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Signin successful",
  "data": {
    "user_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

Sets HTTP-only session cookie automatically.

---

#### **POST /api/auth/logout**

Invalidate user session.

**Response (200):**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

Clears session cookie automatically.

---

#### **POST /api/auth/refresh-session**

Refresh expired session.

**Response (200):**

```json
{
  "success": true,
  "message": "Session refreshed"
}
```

---

#### **POST /api/auth/reset-password**

Request password reset.

**Request:**

```json
{
  "email": "user@example.com"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "If an account exists, reset instructions have been sent"
}
```

**Confirm Reset (PUT /api/auth/reset-password):**

```json
{
  "token": "reset_token_from_email",
  "new_password": "NewPass123"
}
```

---

### User Management

#### **GET /api/users/profile**

Get current user profile (requires auth).

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar_url": "https://...",
    "bio": "Learning developer",
    "leaderboard": {
      "points": 250,
      "level": 3,
      "rank": 15
    },
    "streak": {
      "current_streak": 5,
      "longest_streak": 12,
      "last_activity_date": "2024-01-15T10:30:00Z"
    }
  }
}
```

---

#### **PUT /api/users/profile**

Update user profile.

**Request:**

```json
{
  "name": "Jane Doe",
  "avatar_url": "https://...",
  "bio": "Senior developer"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    /* updated user data */
  }
}
```

---

#### **GET /api/users/progress**

Get user learning progress across all roadmaps (requires auth).

**Response (200):**

```json
{
  "success": true,
  "data": {
    "overall_completion": 45,
    "total_roadmaps": 3,
    "total_modules": 20,
    "completed_modules": 9,
    "roadmaps": [
      {
        "roadmap_id": "507f1f77bcf86cd799439011",
        "title": "React Advanced",
        "total_modules": 10,
        "completed_modules": 7,
        "completion_percentage": 70,
        "status": "active",
        "created_at": "2024-01-10T09:00:00Z",
        "last_updated": "2024-01-15T14:30:00Z"
      }
    ]
  }
}
```

---

### Leaderboard

#### **GET /api/leaderboard**

Get global leaderboard.

**Query Params:**

- `limit`: 1-100 (default: 10)
- `offset`: pagination offset (default: 0)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "username": "John Doe",
        "points": 1250,
        "level": 13,
        "badge_count": 8
      }
    ],
    "total": 145,
    "limit": 10,
    "offset": 0
  }
}
```

---

### Roadmaps

#### **GET /api/roadmaps**

List user's roadmaps (requires auth).

**Query Params:**

- `limit`: 1-100 (default: 20)
- `offset`: pagination offset
- `status`: filter by status (active|paused|completed)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "roadmaps": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "user_id": "507f1f77bcf86cd799439012",
        "title": "Web Development 2024",
        "description": "Learn modern web development",
        "topic": "Web Development",
        "duration_days": 30,
        "status": "active",
        "module_count": 10,
        "completed_count": 3,
        "created_at": "2024-01-10T09:00:00Z"
      }
    ],
    "total": 5,
    "limit": 20,
    "offset": 0
  }
}
```

---

#### **POST /api/roadmaps**

Create new roadmap (requires auth).

**Request:**

```json
{
  "title": "React Learning Path",
  "description": "Complete React mastery",
  "topic": "React",
  "duration_days": 30,
  "generateAI": true
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Roadmap created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "React Learning Path",
    "status": "active"
  }
}
```

---

#### **GET /api/roadmaps/:id**

Get specific roadmap with modules (requires auth).

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "React Learning Path",
    "modules": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "title": "Day 1: React Basics",
        "content": "Learn JSX, components...",
        "duration_day": 1,
        "module_order": 1,
        "progress": {
          "completed": true,
          "completion_date": "2024-01-11T15:30:00Z"
        }
      }
    ]
  }
}
```

---

#### **PUT /api/roadmaps/:id**

Update roadmap (requires auth, ownership required).

**Request:**

```json
{
  "title": "Updated Title",
  "status": "paused"
}
```

---

#### **DELETE /api/roadmaps/:id**

Delete roadmap (requires auth, ownership required).

---

### Modules

#### **GET /api/modules/:id**

Get module details (requires auth).

---

#### **POST /api/modules/:id**

Mark module as complete (requires auth).

**Request:**

```json
{
  "completion_date": "2024-01-15T14:30:00Z"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Module marked as complete",
  "data": {
    "completed": true,
    "completion_date": "2024-01-15T14:30:00Z"
  }
}
```

**Side Effects:**

- Adds 10 points to leaderboard
- Updates user streak
- Checks for earned badges

---

### Chat History

#### **GET /api/chat**

Get chat history (requires auth).

**Query Params:**

- `limit`: 1-200 (default: 50)
- `offset`: pagination offset
- `roadmap_id`: filter by roadmap (optional)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "role": "user",
        "content": "How do I learn React?",
        "created_at": "2024-01-15T10:00:00Z"
      },
      {
        "_id": "507f1f77bcf86cd799439012",
        "role": "assistant",
        "content": "Here are the best ways to learn React...",
        "created_at": "2024-01-15T10:00:05Z"
      }
    ],
    "total": 42,
    "limit": 50,
    "offset": 0
  }
}
```

---

#### **POST /api/chat**

Send message and get AI response (requires auth).

**Request:**

```json
{
  "message": "Explain React hooks",
  "roadmap_id": "507f1f77bcf86cd799439011"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "user_message": {
      "_id": "507f1f77bcf86cd799439011",
      "role": "user",
      "content": "Explain React hooks"
    },
    "ai_message": {
      "_id": "507f1f77bcf86cd799439012",
      "role": "assistant",
      "content": "React Hooks are..."
    }
  }
}
```

---

### Gamification

#### **GET /api/gamification/stats**

Get user gamification stats (requires auth).

**Response (200):**

```json
{
  "success": true,
  "data": {
    "points": 250,
    "level": 3,
    "rank": 15,
    "streak": {
      "current": 5,
      "longest": 12,
      "last_activity": "2024-01-15T14:30:00Z"
    },
    "badges": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "badge_id": "first_roadmap",
        "name": "First Step",
        "icon": "🚀",
        "earned_at": "2024-01-10T09:00:00Z"
      }
    ]
  }
}
```

---

#### **GET /api/gamification/badges**

Get user badges and check for newly earned (requires auth).

**Response (200):**

```json
{
  "success": true,
  "data": {
    "badges": [
      /* all user badges */
    ],
    "newly_earned": ["module_master"]
  }
}
```

**Available Badges:**

- 🚀 **First Step** - Complete 1 roadmap
- 📚 **Module Master** - Complete 10 modules
- 🔥 **Streak Warrior** - Maintain 7-day streak
- ⭐ **Point Collector** - Earn 100 points
- 🎓 **Quiz Master** - Pass 5 quizzes

---

### Courses & Enrollment

#### **GET /api/courses**

List all available courses.

**Query Params:**

- `limit`: 1-100 (default: 20)
- `offset`: pagination offset
- `category`: filter by category

**Response (200):**

```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Web Development Basics",
        "description": "Learn HTML, CSS, JavaScript",
        "category": "Web Development",
        "difficulty": "Beginner",
        "duration_hours": 40
      }
    ],
    "total": 12,
    "limit": 20,
    "offset": 0
  }
}
```

---

#### **POST /api/courses**

Enroll in a course (requires auth).

**Request:**

```json
{
  "course_id": "507f1f77bcf86cd799439011"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Enrolled successfully",
  "data": {
    "enrollment_id": "507f1f77bcf86cd799439012",
    "course_id": "507f1f77bcf86cd799439011",
    "status": "active"
  }
}
```

---

#### **GET /api/courses/enrollments**

Get user's course enrollments (requires auth).

**Response (200):**

```json
{
  "success": true,
  "data": {
    "enrollments": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "user_id": "507f1f77bcf86cd799439013",
        "course_id": "507f1f77bcf86cd799439011",
        "enrolled_date": "2024-01-10T09:00:00Z",
        "progress": 45,
        "status": "active",
        "course": {
          /* course details */
        }
      }
    ],
    "total": 3,
    "limit": 20,
    "offset": 0
  }
}
```

---

## Error Handling

All errors return consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [{ "field": "email", "message": "Invalid email address" }]
}
```

**Common Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad request / Validation error
- `401` - Unauthorized / Not authenticated
- `403` - Forbidden / Insufficient permissions
- `404` - Not found
- `500` - Server error

---

## Security

### Session Management

- HTTP-only cookies prevent XSS attacks
- Secure flag on production
- 7-day expiration
- Database-backed sessions

### Password Security

- Bcrypt hashing with salt rounds 10
- Password policy enforcement
- Password reset with token validation

### Input Validation

- Zod schema validation on all endpoints
- Type checking
- Length and format validation

### CORS & CSRF

- Configured per environment
- SameSite cookie policy

---

## Next Steps

1. **Connect Gemini API** - Implement AI response in chat endpoint
2. **Email Integration** - Set up password reset emails
3. **File Upload** - Handle avatar uploads to cloud storage
4. **API Rate Limiting** - Add rate limiting middleware
5. **Admin Dashboard** - Create admin endpoints for course management
6. **Analytics** - Track learning metrics and user behavior
7. **Notifications** - Send streak reminders, achievement alerts

---

## Environment Checklist

- [ ] MONGODB_URI configured
- [ ] NEXT_PUBLIC_GEMINI_API_KEY configured
- [ ] SESSION_SECRET generated (32+ characters)
- [ ] NEXT_PUBLIC_APP_URL set correctly
- [ ] Database initialized
- [ ] Sample courses seeded
- [ ] Test authentication endpoints

---

## Support & Debugging

Enable debug logs in development:

```javascript
// In your .env.local
DEBUG=codepath:*
```

Check database directly:

```javascript
// Use MongoDB Compass or Atlas Dashboard
// Connection: MONGODB_URI from .env.local
```

---

Last Updated: January 2024
