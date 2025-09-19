// app.js
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

// Local Modules
const connectDB = require("./config/db");
const rootDir = require("./utils/pathUtil");
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
const errorsController = require("./controllers/errors");
const errorHandler = require("./middleware/errorHandler");

const PORT = process.env.PORT || 3000;

const app = express();

// Temporary logging for diagnosis
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("SESSION_SECRET exists:", !!process.env.SESSION_SECRET);

// trust proxy when behind a load balancer (Render, Vercel etc.)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Basic security headers but allow cross-origin resources (images)
app.use(
  helmet({
    // make sure COEP / CORP don't block images; we set Cross-Origin-Resource-Policy later for uploads
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Rate limiter (optional)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, try later.",
  })
);

// CORS: allow exactly the frontend origin(s)
const FRONTENDS = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests from tools (postman/curl) with no origin
      if (!origin) return callback(null, true);
      if (FRONTENDS.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Temporary middleware to log proxy headers
app.use((req, res, next) => {
  console.log("x-forwarded-proto:", req.headers["x-forwarded-proto"]);
  console.log("x-forwarded-for:", req.headers["x-forwarded-for"]);
  next();
});

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve public + uploads with correct headers for cross-origin images
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders(res, filePath) {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      // don't set Access-Control-Allow-Origin '*' when credentials are required.
      // We rely on the global CORS middleware to send the correct header.
    },
  })
);

// Sessions (production-safe)
app.use(
  session({
    name: process.env.SESSION_NAME || "sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true on HTTPS
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

connectDB();

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
