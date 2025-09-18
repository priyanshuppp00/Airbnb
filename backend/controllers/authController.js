const User = require("../models/user");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const { buildSafeUser } = require("../utils/safeUser");

// Helper: base URL
const getBaseUrl = (req) =>
  process.env.NODE_ENV === "production"
    ? `${req.protocol}://${req.get("host")}`
    : process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`;

// 🔹 Get current logged-in user
exports.getCurrentUser = async (req, res) => {
  try {
    if (req.session?.isLoggedIn && req.session.user) {
      const user = await User.findById(req.session.user._id);
      if (!user) return res.status(404).json({ error: "User not found" });

      const safeUser = buildSafeUser(user, req);
      return res.json({ user: safeUser });
    }
    return res.json({ user: null });
  } catch (err) {
    console.error("❌ getCurrentUser error:", err);
    return res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

// 🔹 Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    if (!req.session?.user?._id)
      return res.status(401).json({ error: "Not authenticated" });

    const user = await User.findById(req.session.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Update fields
    [
      "firstName",
      "middleName",
      "lastName",
      "email",
      "userType",
      "city",
    ].forEach((field) => {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    });

    // Update password
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 12);
    }

    // Update profile picture
    if (req.file) {
      if (user.profilePic) {
        const oldPath = path.join(__dirname, "../uploads", user.profilePic);
        fs.unlink(oldPath, (err) => {
          if (err) console.error("Error deleting old profile pic:", err);
        });
      }
      user.profilePic = req.file.filename;
    }

    await user.save();

    const safeUser = buildSafeUser(user, req);

    req.session.user = {
      _id: user._id.toString(),
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
      city: user.city,
    };

    req.session.save((err) => {
      if (err) return res.status(500).json({ error: "Session not saved" });
      return res
        .status(200)
        .json({ message: "Profile updated", user: safeUser });
    });
  } catch (err) {
    console.error("❌ updateUserProfile error:", err);
    return res
      .status(500)
      .json({ error: "Failed to update profile: " + err.message });
  }
};

// 🔹 Login
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(422).json({ errors: ["User does not exist"] });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(422).json({ errors: ["Invalid Password"] });

    const safeUser = buildSafeUser(user, req);

    req.session.regenerate((err) => {
      if (err)
        return res
          .status(500)
          .json({ errors: ["Login failed, session issue"] });

      req.session.isLoggedIn = true;
      req.session.user = {
        _id: user._id.toString(),
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        city: user.city,
      };

      req.session.save((err) => {
        if (err)
          return res
            .status(500)
            .json({ errors: ["Login failed, session not saved"] });

        return res
          .status(200)
          .json({ message: "Login successful", user: safeUser });
      });
    });
  } catch (err) {
    console.error("❌ postLogin error:", err);
    return res.status(500).json({ errors: ["Login failed: " + err.message] });
  }
};

// 🔹 Logout
exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res
        .status(500)
        .json({ errors: ["Logout failed: " + err.message] });
    return res.status(200).json({ message: "Logout successful" });
  });
};

// 🔹 Signup
exports.postSignup = async (req, res) => {
  try {
    console.log("Signup request body:", req.body);
    console.log("Signup request file:", req.file);

    const { firstName, middleName, lastName, email, password, userType, city } =
      req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email already registered:", email);
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      firstName,
      middleName,
      lastName,
      email,
      password: hashedPassword,
      userType,
      city,
    });

    if (req.file) {
      console.log("Profile pic uploaded:", req.file.filename);
      user.profilePic = req.file.filename;
    }

    await user.save();

    const safeUser = buildSafeUser(user, req);

    req.session.isLoggedIn = true;
    req.session.user = {
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
    };

    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res
          .status(500)
          .json({ error: "Signup successful, but session not saved" });
      }

      console.log("Signup successful for user:", email);
      return res
        .status(201)
        .json({ message: "Signup successful", user: safeUser });
    });
  } catch (err) {
    console.error("❌ postSignup error:", err);
    return res.status(500).json({ error: "Signup failed: " + err.message });
  }
};

// 🔹 Get profile picture (direct download)
exports.getProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.profilePic)
      return res.status(404).send("Profile picture not found");

    const filePath = path.join(__dirname, "../uploads", user.profilePic);
    res.sendFile(filePath);
  } catch (err) {
    console.error("❌ getProfilePic error:", err);
    res.status(500).send("Internal server error");
  }
};

// 🔹 Forget password / destroy session
exports.forgetpassword = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Session destroyed" });
  });
};
