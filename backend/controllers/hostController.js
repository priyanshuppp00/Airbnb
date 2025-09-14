const Home = require("../models/home");
const fs = require("fs");
const User = require("../models/user");

exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, description } = req.body;

  if (!req.file) {
    return res.status(422).json({ error: "No image provided" });
  }

  const photo = req.file.path;

  const home = new Home({
    houseName,
    price,
    location,
    rating,
    photo,
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
        fs.unlink(home.photo, (err) => {
          if (err) {
            console.error("Error while deleting file ", err);
          }
        });
        home.photo = req.file.path;
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

  Home.findByIdAndDelete(homeId)
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

const path = require("path");

// API method to get homes as JSON
exports.getHomesApi = (req, res, next) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
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
          photoUrl: home.photo
            ? `${baseUrl}/uploads/${path.basename(home.photo)}`
            : null,
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

      home.houseName = houseName;
      home.price = price;
      home.location = location;
      home.rating = rating;
      home.description = description;

      if (req.files.photo) {
        fs.unlink(home.photo, (err) => {
          if (err) {
            console.error("Error while deleting file ", err);
          }
        });
        home.photo = req.files.photo[0].path;
      }

      if (req.files.rulesFile) {
        if (home.houseRulePdf) {
          fs.unlink(home.houseRulePdf, (err) => {
            if (err) {
              console.error("Error while deleting rules PDF ", err);
            }
          });
        }
        home.houseRulePdf = req.files.rulesFile[0].path;
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

  const photo = req.files.photo ? req.files.photo[0].path : null;
  const houseRulePdf = req.files.rulesFile ? req.files.rulesFile[0].path : null;

  const home = new Home({
    houseName,
    price,
    location,
    rating,
    photo,
    houseRulePdf,
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
