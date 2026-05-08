# CodePath - Complete Setup Guide

## Platform Overview
CodePath is a modern, AI-powered learning platform where users can create personalized learning roadmaps, complete interactive lessons, quizzes, and track their progress.

## New Features & Design

### Website Rebranding
- **Old Name**: Learning Platform / CodeMentor Academy
- **New Name**: CodePath
- **New Tagline**: "Master Code The Right Way"

### Modern Design System
- **Color Palette**: 
  - Primary: Purple (#a855f7)
  - Secondary: Pink (#ec4899)
  - Accent: Cyan (#06b6d4)
  - Background: Slate-900 to Purple-900 gradient
  
- **Animations**:
  - Blob animations for background
  - Float animations for UI elements
  - Glow effects for buttons
  - Smooth slide-in and fade-in transitions

### Key Pages & Features

#### 1. **Home Page** (`/app/page.jsx`)
- Modern hero section with gradient text
- Animated background with blob animations
- 6 feature cards with hover effects
- Call-to-action sections
- Footer with links
- Responsive design for all devices

#### 2. **Authentication** 
- **Signup** (`/app/signup/page.jsx`): Email/password registration + Google Sign-Up
- **Login** (`/app/login/page.jsx`): Email/password login + Google Sign-In
- Password strength validation
- User data stored in Neon database

#### 3. **Dashboard** (`/app/dashboard/page.jsx`)
- Welcome message with user name
- Learning streak tracker
- Statistics cards (problems solved, quizzes passed, courses completed)
- Active roadmaps list with progress bars
- Create new roadmap button
- Animated gradient background

#### 4. **Generate Roadmap** (`/app/generate/page.jsx`)
- Form to create AI-powered learning paths
- Topic, duration, and skill level selection
- Integration with Gemini API
- Automatic navigation to created roadmap

#### 5. **Roadmap Study** (`/app/roadmap/[id]/page.jsx`)
- Day-by-day structured learning
- Learn & Assignment tabs
- Interactive quizzes with scoring
- Progress tracking
- Next day navigation

## Technical Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide Icons
- **State Management**: React hooks

### Backend & Database
- **Database**: Neon (PostgreSQL)
- **Authentication**: Firebase
- **ORM/Database Access**: Custom SQL functions in `/lib/db.js`

### API Integration
- **AI**: Google Gemini API
- **Authentication**: Firebase Authentication

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd codepath
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Google Authentication in Authentication settings
4. Get your Firebase config from Project Settings
5. Create `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Neon Database Setup
1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Copy your connection string
4. Add to `.env.local`:

```env
DATABASE_URL=your_neon_connection_string
PGHOST=your_neon_host
PGUSER=your_neon_user
PGPASSWORD=your_neon_password
PGDATABASE=your_neon_database
```

### 5. Gemini API Setup (Optional)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add to `.env.local`:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### 6. Run the Development Server
```bash
npm run dev
# Server runs on http://localhost:3000
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  avatar_url TEXT,
  phone VARCHAR(20),
  provider VARCHAR(50) DEFAULT 'email',
  provider_id VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP
);
```

## Authentication Flow

### Google Sign-In/Sign-Up
1. User clicks "Sign in/up with Google"
2. Firebase authenticates user
3. API route saves/retrieves user from Neon
4. User data stored in localStorage
5. Redirect to dashboard

### Email Authentication
1. User submits email/password (signup) or email/password (login)
2. Firebase creates/authenticates user
3. API route saves user to Neon (signup) or verifies user (login)
4. User data stored in localStorage
5. Redirect to dashboard

## File Structure

```
codepath/
├── app/
│   ├── page.jsx                 # Home page
│   ├── login/page.jsx           # Login page
│   ├── signup/page.jsx          # Sign up page
│   ├── dashboard/page.jsx       # Dashboard
│   ├── generate/page.jsx        # Generate roadmap
│   ├── roadmap/[id]/page.jsx   # Study roadmap
│   ├── api/
│   │   └── auth/
│   │       ├── signup/route.js
│   │       ├── signin/route.js
│   │       └── google-signin/route.js
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── header.jsx
│   ├── ui/                      # shadcn/ui components
│   └── learning/
│       └── content-viewer.jsx
├── lib/
│   ├── firebase.js              # Firebase config
│   ├── firebase-auth.js         # Auth functions
│   ├── db.js                    # Database functions
│   └── mock-learning-content.js
└── public/
    └── icon.svg
```

## Key Features

### 1. AI-Powered Learning Paths
- Generate custom roadmaps using Gemini API
- Personalized based on topic and skill level
- Day-wise breakdown with lessons and assignments

### 2. User Authentication
- Email/password registration and login
- Google OAuth integration
- Secure password hashing
- Session management with localStorage

### 3. Progress Tracking
- Daily streak counter
- Problem solving statistics
- Quiz performance tracking
- Course completion metrics

### 4. Interactive Learning
- Lesson content with code examples
- Interactive quizzes with instant feedback
- Assignments for hands-on practice
- Copy-to-clipboard code examples

### 5. Modern UI/UX
- Responsive design
- Dark theme optimized
- Animated backgrounds
- Smooth transitions
- Accessibility features

## Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel Settings
4. Deploy

```bash
vercel
```

## Troubleshooting

### Firebase Authentication Issues
- Ensure Firebase config is correct
- Check authorized redirect URLs in Firebase Console
- Verify API keys have proper permissions

### Database Connection Issues
- Check Neon connection string is correct
- Verify network access from Vercel IP
- Ensure database tables are created

### API Errors
- Check console for detailed error messages
- Verify all environment variables are set
- Check API rate limits (Gemini has daily limits)

## Future Enhancements
- Real-time collaboration features
- Code execution environment
- Advanced analytics dashboard
- Mobile app
- Community features
- Certificate system
- Payment integration

## Support
For issues or questions, please contact support@codepath.dev

---

**CodePath - Master Code The Right Way**
