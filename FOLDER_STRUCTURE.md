# Project Folder Structure

Your AI Learning Platform project is now organized with clear separation between **Frontend** and **Backend** folders:

```
Ai Learning/
│
├── Frontend/                          # Next.js Frontend Application
│   ├── app/                           # Next.js app directory (pages, routes, layouts)
│   ├── components/                    # React components
│   │   ├── ui/                        # UI component library (buttons, cards, dialogs, etc.)
│   │   ├── landing/                   # Landing page components
│   │   ├── learning/                  # Learning-related components
│   │   ├── roadmap/                   # Roadmap components
│   │   ├── floating-chatbot.jsx       # Floating chatbot
│   │   ├── header.jsx                 # Header
│   │   └── theme-*.jsx               # Theme-related components
│   ├── hooks/                         # Custom React hooks
│   │   ├── use-mobile.ts
│   │   └── use-toast.ts
│   ├── lib/                           # Frontend utilities & helpers
│   │   ├── theme-manager.js           # Theme management
│   │   ├── auth-utils.js              # Authentication utilities
│   │   ├── code-executor.js           # Code execution utilities
│   │   └── ...other utilities
│   ├── public/                        # Static assets
│   ├── styles/                        # Global CSS styles
│   ├── next.config.mjs                # Next.js configuration
│   ├── tsconfig.json                  # TypeScript configuration
│   ├── postcss.config.mjs             # PostCSS configuration
│   └── next-env.d.ts                  # Next.js type definitions
│
├── Backend/                           # Backend API Layer
│   ├── api/                           # API routes & controllers
│   │   ├── auth/                      # Authentication endpoints
│   │   ├── chat/                      # Chat functionality endpoints
│   │   ├── courses/                   # Course management endpoints
│   │   ├── gamification/              # Gamification endpoints
│   │   ├── leaderboard/               # Leaderboard endpoints
│   │   ├── modules/                   # Module endpoints
│   │   ├── roadmaps/                  # Roadmap endpoints
│   │   ├── users/                     # User management endpoints
│   │   └── gemini/                    # Gemini AI integration endpoints
│   └── docs/                          # Backend documentation
│       ├── API_INTEGRATION.md
│       ├── BACKEND_GUIDE.md
│       ├── BACKEND_SETUP.md
│       ├── FIREBASE_SETUP.md
│       ├── MONGODB_SETUP.md
│       └── ...other docs
│
├── Root Configuration Files           # Project-level configs
│   ├── package.json                   # Root dependencies (shared across Frontend & Backend)
│   ├── .env                           # Environment variables
│   ├── .env.local.example             # Example environment variables
│   ├── .gitignore                     # Git ignore rules
│   └── ...other root configs
│
├── Documentation Files
│   ├── README.md                      # Project overview
│   ├── START_HERE.md                  # Getting started guide
│   ├── SETUP_GUIDE.md                 # Setup instructions
│   ├── ARCHITECTURE_OVERVIEW.md       # Architecture documentation
│   ├── FOLDER_STRUCTURE.md            # This file
│   └── ...other documentation
│
└── node_modules/                      # Dependencies
```

## Key Separation Points

### **Frontend/** - Client-Side Application

- **Purpose**: Next.js React application for user interface
- **Technology**: Next.js, React, TypeScript, Tailwind CSS
- **Config Files**: `next.config.mjs`, `tsconfig.json`, `postcss.config.mjs`
- **Entry Point**: `app/` directory with Next.js routing
- **Components**: UI components, pages, layouts in `components/` and `app/`

### **Backend/** - Server-Side API

- **Purpose**: API endpoints and server logic
- **Location**: `Backend/api/` - Contains route handlers
- **Documentation**: `Backend/docs/` - API guides and setup docs
- **Endpoints**:
  - Auth (login, register, JWT)
  - Chat (messaging functionality)
  - Courses, Modules, Roadmaps (learning content)
  - Gamification, Leaderboard (user engagement)
  - Users (profile management)
  - Gemini AI Integration

## Development Workflow

### Running Frontend (from `Frontend/` directory)

```bash
cd Frontend
npm install
npm run dev      # Start Next.js dev server on port 3000
```

### Running Backend (from `Backend/` directory)

```bash
cd Backend
npm install
npm run dev      # Start backend server
```

### From Root (if configured as monorepo)

```bash
npm install      # Install all dependencies
npm run dev      # Run both Frontend and Backend
```

## File Organization Best Practices

✅ **DO**:

- Keep all Frontend files in `Frontend/` folder
- Keep all Backend files in `Backend/` folder
- Update Backend files only in `Backend/api/` and `Backend/docs/`
- Import from appropriate folder paths (e.g., `../Frontend/components` from Backend should point to endpoints, not direct imports)

❌ **DON'T**:

- Put Frontend code in `Backend/`
- Put Backend code in `Frontend/`
- Mix concerns between the two folders
- Create API routes in `Frontend/app/api/` if Backend handles them

## Importing Across Folders

### Frontend importing from Backend (at runtime)

Frontend should **NOT directly import** Backend code. Instead, use API calls:

```javascript
// ❌ Wrong - Direct import
import { getUserData } from "../../Backend/api/users";

// ✅ Correct - API call
fetch("/api/users/profile")
  .then((res) => res.json())
  .then((data) => setUserData(data));
```

### Shared Types/Constants

Create a `shared/` folder for TypeScript types or constants if needed:

```
shared/
├── types/
│   └── user.ts
└── constants/
    └── endpoints.ts
```

## Environment Variables

Configure in `.env` at the root:

- **NEXT*PUBLIC*\*** - Available in Frontend
- **Database, API Keys** - Backend only
- See `.env.local.example` for reference

---

**Last Updated**: 2026-04-27
**Status**: ✅ Clean Frontend/Backend Separation Established
