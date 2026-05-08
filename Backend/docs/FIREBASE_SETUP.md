# Firebase Google Authentication Setup Guide

This document explains how to set up Firebase Google Authentication for your Learning Platform.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project" or select an existing one
3. Enter your project name (e.g., "learning-platform-8e")
4. Accept the terms and click "Create project"
5. Wait for the project to be created

## Step 2: Enable Google Sign-In

1. In the Firebase Console, go to **Authentication** in the left sidebar
2. Click on the **Sign-in method** tab
3. Click on **Google**
4. Toggle the "Enable" switch to ON
5. Select a project support email from the dropdown
6. Click "Save"

## Step 3: Get Your Firebase Configuration

1. In the Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. If you don't have a web app, click "Add app" and select "Web"
4. Register the app with a nickname (e.g., "Learning Platform Web")
5. Copy the Firebase config object that looks like:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

## Step 4: Set Environment Variables

Create a `.env.local` file in the root of your project and add:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

Replace the values with your actual Firebase config values.

## Step 5: Configure Authorized Domains

1. In the Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Google**
3. Scroll down to "Authorized domains"
4. Add your domain:
   - For local development: `localhost`
   - For production: Your actual domain (e.g., `yourdomain.com`)
5. Click "Save"

## Step 6: Install Firebase Package

If not already installed, run:

```bash
npm install firebase
# or
bun add firebase
```

## Step 7: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   # or
   bun dev
   ```

2. Go to the login page (`/login`) or signup page (`/signup`)

3. Click the "Sign in with Google" or "Sign up with Google" button

4. You should be redirected to Google's sign-in page

5. After successful authentication, you should be redirected to the dashboard

## Features Implemented

### Google Sign-In (`/lib/firebase-auth.js`)

- **signInWithGoogle()**: Authenticate existing users with Google
- **signUpWithEmail()**: Create new accounts with email and password
- **signInWithEmail()**: Sign in with email and password
- **signOutUser()**: Log out the current user
- **getCurrentUser()**: Get the currently logged-in user

### Integration Points

- **Login Page** (`/app/login/page.jsx`): Added Google Sign-In button alongside email login
- **Signup Page** (`/app/signup/page.jsx`): Added Google Sign-Up button alongside email signup
- **Firebase Config** (`/lib/firebase.js`): Firebase initialization with your config

## User Data Structure

When a user signs in with Google, the following data is stored:

```javascript
{
  id: "firebase_uid",
  name: "User's Display Name",
  email: "user@example.com",
  avatar: "https://google-avatar-url.jpg",
  provider: "google",
  createdAt: "2024-01-01T12:00:00.000Z"
}
```

This data is saved in localStorage and accessible throughout the app.

## Troubleshooting

### "Google Sign-In not working"
- Ensure your Firebase project ID is correct in `.env.local`
- Check that Google Sign-In is enabled in Firebase Authentication
- Verify your domain is added to "Authorized domains"

### "CORS errors"
- Make sure your domain is added to Firebase's authorized domains
- For localhost, ensure `localhost` is in the authorized domains list

### "User data not persisting"
- Check that localStorage is enabled in your browser
- Clear browser cache and try again

## Security Notes

- Your `NEXT_PUBLIC_*` variables are safe to expose (they're meant for client-side use)
- Never expose your Firebase private keys
- Always use HTTPS in production
- Firebase Authentication handles password hashing automatically

## Next Steps

1. Test Google Sign-In functionality
2. Set up email verification (optional)
3. Implement password reset functionality
4. Add profile picture uploads to user profiles
5. Set up Firestore for additional user data storage
