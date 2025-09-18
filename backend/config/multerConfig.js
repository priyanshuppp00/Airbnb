const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const randomString = (length) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) =>
    cb(null, `${randomString(10)}-${file.originalname}`),
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
