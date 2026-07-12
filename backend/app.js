const applicationRoutes = require('./routes/applicationRoutes');
const jobRoutes = require('./routes/jobRoutes');

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

// Import newly integrated sub-routing matrices
const authRoutes = require('./routes/authRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const dashboardRoutes = require("./routes/dashboardRoutes");

// ===============================
// 2. Database Connection
// ===============================
// This automatically connects to PostgreSQL when the app starts.
require("./config/db");

// ===============================
// 3. Initialize Express App
// ===============================
const app = express();

// ===============================
// 4. Global Middleware
// ===============================

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// ===============================
// 5. Health Check Route
// ===============================

/**
 * @route   GET /
 * @desc    API Health Check
 * @access  Public
 */
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Mini Recruitment Workflow System API is running."
    });
});

// ===============================
// 5.5 Active Module Routing Matrix
// ===============================
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/jobs', jobRoutes);
console.log("Applications route loaded");
app.use('/api/applications', applicationRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ===============================
// 6. 404 Route Handler
// ===============================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found."
    });
});

// ===============================
// 7. Export Express App
// ===============================

module.exports = app;