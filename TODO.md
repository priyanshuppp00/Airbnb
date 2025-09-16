# TODO: Optimize Data Fetching and State Management

## Backend Changes

- [x] Update backend/controllers/storeController.js to support pagination for getHomes API (add page and limit query params)
- [x] Test pagination endpoint
- [x] Fix duplicate session middleware in app.js

## Frontend Changes

- [x] Update frontend/src/service/api.js to include pagination params in getHomes
- [x] Update frontend/src/pages/HomeList.jsx to implement pagination (load more button)
- [x] Add localStorage persistence for userBookings and userFavourites in HomeList.jsx
- [x] Update home add/edit/delete components to refetch homes after operations
- [x] Ensure user context caches data after login/signup

## Testing

- [ ] Test pagination loading
- [ ] Test state persistence across refreshes
- [ ] Test home updates reflect immediately
