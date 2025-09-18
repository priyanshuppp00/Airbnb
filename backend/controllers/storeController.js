const Home = require("../models/home");
const User = require("../models/user");
const { buildSafeHome } = require("../utils/safeHome");

// Helper: base URL
const getBaseUrl = (req) =>
  process.env.NODE_ENV === "production"
    ? `${req.protocol}://${req.get("host")}`
    : process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`;

// ---------------- Get Paginated Homes ----------------
exports.getIndex = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const totalHomes = await Home.countDocuments();
    const homes = await Home.find().skip(skip).limit(limit);

    const homesWithPhotoUrl = homes.map((home) => buildSafeHome(home, req));

    res.json({
      homes: homesWithPhotoUrl,
      totalPages: Math.ceil(totalHomes / limit),
      currentPage: page,
      totalHomes,
    });
  } catch (err) {
    console.error("getIndex error:", err);
    res.status(500).json({ error: "Failed to fetch homes" });
  }
};

// ---------------- User Bookings ----------------
exports.getBookingsList = async (req, res) => {
  try {
    if (!req.session?.user)
      return res.status(401).json({ error: "User not authenticated" });

    const user = await User.findById(req.session.user._id).populate("bookings");
    if (!user) return res.status(404).json({ error: "User not found" });

    const bookings = (user.bookings || []).map((home) =>
      buildSafeHome(home, req)
    );
    res.json(bookings);
  } catch (err) {
    console.error("getBookingsList error:", err);
    res.status(500).json({ error: "Failed to fetch bookings list" });
  }
};

// ---------------- User Favourites ----------------
exports.getFavouriteList = async (req, res) => {
  try {
    if (!req.session?.user)
      return res.status(401).json({ error: "User not authenticated" });

    const user = await User.findById(req.session.user._id).populate(
      "favourites"
    );
    if (!user) return res.status(404).json({ error: "User not found" });

    const favourites = (user.favourites || []).map((home) =>
      buildSafeHome(home, req)
    );
    res.json(favourites);
  } catch (err) {
    console.error("getFavouriteList error:", err);
    res.status(500).json({ error: "Failed to fetch favourite list" });
  }
};

// ---------------- Add / Remove Booking ----------------
exports.postAddToBooking = async (req, res) => {
  try {
    if (!req.session?.user)
      return res.status(401).json({ error: "User not authenticated" });

    const { homeId } = req.body;
    const user = await User.findById(req.session.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.bookings.includes(homeId)) {
      user.bookings.push(homeId);
      await user.save();
    }

    res.json({ message: "Booked successfully" });
  } catch (err) {
    console.error("postAddToBooking error:", err);
    res.status(500).json({ error: "Failed to add to booking" });
  }
};

exports.postRemoveFromBooking = async (req, res) => {
  try {
    if (!req.session?.user)
      return res.status(401).json({ error: "User not authenticated" });

    const { homeId } = req.params;
    const user = await User.findById(req.session.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.bookings = user.bookings.filter((b) => b.toString() !== homeId);
    await user.save();

    res.json({ message: "Booking removed successfully" });
  } catch (err) {
    console.error("postRemoveFromBooking error:", err);
    res.status(500).json({ error: "Failed to remove from booking" });
  }
};

// ---------------- Add / Remove Favourite ----------------
exports.postAddToFavourite = async (req, res) => {
  try {
    if (!req.session?.user)
      return res.status(401).json({ error: "User not authenticated" });

    const { homeId } = req.body;
    const user = await User.findById(req.session.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.favourites.includes(homeId)) {
      user.favourites.push(homeId);
      await user.save();
    }

    res.json({ message: "Added to favourites" });
  } catch (err) {
    console.error("postAddToFavourite error:", err);
    res.status(500).json({ error: "Failed to add to favourite" });
  }
};

exports.postRemoveFromFavourite = async (req, res) => {
  try {
    if (!req.session?.user)
      return res.status(401).json({ error: "User not authenticated" });

    const { homeId } = req.params;
    const user = await User.findById(req.session.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.favourites = user.favourites.filter((f) => f.toString() !== homeId);
    await user.save();

    res.json({ message: "Favourite removed successfully" });
  } catch (err) {
    console.error("postRemoveFromFavourite error:", err);
    res.status(500).json({ error: "Failed to remove from favourite" });
  }
};

// ---------------- Home Details ----------------
exports.getHomeDetails = async (req, res) => {
  try {
    const home = await Home.findById(req.params.homeId);
    if (!home) return res.status(404).json({ error: "Home not found" });

    res.json(buildSafeHome(home, req));
  } catch (err) {
    console.error("getHomeDetails error:", err);
    res.status(500).json({ error: "Failed to fetch home details" });
  }
};

// ---------------- Rules PDF ----------------
exports.getHomeRules = (req, res, next) => {
  if (!req.session?.user)
    return res.status(401).json({ error: "User not authenticated" });
  next();
};

exports.downloadRules = async (req, res) => {
  try {
    const home = await Home.findById(req.params.homeId);
    if (!home) return res.status(404).json({ error: "Home not found" });

    if (home.houseRulePdf) {
      res.setHeader(
        "Content-Type",
        home.houseRulePdfMimeType || "application/pdf"
      );
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="HouseRule.pdf"'
      );
      return res.send(home.houseRulePdf);
    }

    res.status(404).json({ error: "No rules PDF found" });
  } catch (err) {
    console.error("downloadRules error:", err);
    res.status(500).json({ error: "Failed to fetch home rules" });
  }
};
