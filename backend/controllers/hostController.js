const Home = require("../models/home");
const User = require("../models/user");
const fs = require("fs");
const path = require("path");
const { buildSafeHome } = require("../utils/safeHome");

// Delete file helper
const deleteFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, "../uploads", filename);
  fs.unlink(filePath, (err) => {
    if (err) console.error("Error deleting file:", err);
  });
};

// ---------------- POST Add Home ----------------
exports.postAddHome = (req, res) => {
  const { houseName, price, location, rating, description } = req.body;

  if (!req.file) return res.status(422).json({ error: "No image provided" });

  const home = new Home({
    houseName,
    price,
    location,
    rating,
    photos: req.file.filename,
    description,
  });

  home
    .save()
    .then(() => res.status(201).json({ message: "Home added successfully" }))
    .catch(() => res.status(500).json({ error: "Failed to save home" }));
};

// ---------------- POST Edit Home ----------------
exports.postEditHome = (req, res) => {
  const { id, houseName, price, location, rating, description } = req.body;

  Home.findById(id)
    .then((home) => {
      if (!home) return res.status(404).json({ error: "Home not found" });

      home.houseName = houseName;
      home.price = price;
      home.location = location;
      home.rating = rating;
      home.description = description;

      if (req.file) {
        deleteFile(home.photos);
        home.photos = req.file.filename;
      }

      return home.save();
    })
    .then(() => res.status(200).json({ message: "Home updated successfully" }))
    .catch(() => res.status(500).json({ error: "Failed to update home" }));
};

// ---------------- POST Delete Home ----------------
exports.postDeleteHome = (req, res) => {
  const homeId = req.params.homeId;

  Home.findById(homeId)
    .then((home) => {
      if (!home) return res.status(404).json({ error: "Home not found" });

      deleteFile(home.photos);
      deleteFile(home.houseRulePdf);

      return Home.findByIdAndDelete(homeId);
    })
    .then(() =>
      User.updateMany({}, { $pull: { bookings: homeId, favourites: homeId } })
    )
    .then(() => res.status(200).json({ message: "Home deleted successfully" }))
    .catch(() => res.status(500).json({ error: "Failed to delete home" }));
};

// ---------------- GET Homes API ----------------
exports.getHomesApi = (req, res) => {
  Home.find()
    .then((homes) => {
      const safeHomes = homes.map((home) => buildSafeHome(home, req));
      res.json(safeHomes);
    })
    .catch(() => res.status(500).json({ error: "Failed to fetch homes" }));
};

// ---------------- PUT Edit Home API ----------------
exports.editHomeApi = (req, res) => {
  const homeId = req.params.homeId;
  const { houseName, price, location, rating, description } = req.body;

  Home.findById(homeId)
    .then((home) => {
      if (!home) return res.status(404).json({ error: "Home not found" });

      home.houseName = houseName;
      home.price = price;
      home.location = location;
      home.rating = rating;
      home.description = description;

      if (req.files?.photo) {
        deleteFile(home.photos);
        home.photos = req.files.photo[0].filename;
      }

      if (req.files?.rulesFile) {
        deleteFile(home.houseRulePdf);
        home.houseRulePdf = req.files.rulesFile[0].filename;
      }

      return home.save();
    })
    .then(() => res.status(200).json({ message: "Home updated successfully" }))
    .catch(() => res.status(500).json({ error: "Failed to update home" }));
};

// ---------------- POST Add Home API ----------------
exports.postAddHomeApi = (req, res) => {
  const { houseName, price, location, rating, description } = req.body;

  const photos = req.files?.photo ? req.files.photo[0].filename : null;
  const houseRulePdf = req.files?.rulesFile
    ? req.files.rulesFile[0].filename
    : null;

  const home = new Home({
    houseName,
    price,
    location,
    rating,
    photos,
    houseRulePdf,
    description,
  });

  home
    .save()
    .then(() => res.status(201).json({ message: "Home added successfully" }))
    .catch(() => res.status(500).json({ error: "Failed to add home" }));
};
