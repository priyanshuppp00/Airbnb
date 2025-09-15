const express = require("express");
const authRouter = express.Router();

const multer = require("multer");
const { storage, fileFilter } = require("../config/multerConfig");
const upload = multer({ storage, fileFilter });

const authController = require("../controllers/authController");

authRouter.post("/login", authController.postLogin);
authRouter.post("/logout", authController.postLogout);
authRouter.post("/signup", upload.single("photo"), authController.postSignup);
authRouter.get("/forgot-password", authController.forgetpassword);
authRouter.post("/forgot-password", authController.forgetpassword);

authRouter.get("/current-user", authController.getCurrentUser);
authRouter.get("/check-session", (req, res) => {
  try {
    if (req.session && req.session.user) {
      return res.json({
        loggedIn: true,
        user: req.session.user,
        sessionId: req.sessionID,
      });
    }
    res.json({ loggedIn: false });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});
authRouter.put(
  "/profile",
  upload.single("profilePic"),
  authController.updateUserProfile
);

module.exports = authRouter;
