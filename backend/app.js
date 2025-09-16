// app.js
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Load env vars
dotenv.config();

// Local Modules
const connectDB = require("./config/db");
const rootDir = require("./utils/pathUtil");
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
const errorsController = require("./controllers/errors");
const errorHandler = require("./middleware/errorHandler");
const sessionStore = require("./config/sessionStore");

const PORT = process.env.PORT || 3000;
const cors = require("cors");

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // e.g. https://airbnb.vercel.app
    credentials: true,
  })
);

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ true on deploy, false in dev
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use((req, res, next) => {
  console.log("Cookies:", req.headers.cookie);
  console.log("Session ID:", req.sessionID);
  console.log("Session Data:", req.session);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(rootDir, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/store", storeRouter);
app.use("/api/host", hostRouter);
app.use("/api/auth", authRouter);

// 404 error handler
app.use(errorsController.pageNotFound);

// Centralized error handler middleware
app.use(errorHandler);

// Server Start
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
