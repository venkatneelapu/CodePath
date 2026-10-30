<div align="center">

# 🚀 CodePath — AI-Powered Learning Platform

### *Master Code The Right Way — Personalized AI Roadmaps, Interactive Coding Playground, Real-Time AI Mentor & Gamified Learning*

[![Live Demo](https://img.shields.io/badge/Live_Demo-codepath--tawny.vercel.app-00dfd8?style=for-the-badge&logo=vercel)](https://codepath-tawny.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas_Cloud-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/cloud/atlas)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-2.5%2F3.0-orange?style=for-the-badge&logo=google)](https://aistudio.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br/>

### 🌐 **Live Demo Website**: [https://codepath-tawny.vercel.app/](https://codepath-tawny.vercel.app/)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Quick Start (One-Command Setup)](#-quick-start-one-command-setup)
- [Vercel Cloud Deployment Guide](#-vercel-cloud-deployment-guide)
- [Environment Configuration (Single `.env`)](#-environment-configuration-single-env)
- [Database Setup (MongoDB)](#-database-setup-mongodb)
- [Available Scripts](#-available-scripts)
- [API Endpoints Overview](#-api-endpoints-overview)
- [Tech Stack](#-tech-stack)
- [Troubleshooting & FAQs](#-troubleshooting--faqs)
- [License](#-license)

---

## 🌟 Overview

**CodePath** is an end-to-end, full-stack, AI-driven educational platform designed to provide developers and students with adaptive, personalized learning experiences. 

Instead of static tutorials, CodePath leverages **Google Gemini AI** to generate tailored, day-by-day learning roadmaps, real-time interactive mentoring, instant automated coding challenges, and dynamic quizzes — all paired with an in-browser code executor and a motivating gamification system.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| 🎯 **AI Roadmap Generator** | Generates structured, day-wise curricula for any topic, duration, and difficulty level using Google Gemini AI. |
| 🤖 **24/7 AI Coding Mentor** | Context-aware conversational AI assistant that explains concepts, debugs code snippets, and provides instant guidance. |
| 💻 **Interactive Code Playground** | In-browser code editor with execution capabilities, syntax highlighting, and live output previews. |
| 📝 **Dynamic AI Quizzes & Challenges** | Auto-generates adaptive quizzes and coding assignments tailored to specific daily roadmap topics. |
| 🏆 **Gamification & Leaderboard** | Tracks learning streaks, award XP points, unlocks milestone badges, and showcases top learners on a global leaderboard. |
| 📊 **Comprehensive Analytics** | Visual progress tracking, completion percentages, problem-solving history, and streak counters. |
| 🔐 **Secure Authentication** | User authentication with session management, password hashing via bcrypt, and protected API routes. |

---

## 🏗️ System Architecture

CodePath features a modern, clean architecture with decoupled Frontend and Backend services unified by a zero-friction runner:

```
                      ┌─────────────────────────────────────────┐
                      │          User Web Browser               │
                      └────────────────────┬────────────────────┘
                                           │
                        Port 3000 (UI)     │    /api/* Proxied
                                           ▼
             ┌────────────────────────────────────────────────────────┐
             │                   Frontend (Next.js 15)                │
             │   - App Router (React 19, Tailwind CSS v4, Lucide)     │
             │   - Interactive UI, CodeMirror Playground, Dashboard   │
             └─────────────────────────────┬──────────────────────────┘
                                           │ HTTP Proxy Rewrite
                                           ▼
             ┌────────────────────────────────────────────────────────┐
             │                   Backend (Next.js API)                │
             │   - Dedicated API Server listening on Port 5000        │
             │   - Auth, Gamification, Courses, Roadmap Controllers   │
             └───────────────┬─────────────────────────┬──────────────┘
                             │                         │
                             ▼                         ▼
             ┌────────────────────────┐      ┌────────────────────────┐
             │      MongoDB           │      │    Google Gemini AI    │
             │   (Local / Atlas)      │      │  (Roadmaps, Chat, Quiz)│
             └────────────────────────┘      └────────────────────────┘
```

---

## 📂 Project Structure

```text
Ai Learning platform/
│
├── Frontend/                          # Next.js Client Application (Port 3000)
│   ├── app/                           # App Router: pages, layouts, routes
│   │   ├── dashboard/                 # User progress dashboard
│   │   ├── generate/                  # AI Roadmap creation page
│   │   ├── roadmap/[id]/              # Day-by-day roadmap study view
│   │   ├── playground/                # In-browser code runner
│   │   ├── ai-mentor/                 # Floating AI tutor interface
│   │   ├── quiz/                      # Dynamic quiz interface
│   │   ├── leaderboard/               # Global rankings
│   │   └── ...
│   ├── components/                    # Reusable React & Radix UI components
│   ├── hooks/                         # Custom React hooks
│   ├── lib/                           # Frontend helpers and utilities
│   └── styles/                        # Global Tailwind styles
│
├── Backend/                           # Next.js Backend API Server (Port 5000)
│   ├── app/api/                       # API route handlers
│   │   ├── auth/                      # Login, signup, session, password reset
│   │   ├── gemini/                    # AI roadmap, mentor chat, challenge, quiz
│   │   ├── courses/                   # Course catalog endpoints
│   │   ├── roadmaps/                  # User roadmaps CRUD
│   │   ├── gamification/              # Badges, XP points, streaks
│   │   └── leaderboard/               # Top ranks calculation
│   ├── lib/                           # Database connection (mongodb.ts) & middleware
│   └── docs/                          # Detailed API and database documentation
│
├── Reports/                           # Project deliverables, research papers, capstone reports
├── scripts/                           # Cross-platform single-command runner scripts
│   ├── dev.js                         # Launches Frontend + Backend concurrently
│   ├── build.js                       # Builds both applications
│   ├── start.js                       # Starts both production servers
│   ├── sync-env.js                    # Auto-syncs single root .env to services
│   └── init-db.js                     # Initializes MongoDB collections & seeds courses
│
├── .env                               # Single root environment configuration
├── package.json                       # Root dependencies and unified scripts
└── README.md                          # Project documentation
```

---

## 📋 Prerequisites

Before running CodePath, ensure you have the following installed:

1. **Node.js**: `v18.0.0` or higher (Node 20+ recommended) — [Download Node.js](https://nodejs.org/)
2. **Package Manager**: `npm` (comes with Node), `yarn`, or `pnpm`
3. **Database**: A MongoDB instance:
   - **Option A (Local)**: [MongoDB Community Server](https://www.mongodb.com/try/download/community) or [MongoDB Compass](https://www.mongodb.com/products/compass)
   - **Option B (Cloud - Free)**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
4. **Google Gemini API Key**: Free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## 🚀 Quick Start (One-Command Setup)

Follow these simple steps to clone, configure, and run the entire project on **any operating system** (Windows, macOS, or Linux):

### 1. Clone the Repository

```bash
git clone https://github.com/venkatneelapu/CodePath.git
cd CodePath
```

### 2. Install Dependencies

Install all project dependencies from the root directory with a single command:

```bash
npm install
```

### 3. Environment Configuration (`.env`)

Because `.env` files contain sensitive credentials and API keys, `.env` is **never committed to GitHub**. A clean template **`.env.example`** is provided in the repository.

1. Create your `.env` from the template:
   ```bash
   cp .env.example .env      # On macOS/Linux
   copy .env.example .env    # On Windows (CMD / PowerShell)
   ```
   *(Note: CodePath's dev runner also auto-creates `.env` from `.env.example` if it detects it is missing!)*

2. Open the created `.env` file and verify your variables:
   - **`MONGODB_URI`**: Your MongoDB connection string:
     - Local MongoDB: `mongodb://localhost:27017/codepath`
     - MongoDB Atlas (Cloud): `mongodb+srv://<username>:<password>@cluster0.mongodb.net/codepath?retryWrites=true&w=majority`
     *(Important: In MongoDB Atlas, go to **Network Access** and add `0.0.0.0/0` so your network IP is allowed).*
   - **`GEMINI_API_KEY`**: Your free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
   - **`JWT_SECRET`**: Any secret string (e.g. `codepath-jwt-secret-key-12345`).

Both Frontend and Backend automatically synchronize with this single root `.env` file.

### 4. Initialize Database (Optional but Recommended)

Seed sample courses and initialize MongoDB collections:

```bash
npm run db:init
```

### 5. Run the Entire Project with a Single Command

```bash
npm run dev
```

That's it! 
- 🌐 **Frontend Application**: [`http://localhost:3000`](http://localhost:3000)
- ⚙️ **Backend API**: [`http://localhost:5000`](http://localhost:5000)

> **Note:** You do **not** need to open multiple terminal tabs or manually run subfolders. `npm run dev` boots both Frontend and Backend concurrently, prefixes their logs with `[Frontend]` and `[Backend]`, and handles clean shutdown when you press `Ctrl + C`.

---

## ⚡ Vercel Cloud Deployment Guide

CodePath is fully optimized for **zero-configuration full-stack deployment on Vercel**. The Frontend and all 23+ Backend API endpoints run seamlessly under a single unified Next.js deployment.

### 🌐 Live Production URL
**[https://codepath-tawny.vercel.app/](https://codepath-tawny.vercel.app/)**

### Step-by-Step Vercel Deployment Instructions:

1. **Push to GitHub**:
   Ensure your latest code is pushed to your GitHub repository:
   ```bash
   git push origin main
   ```

2. **Import into Vercel**:
   - Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..."** → **"Project"**.
   - Select your repository: `venkatneelapu/CodePath`.

3. **Configure Project Settings**:
   - **Project Name**: `codepath` (or your preferred name)
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click `Edit` and select `Frontend` (or `./Frontend`).

4. **Set Environment Variables**:
   Under **Environment Variables**, add the following 3 essential keys for **Production and Preview** (keep them private without any public prefix):
   
   | Variable Name | Description / Recommended Value |
   | :--- | :--- |
   | `MONGODB_URI` | Your MongoDB Atlas connection URI string (`mongodb+srv://...`) |
   | `GEMINI_API_KEY` | Your Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey) |
   | `SESSION_SECRET` | A secure random 32+ character string (e.g. `codepath_super_secure_session_secret_key_2026`) |

> 🔒 **Security Note**: Never add `NEXT_PUBLIC_` prefix to `GEMINI_API_KEY`. All AI calls are executed securely on the server via Next.js API routes (`/api/gemini/*`). Removing the public prefix keeps your API key completely hidden and protected from the browser.

5. **Click "Deploy"**:
   - Vercel automatically builds and deploys your full-stack application in under 60 seconds!
   - Every subsequent `git push origin main` will **automatically build and update your live site** with zero downtime!

---

## ⚙️ Environment Configuration (Single `.env`)

CodePath uses a **Single `.env` Architecture**. There is only **one `.env` file in the entire repository**, located in the root directory.

### Single `.env` File Content:

```env
# ==============================================================================
# CodePath - Single Environment Configuration
# ==============================================================================

# 1. MongoDB Connection
# MongoDB Atlas Cloud Database (Active & Seeded):
MONGODB_URI=mongodb+srv://venkatnaidu:Venkat2005Pass@cluster0.bpjgtmw.mongodb.net/codepath?retryWrites=true&w=majority
# Local fallback (if working offline):
# MONGODB_URI=mongodb://localhost:27017/codepath

# 2. Google Gemini AI API Configuration (Kept strictly private on server)
GEMINI_API_KEY=your_gemini_api_key_here

# 3. Application URLs & Ports
NEXT_PUBLIC_APP_URL=http://localhost:3000
PORT=3000
BACKEND_PORT=5000

# 4. Authentication & Security
SESSION_SECRET=codepath_super_secure_session_secret_key_2026_xyz987654321
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000

# 5. Node Environment
NODE_ENV=development
```

---

## 🗄️ Database Setup (MongoDB)

### Local MongoDB
If running MongoDB locally, start your MongoDB service (via MongoDB Compass or terminal):
```bash
mongod
```
The default connection string is `mongodb://localhost:27017/codepath`.

### MongoDB Atlas (Cloud - Free)
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free M0 cluster.
3. Under **Database Access**, create a user with read/write privileges.
4. Under **Network Access**, add IP `0.0.0.0/0` (Allow Access from Anywhere) or your current IP.
5. Click **Connect** → **Drivers** → Copy the connection string.
6. Paste it into your root `.env` as `MONGODB_URI`.

Run the database seeder to verify your connection:
```bash
npm run db:init
```

---

## 📜 Available Scripts

Run all scripts directly from the project root:

| Command | Description |
| :--- | :--- |
| `npm run dev` | **Runs entire application** (Frontend on port 3000 + Backend on port 5000 concurrently). |
| `npm run build` | Builds both Backend and Frontend production bundles. |
| `npm start` | Launches both Backend and Frontend in production mode. |
| `npm run db:init` | Connects to MongoDB, creates collections/indexes, and seeds sample courses. |
| `npm run env:sync` | Manually syncs the root `.env` to `Frontend/.env.local` and `Backend/.env.local`. |
| `npm run dev:frontend` | Runs only the Frontend development server on port 3000. |
| `npm run dev:backend` | Runs only the Backend development server on port 5000. |
| `npm run lint` | Runs ESLint across the codebase. |

---

## 📡 API Endpoints Overview

All API requests made to `http://localhost:3000/api/*` are automatically proxied to the Backend service at `http://localhost:5000/api/*`.

### Authentication
- `POST /api/auth/signup` — Register a new user account (with hashed passwords).
- `POST /api/auth/login` — Authenticate user and issue secure session cookie.
- `POST /api/auth/logout` — Invalidate user session.
- `POST /api/auth/reset-password` — Handle password recovery.

### Gemini AI Features
- `POST /api/gemini/generate-daywise-roadmap` — Generate custom day-by-day learning curriculum.
- `POST /api/gemini/mentor` — Send prompts to the interactive coding AI mentor.
- `POST /api/gemini/generate-challenge` — Generate topic-based coding problems and unit tests.
- `POST /api/gemini/generate-quiz` — Generate multiple-choice assessment quizzes.
- `POST /api/gemini/resources` — Recommend curated learning resources for a topic.

### Courses & Roadmaps
- `GET /api/courses` — Retrieve available course catalog.
- `GET /api/roadmaps` — Retrieve roadmaps created by the current user.
- `POST /api/roadmaps` — Save a newly generated roadmap to MongoDB.
- `GET /api/roadmaps/[id]` — Fetch specific roadmap details and modules.

### Gamification & Analytics
- `GET /api/gamification/stats` — Fetch user XP points, level, and active streak.
- `GET /api/gamification/badges` — Fetch earned and available achievement badges.
- `GET /api/leaderboard` — Retrieve global leaderboard rankings.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4, Radix UI, Lucide React, CodeMirror
- **Backend**: Next.js App Router API, Node.js, bcryptjs, MongoDB Driver
- **AI Engine**: Google Gemini API (`@google/generative-ai`)
- **Database**: MongoDB (Local or Atlas)
- **Tooling & Orchestration**: Node.js cross-platform process runner, ESLint, PostCSS

---

## ❓ Troubleshooting & FAQs

### 1. `GEMINI_API_KEY not configured`
**Solution:** Ensure `GEMINI_API_KEY` is present in the root `.env` file. Restart with `npm run dev`.

### 1. `Internal server error` on Signup or Login
- **Cause:** When cloning the repo from GitHub, `.env` is intentionally excluded for security. Without a `.env` file, `MONGODB_URI` is undefined. Alternatively, if using MongoDB Atlas, your friend's current IP address might not be allowed in MongoDB Atlas Network Access.
- **Solution:**
  1. Ensure a `.env` file exists in the root directory (run `copy .env.example .env` on Windows or `cp .env.example .env` on Mac/Linux).
  2. Set `MONGODB_URI` to a working database or local MongoDB: `mongodb://localhost:27017/codepath`.
  3. If using MongoDB Atlas: open **MongoDB Atlas → Security → Network Access → Add IP Address → Allow Access from Anywhere (`0.0.0.0/0`)**.
  4. **Graceful Fallback:** CodePath now includes built-in offline/demo session handling. Even if MongoDB is temporarily unreachable or not yet configured, signup and login will succeed seamlessly without throwing a 500 error!

### 2. `Failed to connect to MongoDB` / `MongooseServerSelectionError`
**Solution:** Check that your local MongoDB server is running (`mongod`), or if using MongoDB Atlas, check that your IP address is whitelisted under **Network Access** in Atlas.

### 3. Port 3000 or 5000 is already in use
**Solution:** If another application or background process is using port 3000 or 5000:
- **Windows:** Run `netstat -ano | findstr :3000` and `taskkill /PID <PID> /F`
- **macOS / Linux:** Run `lsof -ti:3000 | xargs kill -9`

### 4. Do I need to edit files in `Frontend/` or `Backend/` to change settings?
**No.** All environment configurations are handled from the single root `.env` file. Any changes made there are automatically propagated to both services upon running `npm run dev`.

### 5. `Error generating path: Failed to generate learning path` / Gemini Leaked Key
**Cause:** Google automatically revokes Gemini API keys if detected on public repositories, returning `403 Forbidden: Your API key was reported as leaked`.
**Solution:**
1. Generate a free key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Update `GEMINI_API_KEY` in your root `.env` (and in Vercel **Project Settings → Environment Variables** if deployed). Do not prefix it with `NEXT_PUBLIC_` to keep it safe from browser exposure.
3. The platform also includes built-in intelligent fallback generators: even if Google's AI service is temporarily unavailable or rate limited, high-quality structured curricula, quizzes, and exercises will still be generated seamlessly!

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">
Made with ❤️ by <a href="https://github.com/venkatneelapu">Venkat Neelapu</a>
</div>
