const Home = require("../models/home");
const User = require("../models/user");
const path = require("path");

const rootDir = require("../utils/pathUtil");

exports.getIndex = (req, res, next) => {
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
          photoUrl: home.photo ? "/uploads/" + path.basename(home.photo) : null,
        };
      });
      res.json(homesWithPhotoUrl);
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to fetch homes" });
    });
};

exports.getHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      currentPage: "Home",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getBookingsList = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const userId = req.session.user._id;
    const user = await User.findById(userId).populate("bookings");
    const bookingsWithPhotoUrl = user.bookings.map((home) => {
      return {
        _id: home._id,
        houseName: home.houseName,
        price: home.price,
        location: home.location,
        rating: home.rating,
        description: home.description,
        photoUrl: home.photo ? "/uploads/" + path.basename(home.photo) : null,
      };
    });
    res.status(200).json(bookingsWithPhotoUrl);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings list" });
  }
};

exports.getFavouriteList = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const userId = req.session.user._id;
    const user = await User.findById(userId).populate("favourites");
    const favouritesWithPhotoUrl = user.favourites.map((home) => {
      return {
        _id: home._id,
        houseName: home.houseName,
        price: home.price,
        location: home.location,
        rating: home.rating,
        description: home.description,
        photoUrl: home.photo ? "/uploads/" + path.basename(home.photo) : null,
      };
    });
    res.status(200).json(favouritesWithPhotoUrl);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch favourite list" });
  }
};

exports.postAddToBooking = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const homeId = req.body.homeId;
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    if (!user.bookings.includes(homeId)) {
      user.bookings.push(homeId);
      await user.save();
    }
    res.status(200).json({ message: "Booked successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add to booking" });
  }
};

exports.postAddToFavourite = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const homeId = req.body.homeId;
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    if (!user.favourites.includes(homeId)) {
      user.favourites.push(homeId);
      await user.save();
    }
    res.status(200).json({ message: "Added to favourites" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add to favourite" });
  }
};

exports.postRemoveFromBooking = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const homeId = req.params.homeId;
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    if (user.bookings.includes(homeId)) {
      user.bookings = user.bookings.filter((book) => book != homeId);
      await user.save();
    }
    res.status(200).json({ message: "Booking removed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove from booking" });
  }
};

exports.postRemoveFromFavourite = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const homeId = req.params.homeId;
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    if (user.favourites.includes(homeId)) {
      user.favourites = user.favourites.filter((fav) => fav != homeId);
      await user.save();
    }
    res.status(200).json({ message: "Favourite removed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove from favourite" });
  }
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId)
    .then((home) => {
      if (!home) {
        return res.status(404).json({ error: "Home not found" });
      }

      // Check if this is an API request (JSON response expected)
      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        const homeWithPhotoUrl = {
          _id: home._id,
          houseName: home.houseName,
          price: home.price,
          location: home.location,
          rating: home.rating,
          description: home.description,
          photoUrl: home.photo ? "/uploads/" + path.basename(home.photo) : null,
        };
        res.json(homeWithPhotoUrl);
      } else {
        // Render the EJS template for web view
        res.render("store/home-detail", {
          home: home,
          pageTitle: "Home Detail",
          currentPage: "Home",
          isLoggedIn: req.isLoggedIn,
          user: req.session.user,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to fetch home details" });
    });
};

exports.getHomeRules = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
};
exports.downloadRules = (req, res) => {
  const homeId = req.params.homeId;
  const rulesFileName = "Rules.pdf";
  const filePath = path.join(rootDir, "rules", rulesFileName);

  res.download(filePath, rulesFileName, (err) => {
    if (err) {
      res.status(500).send("Failed to download the file.");
    }
  });
};
