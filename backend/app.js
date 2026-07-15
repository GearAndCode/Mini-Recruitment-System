/**
 * @file app.js
 * @description Core Express application configuration.
 * Sets up middleware, database connection, health-checks,
 * and fallback route handling.
 */

// ===============================
// 1. Dependency Imports
// ===============================
const express = require("express");
const cors = require("cors");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const jobRoutes = require("./routes/jobRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

console.log("✅ authRoutes loaded");

// ===============================
// 2. Database Connection
// ===============================
require("./config/db");

// ===============================
// 3. Initialize Express App
// ===============================
const app = express();

// ===============================
// 4. Global Middleware
// ===============================

// Enable CORS
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests
app.options(/.*/, cors());

// Parse JSON
app.use(express.json());

// Parse URL Encoded
app.use(express.urlencoded({ extended: true }));

// ===============================
// 5. Health Check
// ===============================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Mini Recruitment Workflow System API is running.",
  });
});

// ===============================
// 6. API Routes
// ===============================
console.log("✅ Mounting /api/auth");

app.use("/api/auth", authRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/jobs", jobRoutes);

console.log("Applications route loaded");

app.use("/api/applications", applicationRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ===============================
// 7. 404 Handler
// ===============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// ===============================
// 8. Export App
// ===============================
module.exports = app;