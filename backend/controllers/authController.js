const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { buildSafeUser } = require("../utils/safeUser");

// 🔹 Get current logged-in user
exports.getCurrentUser = async (req, res, next) => {
  try {
    if (req.session?.isLoggedIn && req.session.user) {
      const user = await User.findById(req.session.user._id);
      if (!user) return res.status(404).json({ error: "User not found" });

      const safeUser = buildSafeUser(user);
      return res.json({ user: safeUser });
    } else {
      return res.json({ user: null });
    }
  } catch (err) {
    console.error("❌ getCurrentUser error:", err);
    return res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

// 🔹 Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    if (!req.session?.user?._id) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // update fields
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

    // password
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 12);
    }

    // profilePic upload
    if (req.file) {
      user.profilePic = req.file.buffer.toString("base64");
      user.profilePicMimeType = req.file.mimetype;
    }

    await user.save();

    const safeUser = buildSafeUser(user);

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
exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(422).json({ errors: ["User does not exist"] });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(422).json({ errors: ["Invalid Password"] });

    const safeUser = buildSafeUser(user);

    // Regenerate session for security
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
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err)
      return res
        .status(500)
        .json({ errors: ["Logout failed: " + err.message] });
    return res.status(200).json({ message: "Logout successful" });
  });
};

// 🔹 Signup
exports.postSignup = async (req, res, next) => {
  try {
    const { firstName, middleName, lastName, email, password, userType, city } =
      req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already registered" });

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
      user.profilePic = req.file.buffer.toString("base64");
      user.profilePicMimeType = req.file.mimetype;
    }

    await user.save();

    const safeUser = buildSafeUser(user);

    req.session.isLoggedIn = true;
    req.session.user = {
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
    };

    req.session.save((err) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Signup successful, but session not saved" });

      return res
        .status(201)
        .json({ message: "Signup successful", user: safeUser });
    });
  } catch (err) {
    console.error("❌ postSignup error:", err);
    return res.status(500).json({ error: "Signup failed: " + err.message });
  }
};

// 🔹 Get profile picture
exports.getProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.profilePic) {
      return res.status(404).send("Profile picture not found");
    }
    const buffer = Buffer.from(user.profilePic, "base64");
    res.set("Content-Type", user.profilePicMimeType);
    res.send(buffer);
  } catch (err) {
    console.error("❌ getProfilePic error:", err);
    res.status(500).send("Internal server error");
  }
};

// 🔹 Forget password / destroy session
exports.forgetpassword = (req, res, next) => {
  req.session.destroy(() => {
    res.json({ message: "Session destroyed" });
  });
};
