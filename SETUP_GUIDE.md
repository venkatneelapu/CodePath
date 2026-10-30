# 🛠️ CodePath — Complete Setup & Deployment Guide

This guide provides comprehensive, step-by-step instructions to clone, configure, run, test, and deploy the **CodePath** AI-Powered Learning Platform on any operating system (**Windows, macOS, Linux**).

---

## 📋 Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Step-by-Step Installation](#2-step-by-step-installation)
3. [Environment Configuration (Single `.env`)](#3-environment-configuration-single-env)
4. [Database Setup (MongoDB Local & Cloud Atlas)](#4-database-setup-mongodb-local--cloud-atlas)
5. [Running the Application](#5-running-the-application)
6. [Available NPM Commands](#6-available-npm-commands)
7. [Testing & Verification](#7-testing--verification)
8. [Production Build & Deployment](#8-production-build--deployment)
9. [Troubleshooting & FAQs](#9-troubleshooting--faqs)

---

## 1. Prerequisites

Before installing, ensure your machine has the following tools installed:

| Tool | Minimum Version | Recommended | Download Link |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v18.0.0` | `v20.x` or `v22.x` | [nodejs.org](https://nodejs.org/) |
| **npm** | `v9.0.0` | `v10.x`+ (included with Node) | Included with Node.js |
| **Git** | `v2.30.0`+ | Latest | [git-scm.com](https://git-scm.com/) |
| **MongoDB** | `v6.0`+ | Local Community or Atlas Cloud | [mongodb.com](https://www.mongodb.com/) |

Check your versions:
```bash
node -v
npm -v
git --version
```

---

## 2. Step-by-Step Installation

### Step 2.1: Clone the Repository
```bash
git clone https://github.com/venkatneelapu/CodePath.git
cd CodePath
```

### Step 2.2: Install Dependencies
Run the install command from the root folder:
```bash
npm install
```
This installs all required dependencies for both Frontend (Next.js 15, React 19, Tailwind CSS v4, Lucide, Radix UI) and Backend (MongoDB client, Google Generative AI, bcryptjs, Zod).

---

## 3. Environment Configuration (Single `.env`)

CodePath uses a **Single `.env` Architecture**. There is only **one `.env` file in the entire repository**, located in the root directory.

The repository includes a ready-to-run `.env` file pre-configured with default working settings:
```env
# MongoDB Connection (Local or Atlas)
MONGODB_URI=mongodb://localhost:27017/codepath

# Google Gemini AI Key (for AI Roadmaps, AI Mentor, Challenges, Quizzes)
GEMINI_API_KEY=AIzaSyAeq7ppqjGI5h7Hvx_eJCfPGKHFczVCmvc
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyAeq7ppqjGI5h7Hvx_eJCfPGKHFczVCmvc

# Application URLs & Ports
NEXT_PUBLIC_APP_URL=http://localhost:3000
PORT=3000
BACKEND_PORT=5000

# Auth & Rate Limiting
SESSION_SECRET=codepath_super_secure_session_secret_key_2026_xyz987654321
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000

# Environment
NODE_ENV=development
```

---

## 4. Database Setup (MongoDB Local & Cloud Atlas)

CodePath uses **MongoDB** for user accounts, session state, learning roadmaps, daily modules, quizzes, and gamification points.

### Option A: Local MongoDB (Fastest for Offline Development)
1. Install and start [MongoDB Community Server](https://www.mongodb.com/try/download/community) or launch via **MongoDB Compass**.
2. Start the MongoDB daemon:
   ```bash
   mongod
   ```
3. Your local connection URI is `mongodb://localhost:27017/codepath` (already pre-configured in `.env`).

### Option B: MongoDB Atlas (Cloud - Free)
1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free Shared Cluster.
2. Under **Database Access**, create a user with Read/Write privileges.
3. Under **Network Access**, add `0.0.0.0/0` (Allow Access from Anywhere) or your current IP.
4. Click **Connect** → **Drivers** → Copy the connection string.
5. In your root `.env`, update `MONGODB_URI`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/codepath?retryWrites=true&w=majority
   ```

### Step 4.1: Seed Database & Create Indexes
Run the built-in database initializer to create required collections, compound indexes, and seed sample courses:
```bash
npm run db:init
```

---

## 5. Running the Application

### Start Development Server (Single Command):
```bash
npm run dev
```

What happens automatically:
1. `scripts/sync-env.js` validates and syncs root `.env` to `Frontend/.env.local` and `Backend/.env.local`.
2. Starts **Backend API Server** on `http://localhost:5000`.
3. Starts **Frontend Web App** on `http://localhost:3000`.
4. Merges output streams with clear prefixes: `[Frontend]` (Cyan) and `[Backend]` (Magenta).
5. Clean shutdown on `Ctrl + C`.

Open your browser to:
- 🌐 **Frontend UI**: [http://localhost:3000](http://localhost:3000)
- ⚙️ **Backend Health/API**: [http://localhost:5000](http://localhost:5000)

---

## 6. Available NPM Commands

| Command | Action |
| :--- | :--- |
| `npm run dev` | **Runs both Frontend (port 3000) and Backend (port 5000) concurrently** |
| `npm run build` | Builds production bundles for Backend and Frontend |
| `npm start` | Starts both production servers concurrently |
| `npm run db:init` | Connects to MongoDB, creates indexes, and seeds courses |
| `npm run env:sync` | Syncs root `.env` to Frontend and Backend subfolders |
| `npm run dev:frontend` | Runs only the Frontend UI |
| `npm run dev:backend` | Runs only the Backend API |
| `npm run lint` | Runs ESLint across the project |

---

## 7. Testing & Verification

1. **Verify Backend Health**:
   Open browser or run:
   ```bash
   curl http://localhost:5000/api/courses
   ```
   Should return JSON list of available courses.

2. **Verify Frontend UI**:
   Navigate to `http://localhost:3000`. You should see the hero page with animated gradients.

3. **Verify AI Roadmap Generation**:
   Navigate to `http://localhost:3000/generate`, enter a topic (e.g., "Python for Beginners", 7 days), and click **Generate Roadmap**. The Gemini AI API will generate a day-by-day curriculum.

4. **Verify Interactive Code Playground**:
   Navigate to `http://localhost:3000/playground`, write JavaScript or Python code, and click **Run Code**.

---

## 8. Production Build & Deployment

### Build for Production:
```bash
npm run build
```

### Run Production Server:
```bash
npm start
```

### Vercel / Cloud Deployment:
- **Frontend**: Deploy `Frontend/` directly to Vercel. Set `NEXT_PUBLIC_APP_URL` and backend proxy.
- **Backend**: Deploy `Backend/` as a Node/Next.js service on Vercel, Railway, Render, or AWS.

---

## 9. Troubleshooting & FAQs

### Q1: `GEMINI_API_KEY not configured`
**Fix**: Ensure `GEMINI_API_KEY=AIzaSyAeq7ppqjGI5h7Hvx_eJCfPGKHFczVCmvc` is present in root `.env`. Run `npm run env:sync` and restart `npm run dev`.

### Q2: Port 3000 or 5000 is already in use
**Fix**:
- **Windows**:
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
  Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
  ```
- **macOS / Linux**:
  ```bash
  lsof -ti:3000,5000 | xargs kill -9
  ```

### Q3: `MongoServerSelectionError: connect ECONNREFUSED`
**Fix**: Ensure your local MongoDB server is running (`mongod` or MongoDB Compass), or check that your IP is whitelisted in MongoDB Atlas under Network Access (`0.0.0.0/0`).
