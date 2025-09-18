# QA and Code Audit TODO List

## 1. Frontend Image Loading Issues

- [x] Fix frontend/src/pages/HomeList.jsx to use home.photos instead of home.photo for image src
- [x] Check and fix any other frontend files using home.photo (e.g., HostHomes.jsx, HomeForm.jsx)
- [ ] Confirm frontend image URLs work with Vite proxy or full backend URLs

## 2. Backend Static File Serving

- [ ] Verify /uploads static serving in backend/app.js with CORS enabled
- [ ] Confirm multer config in backend/config/multerConfig.js stores files correctly
- [ ] Test image upload and serving locally

## 3. Environment Variables Validation

- [ ] Confirm backend .env variables (MONGO_URI, SESSION_SECRET, FRONTEND_URL, BACKEND_URL) are loaded correctly
- [ ] Confirm frontend .env variables (VITE_API_BASE_URL) are loaded correctly
- [ ] Test changing .env values and restarting servers

## 4. Session and Cookie Handling

- [ ] Verify express-session config in backend/app.js is secure for dev and prod
- [ ] Confirm CORS config allows credentials for frontend requests
- [ ] Test session persistence and cookie handling

## 5. Security Middleware

- [ ] Confirm helmet and express-rate-limit are properly configured
- [ ] Check for any missing security headers or rate limiting issues

## 6. Remove Unused Code

- [x] Remove commented console.logs in backend/app.js
- [x] Check for unused imports in backend and frontend files
- [x] Remove any deprecated or unused code

## 7. Deployment Readiness

- [ ] Confirm all URLs and paths work in production
- [ ] Test session cookies, CORS, and image uploads after deployment
- [ ] Verify static file serving in production

## 8. Suggest Safe Improvements

- [ ] Standardize photo field naming (photos vs photo) across frontend and backend
- [ ] Simplify session handling if possible
- [ ] Standardize backend routes for static files
- [ ] Provide instructions for testing locally and in production

## 9. Final Report

- [ ] Compile list of all detected issues categorized by frontend/backend/deployment
- [ ] Provide suggested fixes and code snippets
- [ ] Recommend cleaned, minimal codebase
- [ ] Give instructions to fully test locally and in production after .env changes
