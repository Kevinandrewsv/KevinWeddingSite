const express = require("express");
const cors = require("cors");

const eventRoutes = require("./Routes/eventRoutes");
const guestResponseRoutes = require("./Routes/guestResponseRoutes");
const wishRoutes = require("./Routes/wishRoutes");
const galleryRoutes = require("./Routes/galleryRoutes");
const uploadRoutes = require("./Routes/uploadRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const chatbotRoutes = require("./Routes/chatbotRoutes");
const circleOfLoveRoutes = require("./Routes/circleOfLoveRoutes");
const pollRoutes = require("./Routes/pollRoutes");

const { notFound, errorHandler } = require("./Middleware/errorMiddleware");

const app = express();

const envAllowedOrigins = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(",").map((url) => url.trim()).filter(Boolean)
  : [];

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  process.env.CLIENT_URL,
  ...envAllowedOrigins,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error("CORS blocked origin:", origin);
    console.error("Allowed origins:", allowedOrigins);

    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Wedding Invitation Backend API is running...",
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    storage: "Cloudflare R2",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/guest-responses", guestResponseRoutes);
app.use("/api/wishes", wishRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/circle-of-love", circleOfLoveRoutes);
app.use("/api/polls", pollRoutes);

// Error middlewares should always be at the bottom
app.use(notFound);
app.use(errorHandler);

module.exports = app;