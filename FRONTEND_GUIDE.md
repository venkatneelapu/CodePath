# 🎨 CodePath — Frontend Architecture & Developer Guide

This document provides a comprehensive overview of the **CodePath Frontend Application** built with **Next.js 15 (App Router)**, **React 19**, and **Tailwind CSS v4**.

---

## 📋 Table of Contents

1. [Frontend Overview](#1-frontend-overview)
2. [Folder Structure](#2-folder-structure)
3. [Page Routes & Navigation](#3-page-routes--navigation)
4. [Key Feature Walkthroughs](#4-key-feature-walkthroughs)
5. [UI Component Architecture](#5-ui-component-architecture)
6. [Interactive Code Playground](#6-interactive-code-playground)
7. [Theming & Styling (Tailwind CSS v4)](#7-theming--styling-tailwind-css-v4)
8. [Client-Side State & Hooks](#8-client-side-state--hooks)
9. [API Proxy & Backend Communication](#9-api-proxy--backend-communication)

---

## 1. Frontend Overview

The CodePath frontend delivers an intuitive, gamified, and responsive learning platform:
- **Framework**: Next.js 15 (App Router architecture)
- **UI Library**: React 19 + Radix UI primitives (`@radix-ui/*`)
- **Styling**: Tailwind CSS v4 with custom gradients, glassmorphism, and keyframe animations
- **Icons**: Lucide React (`lucide-react`)
- **Code Editor**: CodeMirror integration with live language execution
- **Port**: Runs on `http://localhost:3000`

---

## 2. Folder Structure

```text
Frontend/
├── app/                               # Next.js App Router (Routes & Layouts)
│   ├── layout.tsx                     # Global root layout with theme providers & header
│   ├── page.jsx                       # Home / Landing page
│   ├── login/page.jsx                 # User login page
│   ├── signup/page.jsx                # User registration page
│   ├── dashboard/page.jsx             # User progress & active roadmaps dashboard
│   ├── generate/page.jsx              # AI Roadmap generation form
│   ├── roadmap/[id]/page.jsx          # Day-by-day learning & study modules
│   ├── playground/page.jsx            # Interactive code execution playground
│   ├── ai-mentor/page.jsx             # Conversational AI coding tutor
│   ├── quiz/[roadmapId]/page.jsx      # Dynamic multiple-choice quiz
│   ├── challenge/[roadmapId]/page.jsx # Practical coding challenge page
│   ├── gamification/page.jsx          # Badges, streaks, and XP points
│   ├── leaderboard/                   # Global user ranking
│   ├── explore/page.jsx               # Explore community roadmaps
│   ├── forum/page.jsx                 # Discussion and QA forums
│   ├── problems/                      # Coding practice problems library
│   ├── interviews/page.jsx            # Tech interview prep questions
│   ├── resources/page.jsx             # Curated documentation & links
│   ├── profile/page.jsx               # User profile management
│   └── public-profile/[userId]/       # Public learner profile view
│
├── components/                        # Reusable Component Library
│   ├── ui/                            # Base Radix UI primitives (Button, Card, Dialog, etc.)
│   ├── landing/                       # Landing page sections (Hero, Features, Pricing)
│   ├── learning/                      # Learning progress, course cards, lesson viewers
│   ├── roadmap/                       # Timeline nodes, milestone cards, day selectors
│   ├── header.jsx                     # Top navigation bar
│   └── floating-chatbot.jsx           # Always-accessible floating AI assistant
│
├── hooks/                             # Custom React Hooks
│   ├── use-mobile.ts                  # Viewport breakpoint detection
│   └── use-toast.ts                   # Notification toast manager
│
├── lib/                               # Client Helpers & Data
│   ├── auth.js                        # Client authentication wrappers
│   ├── auth-secure.js                 # Session token management
│   ├── code-executor.js               # In-browser JavaScript & mock multi-language runner
│   ├── coding-problems.js             # Built-in practice problem bank
│   ├── interview-questions.js         # Comprehensive interview prep dataset
│   ├── predefined-roadmaps.js         # Curated roadmaps for offline fallback
│   ├── roadmap-data.js                # Roadmap structure utilities
│   ├── theme-manager.js               # Dark/Light theme switcher
│   └── topics-content.js              # Topic lesson templates
│
├── public/                            # Static assets (favicons, SVGs, placeholders)
├── styles/globals.css                 # Global CSS & Tailwind v4 theme rules
├── next.config.mjs                    # Next.js configuration & API proxy rewrite
└── tsconfig.json                      # Frontend TypeScript configuration
```

---

## 3. Page Routes & Navigation

| Route | Purpose | Access |
| :--- | :--- | :--- |
| `/` | Landing page with hero animations, features, and CTA | Public |
| `/login` | User login with email/password and session cookie | Public |
| `/signup` | User account registration | Public |
| `/dashboard` | Active roadmaps, daily streaks, progress percentages, stats | Authenticated |
| `/generate` | AI prompt form to generate a new customized roadmap | Authenticated |
| `/roadmap/[id]` | Day-wise learning curriculum with notes, quizzes, and tasks | Authenticated |
| `/playground` | Real-time code editor with execution console | Public / Authenticated |
| `/ai-mentor` | Dedicated full-screen chat with AI coding mentor | Authenticated |
| `/quiz/[roadmapId]` | Interactive assessment quiz testing daily roadmap retention | Authenticated |
| `/challenge/[roadmapId]` | Coding problem with starter code, constraints, and test runner | Authenticated |
| `/gamification` | View unlocked badges, active streak counter, and total XP | Authenticated |
| `/problems` | Practice bank with LeetCode-style problem descriptions | Public |
| `/interviews` | Curated technical interview questions organized by category | Public |

---

## 4. Key Feature Walkthroughs

### 4.1 AI Roadmap Generator (`/app/generate/page.jsx`)
- Collects:
  - **Topic**: e.g. "Full-Stack React & Node", "Machine Learning in Python", "Data Structures".
  - **Skill Level**: Beginner, Intermediate, Advanced.
  - **Duration**: Number of days (e.g. 5 days, 14 days, 30 days).
- Calls Backend API `/api/gemini/generate-daywise-roadmap`.
- Automatically structures lessons into daily milestones, saving the output directly to MongoDB.

### 4.2 Roadmap Study View (`/app/roadmap/[id]/page.jsx`)
- Split-screen learning:
  - **Left Panel**: Daily timeline navigation showing completed vs pending days.
  - **Right Panel**: Detailed lesson content, code examples, resource links, and action buttons.
- Features quick links to launch the day's **Interactive Quiz** or **Coding Challenge**.

### 4.3 AI Mentor (`/app/ai-mentor/page.jsx` & `floating-chatbot.jsx`)
- Communicates with `/api/gemini/mentor`.
- Provides succinct, friendly, conversational explanations and code reviews.
- Accessible both as a dedicated page and as a floating button across all pages.

---

## 5. UI Component Architecture

CodePath utilizes **Radix UI** primitives styled with Tailwind CSS in `Frontend/components/ui/`:

- **Layout & Feedback**: `Card`, `Dialog`, `AlertDialog`, `Sheet`, `Drawer`, `Accordion`, `Tabs`, `Toast`, `Sonner`, `Tooltip`.
- **Forms & Inputs**: `Button`, `Input`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Slider`, `Textarea`, `InputOTP`.
- **Navigation**: `NavigationMenu`, `Menubar`, `DropdownMenu`, `Pagination`, `Sidebar`, `Breadcrumb`.
- **Data Display**: `Progress`, `Badge`, `Avatar`, `Table`, `ScrollArea`, `Skeleton`, `Carousel`.

---

## 6. Interactive Code Playground

Located in `Frontend/app/playground/page.jsx` and backed by `Frontend/lib/code-executor.js`:
- Supports syntax-highlighted code editing.
- Runs client-side JavaScript safely inside isolated worker/sandboxed contexts.
- Captures standard console logs (`console.log`, `console.error`, `console.warn`) and displays them in a real-time output terminal.
- Supports resetting code, copying snippets, and loading starter code for problem sets.

---

## 7. Theming & Styling (Tailwind CSS v4)

CodePath is built with a modern developer-centric visual theme:
- **Primary Color**: Deep Indigo / Purple (`#8b5cf6` / `#a855f7`)
- **Secondary Color**: Vivid Pink / Fuchsia (`#ec4899`)
- **Accent Color**: Cyan (`#06b6d4`)
- **Background**: Slate-950 (`#020617`) with animated background gradient meshes and blur blobs.
- **Dark/Light Mode**: Managed by `next-themes` and `Frontend/lib/theme-manager.js`.

---

## 8. Client-Side State & Hooks

- `useMobile()`: Hook to determine viewport breakpoint and dynamically collapse sidebars on mobile screens.
- `useToast()`: Provides toast notifications for successful actions (e.g. roadmap created, quiz submitted, login successful).
- `auth.js`: Manages user login state in memory and handles session cookies issued by the backend.

---

## 9. API Proxy & Backend Communication

In `Frontend/next.config.mjs`, all requests made to `/api/*` are transparently rewritten to the Backend API server:

```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:5000/api/:path*', // Proxy to Backend Next.js API server
    },
  ];
}
```

This prevents CORS issues and allows the frontend to call `/api/auth/login`, `/api/gemini/mentor`, etc., via relative paths.
