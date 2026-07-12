/**
 * @file authRoutes.js
 * @description Authentication routing matrix. Maps incoming identity and access
 * HTTP POST payloads directly to corresponding business rule controller endpoints.
 */

// 1. Core Framework Imports
const express = require('express');

// 2. Initialize the isolated Express Router engine
const router = express.Router();

// 3. Controller Handshake Imports
// Destructure explicitly needed endpoint controllers to ensure strong module linkage
const { register, login } = require('../controllers/authController');

/**
 * 4. Main Authentication Routing Pipeline Definitions
 */

/**
 * @route   POST /api/auth/register
 * @desc    Submit registration payload to provision a new admin/recruiter entity
 * @access  Public (Scoped for Internal Setup Configuration)
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Submit administrative credentials to claim an encrypted JWT session token
 * @access  Public
 */
router.post('/login', login);

// 5. Export the configured router assembly for integration within app.js via CommonJS
module.exports = router;