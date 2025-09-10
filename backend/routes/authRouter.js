const express = require("express");
const authRouter = express.Router();

const multer = require("multer");
const { storage, fileFilter } = require("../config/multerConfig");
const upload = multer({ storage, fileFilter });

const authController = require("../controllers/authController");

authRouter.get("/login", authController.getLogin);
authRouter.post("/login", authController.postLogin);
authRouter.post("/logout", authController.postLogout);
authRouter.get("/signup", authController.getSignup);
authRouter.post("/signup", upload.single("photo"), authController.postSignup);
authRouter.get("/forgot-password", authController.forgetpassword);
authRouter.post("/forgot-password", authController.forgetpassword);

authRouter.get("/current-user", authController.getCurrentUser);
authRouter.put(
  "/profile",
  upload.single("profilePic"),
  authController.updateUserProfile
);

module.exports = authRouter;
