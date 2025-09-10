const Home = require("../models/home");
const fs = require("fs");
const User = require("../models/user");

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
    editing: false,
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";

  Home.findById(homeId).then((home) => {
    if (!home) {
      return res.redirect("/host/host-home-list");
    }

    res.render("host/edit-home", {
      home: home,
      pageTitle: "Edit your Home",
      currentPage: "host-homes",
      editing: editing,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getHostHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Host Homes List",
      currentPage: "host-homes",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, description } = req.body;

  if (!req.file) {
    return res.status(422).send("No image provided");
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
      res.redirect("/host/host-home-list");
    })
    .catch((err) => {
      res.status(500).send("Failed to save home");
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
          res.redirect("/host/host-home-list");
        })
        .catch((err) => {
          res.status(500).send("Failed to update home");
        });
    })
    .catch((err) => {
      res.status(500).send("Failed to find home");
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
      // Check if this is an API request (JSON response expected)
      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        res.status(200).json({ message: "Home deleted successfully" });
      } else {
        // Web request - redirect to host home list
        res.redirect("/host/host-home-list");
      }
    })
    .catch((error) => {
      // Check if this is an API request for error response
      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        res.status(500).json({ error: "Failed to delete home" });
      } else {
        res.status(500).send("Failed to delete home");
      }
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
          photoUrl: home.photo ? "/" + home.photo.replace(/\\/g, "/") : null,
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

      if (req.file) {
        fs.unlink(home.photo, (err) => {
          if (err) {
            console.error("Error while deleting file ", err);
          }
        });
        home.photo = req.file.path;
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
      res.status(500).json({ error: "Failed to add home" });
    });
};
