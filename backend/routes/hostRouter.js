// External Module
const express = require("express");
const multer = require("multer");
const { storage, fileFilter } = require("../config/multerConfig");
const upload = multer({ storage, fileFilter });
const hostRouter = express.Router();

// Local Module
const hostController = require("../controllers/hostController");

hostRouter.get("/add-home", hostController.getAddHome);
hostRouter.post(
  "/add-home",
  upload.single("photo"),
  hostController.postAddHome
);
hostRouter.get("/host-home-list", hostController.getHostHomes);
hostRouter.get("/edit-home/:homeId", hostController.getEditHome);
hostRouter.post(
  "/edit-home",
  upload.single("photo"),
  hostController.postEditHome
);
hostRouter.post("/delete-home/:homeId", hostController.postDeleteHome);

// API routes
hostRouter.get("/homes", hostController.getHomesApi);
hostRouter.post(
  "/homes",
  upload.single("photo"),
  hostController.postAddHomeApi
);
hostRouter.put(
  "/homes/:homeId",
  upload.single("photo"),
  hostController.editHomeApi
);
hostRouter.delete("/homes/:homeId", hostController.postDeleteHome);

module.exports = hostRouter;
