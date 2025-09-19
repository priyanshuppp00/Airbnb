# Session Persistence Diagnosis and Fix Plan

## Root Cause Identified

The frontend API baseURL in production was falling back to `window.location.origin` (frontend URL) instead of the backend URL, causing API requests to go to the frontend instead of the backend. This prevented session cookies from being set or retrieved.

## Information Gathered

- Backend uses express-session with connect-mongo for MongoDB session store.
- Cookie settings: httpOnly=true, secure=true in production, sameSite='none' in production, maxAge=7 days.
- CORS allows credentials from FRONTEND_URL.
- trust proxy set in production.
- Static /uploads served with CORP cross-origin.
- Login regenerates session, sets isLoggedIn and user, saves session.
- getCurrentUser checks req.session?.isLoggedIn and req.session.user.
- Frontend uses axios with withCredentials=true.
- MONGO_URI is the same for connectDB and MongoStore.

## Fix Applied

- Modified frontend/src/service/api.js to require VITE_API_BASE_URL in production, throwing an error if not set.
- User must set VITE_API_BASE_URL=https://your-backend.onrender.com in Vercel environment variables.

## Plan

1. ✅ Add temporary logging to backend/app.js for env vars and proxy headers.
2. ✅ Add logging to authController.js for session checks and saves.
3. ✅ Fix frontend API baseURL fallback.
4. User sets VITE_API_BASE_URL in Vercel production env.
5. User redeploys frontend to Vercel.
6. Test login and refresh in production.
7. If issues, check backend logs for session saves.
8. Remove temporary logging.
9. Verify static images load correctly.
10. Verify profile updates persist session.

## Dependent Files Edited

- backend/app.js (added logging)
- backend/controllers/authController.js (added logging)
- frontend/src/service/api.js (fixed baseURL)

## Followup Steps

- Set VITE_API_BASE_URL in Vercel production environment to your backend URL (e.g., https://your-app.onrender.com).
- Redeploy frontend to Vercel.
- Test login and page refresh in production.
- If still issues, check backend logs for session errors.
- Remove logging from backend/app.js and backend/controllers/authController.js.
- Verify all features work.
