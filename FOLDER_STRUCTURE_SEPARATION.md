# Backend-Frontend Folder Separation Strategy

## Current Structure

```
Root/
├── app/                          (Frontend - Next.js)
│   ├── api/                      ❌ Should be removed/minimal
│   │   ├── auth/, chat/, etc.
│   ├── dashboard/, profile/      ✓ Frontend pages
│   ├── components/               ✓ UI components
│   └── ...
├── backend/                      (Backend API Logic)
│   ├── api/                      ✓ API endpoints
│   │   ├── auth/, chat/, etc.
│   ├── lib/                      ✓ Utility functions
│   └── docs/
└── package.json
```

## Recommended Structure

### Option 1: Monorepo with Shared Package (Recommended)

```
Root/
├── frontend/                     (Next.js app)
│   ├── app/                      (No /api subdirectory)
│   ├── components/
│   ├── hooks/
│   ├── public/
│   └── package.json
├── backend/                      (API Server)
│   ├── api/
│   ├── lib/
│   ├── server.js
│   └── package.json
├── shared/                       (Types, constants)
│   ├── types/
│   ├── constants/
│   └── package.json
└── package.json                  (Root workspace)
```

### Option 2: Separate Deployments

- **Frontend**: Next.js app deployed to Vercel (app/ folder only)
- **Backend**: Express/Node.js server deployed to separate service

## Benefits of Proper Separation

✓ **Clear responsibilities** - Frontend only handles UI, Backend handles logic  
✓ **Independent deployment** - Can update backend without frontend redeploy  
✓ **Better testing** - Easier to test each layer separately  
✓ **Scalability** - Backend can scale independently  
✓ **Security** - API secrets stay in backend only

## Current Issues to Address

1. **Duplicate route definitions** - app/api/ and backend/api/ both exist
2. **Mixed concerns** - API logic might be in both places
3. **Inconsistent imports** - Frontend and backend may import from shared places

## Migration Steps

1. ✓ Verify backend/api/ has all API implementations
2. ✓ Convert app/api/ routes to proxy routes (if keeping monorepo)
3. ✓ Move shared utilities to a shared folder
4. ✓ Update imports in frontend to point to API endpoints, not local backend code
5. ✓ Document API contracts

## Quick Decision

**Q: Do you want to:**

- A) Keep as monorepo (one deploy) - move frontend code to frontend/ folder
- B) Split into separate services (two deploys) - can move backend elsewhere
- C) Current structure but clean up duplication in api/ folders

**Default recommendation: Option A** - Clean up current structure as monorepo
