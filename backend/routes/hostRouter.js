// External Module
const express = require("express");
const multer = require("multer");
const { storage, fileFilter } = require("../config/multerConfig");
const upload = multer({ storage, fileFilter });
const hostRouter = express.Router();

// Local Module
const hostController = require("../controllers/hostController");

// API routes
hostRouter.get("/homes", hostController.getHomesApi);
hostRouter.post(
  "/homes",
  upload.fields([
    { name: "photo", maxCount: 10 },
    { name: "rulesFile", maxCount: 1 },
  ]),
  hostController.postAddHomeApi
);
hostRouter.put(
  "/homes/:homeId",
  upload.fields([
    { name: "photo", maxCount: 10 },
    { name: "rulesFile", maxCount: 1 },
  ]),
  hostController.editHomeApi
);
hostRouter.delete("/homes/:homeId", hostController.postDeleteHome);

module.exports = hostRouter;
