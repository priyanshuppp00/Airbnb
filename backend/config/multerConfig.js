// config/multerConfig.js
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const randomName =
      crypto.randomBytes(8).toString("hex") + path.extname(file.originalname);
    cb(null, randomName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "rulesFile") {
    cb(null, file.mimetype === "application/pdf");
  } else {
    const allowed = ["image/png", "image/jpg", "image/jpeg"];
    cb(null, allowed.includes(file.mimetype));
  }
};

module.exports = { storage, fileFilter };
