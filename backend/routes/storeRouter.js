// External Module
const express = require("express");
const storeRouter = express.Router();

// Local Module
const storeController = require("../controllers/storeController");

storeRouter.get("/", storeController.getIndex);
storeRouter.get("/homes", storeController.getIndex);
storeRouter.get("/bookings", storeController.getBookingsList);
storeRouter.post("/bookings", storeController.postAddToBooking);
storeRouter.get("/favourites", storeController.getFavouriteList);

storeRouter.get("/homes/:homeId", storeController.getHomeDetails);
storeRouter.get(
  "/rules/:homeId",
  storeController.getHomeRules,
  storeController.downloadRules
);
storeRouter.post("/favourites", storeController.postAddToFavourite);
storeRouter.delete(
  "/favourites/:homeId",
  storeController.postRemoveFromFavourite
);
storeRouter.delete("/bookings/:homeId", storeController.postRemoveFromBooking);

module.exports = storeRouter;
