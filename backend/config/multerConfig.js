// config/multerConfig.js
const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "rulesFile") {
    cb(null, file.mimetype === "application/pdf");
  } else {
    const allowed = ["image/png", "image/jpg", "image/jpeg"];
    cb(null, allowed.includes(file.mimetype));
  }
};

module.exports = { storage, fileFilter };
