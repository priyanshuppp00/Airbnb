# Fix Login Logout on Refresh Issue

## Tasks

- [x] Update backend session cookie configuration (remove invalid domain, set secure flag based on environment)
- [x] Normalize CORS allowed origins (remove trailing slashes)
- [x] Add cookie-parser middleware for better cookie handling
- [ ] Test login persistence on local frontend (http://localhost:5173/) and backend (http://localhost:3000)
- [ ] Test login persistence on deployment frontend (https://airbnb-henna-eight.vercel.app/) and backend (https://airbnb-backend-9kz8.onrender.com)
- [ ] Verify session and cookie logs in backend console
