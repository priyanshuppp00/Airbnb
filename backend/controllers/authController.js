const User = require("../models/user");
const bcrypt = require("bcryptjs");

// New method to get current logged-in user info
exports.getCurrentUser = async (req, res, next) => {
  try {
    if (req.session && req.session.isLoggedIn && req.session.user) {
      const userId = req.session.user._id;
      const user = await User.findById(userId).select("-password");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const userObj = user.toObject();
      if (user.profilePic) {
        userObj.profilePic = `data:${
          user.profilePicMimeType
        };base64,${user.profilePic.toString("base64")}`;
      }
      res.json({ user: userObj });
    } else {
      res.json({ user: null });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    if (!(req.session && req.session.isLoggedIn && req.session.user)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = req.session.user._id;
    const { firstName, middleName, lastName, email, userType, city, password } =
      req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update fields if provided
    if (firstName !== undefined) user.firstName = firstName;
    if (middleName !== undefined) user.middleName = middleName;
    if (lastName !== undefined) user.lastName = lastName;
    if (email !== undefined) user.email = email;
    if (userType !== undefined) user.userType = userType;
    if (city !== undefined) user.city = city;
    if (password) {
      user.password = await bcrypt.hash(password, 12);
    }
    if (req.file) {
      user.profilePic = req.file.buffer;
      user.profilePicMimeType = req.file.mimetype;
    }

    await user.save();

    // Update session user data
    req.session.user = user;
    await req.session.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile: " + err.message });
  }
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(422).json({ errors: ["User does not exist"] });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(422).json({ errors: ["Invalid Password"] });
    }

    // 🔹 Create safe user object for response
    const {
      password: _,
      profilePic,
      profilePicMimeType,
      ...userData
    } = user.toObject();

    if (profilePic) {
      userData.profilePic = `data:${profilePicMimeType};base64,${profilePic.toString(
        "base64"
      )}`;
    }

    // 🔹 Regenerate session (fresh session ID for security)
    req.session.regenerate((err) => {
      if (err) {
        console.error("❌ Session regenerate failed:", err);
        return res
          .status(500)
          .json({ errors: ["Login failed, session issue"] });
      }

      // Save only minimal safe data in session
      req.session.isLoggedIn = true;
      req.session.user = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        city: user.city,
      };

      req.session.save((err) => {
        if (err) {
          console.error("❌ Session save failed:", err);
          return res
            .status(500)
            .json({ errors: ["Login failed, session not saved"] });
        }

        return res.status(200).json({
          message: "Login successful",
          user: userData,
        });
      });
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ errors: ["Login failed: " + err.message] });
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ errors: ["Logout failed: " + err.message] });
    }
    return res.status(200).json({ message: "Logout successful" });
  });
};

exports.postSignup = async (req, res, next) => {
  try {
    console.log("Signup req.file:", req.file); // Debug log for file presence
    const { firstName, lastName, email, password } = req.body;
    // Basic validation
    if (!email || !password) {
      return res
        .status(422)
        .json({ errors: ["Email and password are required"] });
    }
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(422).json({ errors: ["User already exists"] });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    if (req.file) {
      user.profilePic = req.file.buffer;
      user.profilePicMimeType = req.file.mimetype;
    }
    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    res.status(500).json({ errors: ["Signup failed: " + err.message] });
  }
};

exports.forgetpassword = (req, res, next) => {
  req.session.destroy(() => {
    res.json({ message: "Session destroyed" });
  });
};
