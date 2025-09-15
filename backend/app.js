// app.js
const express = require("express");
const session = require("express-session");
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

// Logging middleware for debugging
const morgan = require("morgan");

// Use morgan for logging HTTP requests
app.use(morgan("dev"));

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "http://localhost:5173", // local frontend
      "https://airbnb-henna-eight.vercel.app", // prod frontend
    ];

    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some((allowed) => {
      return origin.replace(/\/$/, "") === allowed.replace(/\/$/, "");
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true, // ✅ allow cookies
};

app.use(cors(corsOptions));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ HTTPS only in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // ✅ 'none' for cross-site cookies
      domain:
        process.env.NODE_ENV === "production" ? ".onrender.com" : undefined, // ✅ only set in prod if needed
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(rootDir, "public")));

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
