const Home = require("../models/home");
const fs = require("fs");
const path = require("path");
const User = require("../models/user");

exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, description } = req.body;

  if (!req.file) {
    return res.status(422).json({ error: "No image provided" });
  }

  const photo = req.file.buffer;
  const photoMimeType = req.file.mimetype;

  const home = new Home({
    houseName,
    price,
    location,
    rating,
    photo,
    photoMimeType,
    description,
  });
  home
    .save()
    .then(() => {
      res.status(201).json({ message: "Home added successfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to save home" });
    });
};

exports.postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating, description } = req.body;
  Home.findById(id)
    .then((home) => {
      home.houseName = houseName;
      home.price = price;
      home.location = location;
      home.rating = rating;
      home.description = description;

      if (req.file) {
        home.photo = req.file.buffer;
        home.photoMimeType = req.file.mimetype;
      }

      home
        .save()
        .then((result) => {
          res.status(200).json({ message: "Home updated successfully" });
        })
        .catch((err) => {
          res.status(500).json({ error: "Failed to update home" });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to find home" });
    });
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;

  Home.findById(homeId)
    .then((home) => {
      if (!home) {
        return res.status(404).json({ error: "Home not found" });
      }

      // Delete photos
      if (home.photos && home.photos.length > 0) {
        home.photos.forEach((filename) => {
          const filePath = path.join(__dirname, "../uploads", filename);
          fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting photo:", err);
          });
        });
      }

      return Home.findByIdAndDelete(homeId);
    })
    .then(() => {
      // Remove the homeId from all users' bookings and favourites arrays
      return User.updateMany(
        {},
        { $pull: { bookings: homeId, favourites: homeId } }
      );
    })
    .then(() => {
      res.status(200).json({ message: "Home deleted successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to delete home" });
    });
};

// API method to get homes as JSON
exports.getHomesApi = (req, res, next) => {
  Home.find()
    .then((homes) => {
      const homesWithPhotoUrl = homes.map((home) => {
        return {
          _id: home._id,
          houseName: home.houseName,
          price: home.price,
          location: home.location,
          rating: home.rating,
          description: home.description,
          photoUrls: home.photos
            ? home.photos.map(
                (filename) => `http://localhost:3000/uploads/${filename}`
              )
            : [],
        };
      });
      res.json(homesWithPhotoUrl);
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to fetch homes" });
    });
};

exports.editHomeApi = (req, res, next) => {
  const homeId = req.params.homeId;
  const { houseName, price, location, rating, description } = req.body;

  Home.findById(homeId)
    .then((home) => {
      if (!home) {
        return res.status(404).json({ error: "Home not found" });
      }

      // Delete old photos
      if (home.photos && home.photos.length > 0) {
        home.photos.forEach((filename) => {
          const filePath = path.join(__dirname, "../uploads", filename);
          fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting old photo:", err);
          });
        });
      }

      home.houseName = houseName;
      home.price = price;
      home.location = location;
      home.rating = rating;
      home.description = description;

      if (req.files.photo) {
        home.photos = req.files.photo.map((file) => file.filename);
      } else {
        home.photos = [];
      }

      if (req.files.rulesFile) {
        home.houseRulePdf = req.files.rulesFile[0].buffer;
        home.houseRulePdfMimeType = req.files.rulesFile[0].mimetype;
      }

      return home.save();
    })
    .then(() => {
      res.status(200).json({ message: "Home updated successfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to update home" });
    });
};

// API method to add home via JSON
exports.postAddHomeApi = (req, res, next) => {
  const { houseName, price, location, rating, description } = req.body;

  const photos = req.files.photo
    ? req.files.photo.map((file) => file.filename)
    : [];
  const houseRulePdf = req.files.rulesFile
    ? req.files.rulesFile[0].buffer
    : null;
  const houseRulePdfMimeType = req.files.rulesFile
    ? req.files.rulesFile[0].mimetype
    : null;

  const home = new Home({
    houseName,
    price,
    location,
    rating,
    photos,
    houseRulePdf,
    houseRulePdfMimeType,
    description,
  });

  home
    .save()
    .then(() => {
      res.status(201).json({ message: "Home added successfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to add home" });
    });
};
