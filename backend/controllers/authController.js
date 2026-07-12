/**
 * @file authController.js
 * @description Authentication controller handling secure user registration and login workflows.
 * Integrates input validation, bcrypt password hashing, and JWT authorization token issuance.
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

/**
 * 1. Register a new user/admin account
 * @route   POST /api/auth/register
 * @access  Public (Internal HR Setup Scope)
 */
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validation Rule 1: Ensure all mandatory parameters are populated
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'All registration parameters (name, email, password, role) are required.'
            });
        }

        // Structural Update: Role whitelist validation array
        const allowedRoles = ["admin", "recruiter"];
        if (!allowedRoles.includes(role.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid system authorization role requested.'
            });
        }

        // Validation Rule 2: Enforce uniqueness constraint on email address
        const existingUser = await userModel.getUserByEmail(email.toLowerCase());
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Provided email parameter registration blocked. Identity already exists.'
            });
        }

        // Processing Step 1: Encrypt the plain-text password using bcrypt (Salt Rounds = 10)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Processing Step 2: Persist secure entity snapshot to the data layer
        const createdUser = await userModel.createUser(name, email.toLowerCase(), hashedPassword, role.toLowerCase());

        // Security Cleansing: Explicitly strip structural password fragments using a clean display object
        const userResponse = {
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            role: createdUser.role,
            created_at: createdUser.created_at
        };

        // Issue cleaner 201 Created Status Framework Response
        return res.status(201).json({
            success: true,
            message: 'User identity configured successfully within the pipeline.',
            user: userResponse
        });

    } catch (error) {
        console.error("Pipeline Exception caught within authController.register:", error);

        // Sanitize error payloads to ensure downstream database footprints don't expose system paths
        return res.status(500).json({
            success: false,
            message: 'Internal server initialization fault during identity persistence.'
        });
    }
};

/**
 * 2. Authenticate an existing user/admin
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation Rule 1: Ensure login credentials are supplied
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required fields.'
            });
        }

        // Validation Rule 2: Fetch corresponding user record by unique identifier
        const user = await userModel.getUserByEmail(email.toLowerCase());
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Interface access rejected. Check connectivity or credentials.'
            });
        }

        // Cryptographic Verification: Compare client input plaintext with backend stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Interface access rejected. Check connectivity or credentials.'
            });
        }

        // Security Cleansing: Safe duplication to keep sensitive database footprints out of client memory
        const sanitizedUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at
        };

        // Structural Update: Provide structural environment fallback for token handling if keys are unmapped
        const secretKey = process.env.JWT_SECRET || 'fallback_secret_key_6563';
        if (!process.env.JWT_SECRET) {
            console.warn("System Environment Warning: JWT_SECRET missing from environment. Using default network fallback.");
        }

        // Cryptographic Token Signing: Build JWT payload incorporating user configuration matrix
        const token = jwt.sign(
            { id: sanitizedUser.id, role: sanitizedUser.role },
            secretKey,
            { expiresIn: '7d' }
        );

        // Issue clean standard success container matching the React client spec
        return res.status(200).json({
            success: true,
            message: 'Login session verified successfully.',
            token,
            user: sanitizedUser
        });

    } catch (error) {
        console.error("Pipeline Exception caught within authController.login:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

// Export controller functions
module.exports = {
    register,
    login
};