# ⚙️ CodePath — Backend API & Architecture Guide

This guide provides complete technical documentation for the **CodePath Backend Architecture**, **REST API Endpoints**, **MongoDB Database Layer**, and **Google Gemini AI Integrations**.

---

## 📋 Table of Contents

1. [Backend Overview](#1-backend-overview)
2. [Folder Structure](#2-folder-structure)
3. [Complete API Endpoints Catalog](#3-complete-api-endpoints-catalog)
   - [Authentication & Sessions](#31-authentication--sessions)
   - [Google Gemini AI Services](#32-google-gemini-ai-services)
   - [Learning Roadmaps & Modules](#33-learning-roadmaps--modules)
   - [Courses & Enrollments](#34-courses--enrollments)
   - [Gamification & Leaderboard](#35-gamification--leaderboard)
   - [User Management & Progress](#36-user-management--progress)
4. [MongoDB Database Layer](#4-mongodb-database-layer)
   - [Connection Pool & Setup](#41-connection-pool--setup)
   - [Collections & Document Schemas](#42-collections--document-schemas)
   - [Indexes](#43-indexes)
5. [Security & Middleware](#5-security--middleware)
6. [Testing the API (cURL & Postman)](#6-testing-the-api-curl--postman)

---

## 1. Backend Overview

The CodePath backend is a dedicated API service running on **Port 5000**:
- **Framework**: Next.js App Router (Route Handlers)
- **Database**: MongoDB (via official native `mongodb` driver v6.5)
- **AI Engine**: Google Gemini API (`@google/generative-ai`)
- **Authentication**: Bcrypt password hashing + Crypto session tokens + HTTP-only cookies
- **Validation**: Zod schema validation
- **Port**: `http://localhost:5000` (proxied from Frontend port 3000 at `/api/*`)

---

## 2. Folder Structure

```text
Backend/
├── app/
│   └── api/                           # API Route Handlers
│       ├── auth/
│       │   ├── signup/route.ts        # User registration
│       │   ├── signin/route.js        # User login
│       │   ├── login/route.js         # Alias login endpoint
│       │   ├── logout/route.js        # Session destruction
│       │   ├── refresh-session/route.js # Session token refresh
│       │   └── reset-password/route.js  # Password reset flow
│       │
│       ├── gemini/                    # Gemini AI integrations
│       │   ├── generate-daywise-roadmap/route.js # AI roadmap creator
│       │   ├── mentor/route.js        # AI chat tutor
│       │   ├── generate-challenge/route.js # Coding problem generator
│       │   ├── generate-quiz/route.js # Assessment quiz generator
│       │   ├── learning-path/route.ts # Learning path generator
│       │   └── resources/route.js     # Curated learning resources
│       │
│       ├── courses/
│       │   ├── route.js               # List/Create courses
│       │   └── enrollments/route.js   # User course enrollments
│       │
│       ├── roadmaps/
│       │   ├── route.js               # List/Create roadmaps
│       │   └── [id]/route.js          # Get/Update/Delete roadmap
│       │
│       ├── modules/
│       │   └── [id]/route.js          # Module details & completion
│       │
│       ├── users/
│       │   ├── profile/route.js       # User profile read/update
│       │   └── progress/route.js      # Overall learning progress
│       │
│       ├── gamification/
│       │   ├── stats/route.js         # XP points, level, streak
│       │   └── badges/route.js        # Achievement badges
│       │
│       ├── leaderboard/
│       │   └── route.js               # Global rank leaderboard
│       │
│       ├── chat/
│       │   └── route.js               # Chat message history
│       │
│       └── execute/
│           └── route.js               # Code execution endpoint
│
├── lib/                               # Core Utilities & Infrastructure
│   ├── mongodb.ts                     # MongoDB connection pool & index creation
│   ├── auth-utils.ts                  # Password hashing & token helpers
│   ├── api-middleware.ts              # Auth middleware & error wrapper
│   ├── validation-schemas.ts          # Zod validation schemas
│   └── init-database.js               # MongoDB seeder & collection setup
│
├── next.config.mjs                    # Next.js backend config (distDir: .next_backend)
├── package.json                       # Backend dependencies
└── tsconfig.json                      # Backend TypeScript config
```

---

## 3. Complete API Endpoints Catalog

### 3.1 Authentication & Sessions

#### `POST /api/auth/signup`
Creates a new user account.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "StrongPassword123!",
    "name": "Jane Doe"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "user": { "id": "662b...", "email": "user@example.com", "name": "Jane Doe" }
  }
  ```

#### `POST /api/auth/signin` (or `/api/auth/login`)
Authenticates user, verifies bcrypt password, sets HTTP-only `session_token` cookie.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "StrongPassword123!"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Login successful",
    "user": { "id": "662b...", "email": "user@example.com", "name": "Jane Doe" }
  }
  ```

#### `POST /api/auth/logout`
Deletes the active session from MongoDB and clears the session cookie.

---

### 3.2 Google Gemini AI Services

#### `POST /api/gemini/generate-daywise-roadmap`
Uses Google Gemini Flash to generate a structured, day-by-day learning plan.
- **Request Body**:
  ```json
  {
    "topic": "Python for Data Science",
    "level": "Beginner",
    "totalDays": 7
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "topic": "Python for Data Science",
    "level": "Beginner",
    "totalDays": 7,
    "days": [
      {
        "day": 1,
        "title": "Python Basics & Variables",
        "description": "Learn syntax, variables, and data types.",
        "topicsCovered": ["Variables", "Strings", "Numbers", "Input/Output"],
        "estimatedHours": 2,
        "practicalExercise": "Write a program that takes user input and performs math operations."
      }
    ]
  }
  ```

#### `POST /api/gemini/mentor`
Interactive chat endpoint for real-time coding assistance and debugging.
- **Request Body**:
  ```json
  {
    "message": "What is the difference between let, const, and var in JavaScript?",
    "context": { "topic": "JavaScript", "level": "Beginner" }
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "reply": "Here's the quick breakdown:\n- **const**: Cannot be reassigned. Use by default.\n- **let**: Block-scoped variable that can be reassigned.\n- **var**: Function-scoped, older syntax. Avoid in modern JS."
  }
  ```

#### `POST /api/gemini/generate-challenge`
Generates a practical coding problem based on topics covered.
- **Request Body**:
  ```json
  {
    "topicsCovered": ["Arrays", "Two Pointers"],
    "level": "Intermediate"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "title": "Reverse an Array",
    "difficulty": "Easy",
    "description": "Write a function that reverses an array in-place.",
    "starterCode": "function reverseArray(arr) {\n  // Your code here\n}",
    "testCases": [{ "input": "[1, 2, 3]", "expected": "[3, 2, 1]" }]
  }
  ```

#### `POST /api/gemini/generate-quiz`
Generates a 3-5 question multiple-choice quiz.
- **Request Body**:
  ```json
  {
    "topic": "React Hooks",
    "level": "Intermediate",
    "count": 3
  }
  ```

---

### 3.3 Learning Roadmaps & Modules

- `GET /api/roadmaps`: Returns all roadmaps belonging to the authenticated user.
- `POST /api/roadmaps`: Saves a newly generated roadmap to MongoDB.
- `GET /api/roadmaps/[id]`: Returns a roadmap and all its associated day modules.
- `DELETE /api/roadmaps/[id]`: Deletes a roadmap and cascades deletion to child modules.
- `GET /api/modules/[id]`: Retrieves module lesson content.
- `POST /api/modules/[id]`: Marks a module/day as completed and awards XP points.

---

### 3.4 Courses & Enrollments

- `GET /api/courses`: Returns all public courses (e.g. Web Development Basics, React Patterns).
- `POST /api/courses`: Admin endpoint to create a new course.
- `GET /api/courses/enrollments`: Returns list of courses the user is enrolled in.
- `POST /api/courses/enrollments`: Enrolls the user into a specific course.

---

### 3.5 Gamification & Leaderboard

- `GET /api/gamification/stats`: Returns user points, level, and current streak.
  ```json
  {
    "points": 450,
    "level": 3,
    "streakDays": 5,
    "problemsSolved": 12,
    "quizzesPassed": 6
  }
  ```
- `GET /api/gamification/badges`: Returns earned and locked achievement badges.
- `GET /api/leaderboard`: Returns the top 50 ranked learners sorted by XP points.

---

## 4. MongoDB Database Layer

### 4.1 Connection Pool & Setup
Connection pooling is managed by `Backend/lib/mongodb.ts`. It reuses an active MongoClient instance across serverless and Node.js requests to prevent connection exhaustion.

### 4.2 Collections & Document Schemas

| Collection | Key Fields | Description |
| :--- | :--- | :--- |
| `users` | `_id`, `email`, `name`, `password` (hashed), `created_at` | Registered user accounts |
| `sessions` | `_id`, `user_id`, `token`, `expiresAt`, `created_at` | Active user login sessions |
| `roadmaps` | `_id`, `user_id`, `title`, `topic`, `level`, `totalDays`, `created_at` | User learning paths |
| `modules` | `_id`, `roadmap_id`, `day`, `title`, `description`, `topicsCovered`, `completed` | Daily roadmap lessons |
| `progress` | `_id`, `user_id`, `module_id`, `roadmap_id`, `completed_at` | Module completion history |
| `courses` | `_id`, `title`, `description`, `category`, `difficulty`, `duration_hours` | Pre-built courses |
| `enrollments`| `_id`, `user_id`, `course_id`, `enrolled_at`, `progress_percentage` | Course enrollments |
| `leaderboard`| `_id`, `user_id`, `name`, `points`, `rank`, `updated_at` | User ranking cache |
| `streaks` | `_id`, `user_id`, `currentStreak`, `longestStreak`, `lastActiveDate` | Daily login streak tracker |
| `badges` | `_id`, `user_id`, `badge_type`, `badge_name`, `unlocked_at` | Unlocked achievements |

### 4.3 Indexes
Compound and unique indexes are automatically ensured on database connection:
- `users`: `{ email: 1 }` (unique)
- `sessions`: `{ token: 1 }` (unique), `{ expiresAt: 1 }`
- `roadmaps`: `{ user_id: 1 }`, `{ created_at: -1 }`
- `modules`: `{ roadmap_id: 1, day: 1 }`
- `leaderboard`: `{ points: -1 }`

---

## 5. Security & Middleware

- **Password Security**: Passwords are never stored in plaintext; hashed using `bcryptjs` with 10 salt rounds.
- **Session Tokens**: Cryptographically generated 256-bit hexadecimal strings (`crypto.randomBytes(32)`).
- **Cookies**: Session tokens are transmitted via `httpOnly`, `sameSite: "lax"`, and `secure` in production.
- **Validation**: All incoming requests are validated against Zod schemas in `Backend/lib/validation-schemas.ts`. Invalid requests immediately return `400 Bad Request` with structured error details.

---

## 6. Testing the API (cURL & Postman)

### Check Courses Endpoint:
```bash
curl http://localhost:5000/api/courses
```

### Test AI Mentor:
```bash
curl -X POST http://localhost:5000/api/gemini/mentor \
  -H "Content-Type: application/json" \
  -d '{"message": "Explain binary search in 2 sentences"}'
```

A Postman collection is also available at `Backend/docs/codepath-api.postman_collection.json`.

