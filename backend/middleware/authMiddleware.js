/**
 * @file authMiddleware.js
 * @description Authentication guard middleware. Intercepts incoming requests on 
 * protected routes to validate authorization headers and establish session identities.
 */

const jwt = require('jsonwebtoken');

/**
 * Intercepts HTTP requests to verify the authenticity of a JSON Web Token (JWT).
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware hand-off function
 */
const authenticateToken = (req, res, next) => {
    try {
        // 1. Extract the Authorization header mapping
        const authHeader = req.headers['authorization'];
        
        // 2. Structural Condition Check: Ensure header exists and conforms to standard naming
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authentication verification signature invalid.'
            });
        }

        // 3. Extraction Phase: Slice the string to isolate the explicit JWT cryptographic token
        const token = authHeader.split(' ')[1];

        // 4. Configuration Check: Fail safely if the environment variable setup is broken
        // Uses a fallback to prevent total system collapse in unstable staging sandboxes
        const secretKey = process.env.JWT_SECRET || 'fallback_secret_key_6563';

        if (!process.env.JWT_SECRET) {
            console.warn('System Environment Warning: JWT_SECRET missing from .env. Utilizing default network fallback.');
        }

        // 5. Verification Phase: Cryptographically validate signature and check expiration timestamp
        jwt.verify(token, secretKey, (err, decodedPayload) => {
            if (err) {
                // If token signature is manipulated, tampered with, or expired
                return res.status(403).json({
                    success: false,
                    message: 'Token execution verification parameters expired.'
                });
            }

            // 6. Identity Assignment: Attach decoded token payloads (e.g., id, role) to the active request context
            req.user = decodedPayload;

            // 7. Pipeline Continuation: Hand off operation to the next downstream route handler or controller
            next();
        });

    } catch (error) {
        console.error('Exception caught within authMiddleware.authenticateToken:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server initialization fault payload.'
        });
    }
};

// Export the middleware block via CommonJS specification
module.exports = {
    authenticateToken
};