# TODO: Fix UI Loading States for Booking and Favourite Actions

## Approved Plan

- Add loading state arrays (bookingLoadingIds, favouriteLoadingIds) in AppContext to track multiple concurrent loading states.
- Update addBooking, removeBooking, addFavourite, removeFavourite functions in AppContext to manage these loading states.
- Refactor HomeList.jsx and Favourite.jsx to use these loading states from context to disable buttons and show loading indicators.
- Ensure UI updates smoothly after actions without full reloads.

## Steps

- [ ] Update AppContext.jsx to add loading state arrays and update functions
- [ ] Update HomeList.jsx to use loading states from context
- [ ] Update Favourite.jsx to use loading states from context
- [ ] Test booking and favourite actions for smooth UI updates
