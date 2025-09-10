const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    currentPage: "login",
    isLoggedIn: false,
    errors: [],
    oldInput: { email: "" },
    user: {},
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    currentPage: "signup",
    isLoggedIn: false,
    errors: [],
    oldInput: { firstName: "", lastName: "", email: "", userType: "" },
    user: {},
  });
};

// New method to get current logged-in user info
exports.getCurrentUser = async (req, res, next) => {
  try {
    if (req.session && req.session.isLoggedIn && req.session.user) {
      const userId = req.session.user._id;
      const user = await User.findById(userId).select("-password");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ user });
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
      user.profilePic = req.file.path;
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
      if (req.xhr || req.headers.accept.indexOf("json") > -1) {
        return res.status(422).json({ errors: ["User does not exist"] });
      } else {
        return res.status(422).render("auth/login", {
          pageTitle: "Login",
          currentPage: "login",
          isLoggedIn: false,
          errors: ["User does not exist"],
          oldInput: { email },
          user: {},
        });
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      if (req.xhr || req.headers.accept.indexOf("json") > -1) {
        return res.status(422).json({ errors: ["Invalid Password"] });
      } else {
        return res.status(422).render("auth/login", {
          pageTitle: "Login",
          currentPage: "login",
          isLoggedIn: false,
          errors: ["Invalid Password"],
          oldInput: { email },
          user: {},
        });
      }
    }

    req.session.isLoggedIn = true;
    req.session.user = user;
    await req.session.save();

    if (req.xhr || req.headers.accept.indexOf("json") > -1) {
      const { password, ...userWithoutPassword } = user.toObject();
      return res
        .status(200)
        .json({ message: "Login successful", user: userWithoutPassword });
    } else {
      return res.redirect("/");
    }
  } catch (err) {
    if (req.xhr || req.headers.accept.indexOf("json") > -1) {
      return res.status(500).json({ errors: ["Login failed: " + err.message] });
    } else {
      return res.status(500).render("auth/login", {
        pageTitle: "Login",
        currentPage: "login",
        isLoggedIn: false,
        errors: ["Login failed: " + err.message],
        oldInput: { email: req.body.email },
        user: {},
      });
    }
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      if (req.xhr || req.headers.accept.indexOf("json") > -1) {
        return res
          .status(500)
          .json({ errors: ["Logout failed: " + err.message] });
      } else {
        return next(err);
      }
    }
    if (req.xhr || req.headers.accept.indexOf("json") > -1) {
      return res.status(200).json({ message: "Logout successful" });
    } else {
      return res.redirect("/");
    }
  });
};

exports.postSignup = async (req, res, next) => {
  try {
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
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ errors: ["Signup failed: " + err.message] });
  }
};

exports.forgetpassword = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
