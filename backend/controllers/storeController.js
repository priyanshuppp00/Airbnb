const Home = require("../models/home");
const User = require("../models/user");
const path = require("path");

const rootDir = require("../utils/pathUtil");

exports.getIndex = async (req, res, next) => {
  try {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? `${req.protocol}://${req.get("host")}`
        : "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalHomes = await Home.countDocuments();
    const homes = await Home.find().skip(skip).limit(limit);

    const homesWithPhotoUrl = homes.map((home) => {
      return {
        _id: home._id,
        houseName: home.houseName,
        price: home.price,
        location: home.location,
        rating: home.rating,
        description: home.description,
        photoUrl: home.photo
          ? Buffer.isBuffer(home.photo)
            ? `data:${home.photoMimeType};base64,${home.photo.toString(
                "base64"
              )}`
            : `${baseUrl}/uploads/${path.basename(home.photo)}`
          : null,
      };
    });

    res.json({
      homes: homesWithPhotoUrl,
      totalPages: Math.ceil(totalHomes / limit),
      currentPage: page,
      totalHomes,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch homes" });
  }
};

exports.getBookingsList = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? `${req.protocol}://${req.get("host")}`
        : "";
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
        photoUrl: home.photo
          ? Buffer.isBuffer(home.photo)
            ? `data:${home.photoMimeType};base64,${home.photo.toString(
                "base64"
              )}`
            : `${baseUrl}/uploads/${path.basename(home.photo)}`
          : null,
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
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? `${req.protocol}://${req.get("host")}`
        : "";
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
        photoUrl: home.photo
          ? `data:${home.photoMimeType};base64,${home.photo.toString("base64")}`
          : null,
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
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? `${req.protocol}://${req.get("host")}`
      : "";
  const homeId = req.params.homeId;
  Home.findById(homeId)
    .then((home) => {
      if (!home) {
        return res.status(404).json({ error: "Home not found" });
      }

      const homeWithPhotoUrl = {
        _id: home._id,
        houseName: home.houseName,
        price: home.price,
        location: home.location,
        rating: home.rating,
        description: home.description,
        photoUrl: home.photo
          ? `data:${home.photoMimeType};base64,${home.photo.toString("base64")}`
          : null,
      };
      res.json(homeWithPhotoUrl);
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to fetch home details" });
    });
};

exports.getHomeRules = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.status(401).json({ error: "User not authenticated" });
  }
  next();
};
exports.downloadRules = (req, res) => {
  const homeId = req.params.homeId;
  Home.findById(homeId)
    .then((home) => {
      if (!home) {
        return res.status(404).json({ error: "Home not found" });
      }
      if (home.houseRulePdf) {
        res.setHeader(
          "Content-Type",
          home.houseRulePdfMimeType || "application/pdf"
        );
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="HouseRule.pdf"'
        );
        res.send(home.houseRulePdf);
      } else {
        const filePath = path.join(rootDir, "public", "HouseRule.pdf");
        res.download(filePath, "HouseRule.pdf", (err) => {
          if (err) {
            res.status(500).json({ error: "Failed to download the file." });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to fetch home" });
    });
};
