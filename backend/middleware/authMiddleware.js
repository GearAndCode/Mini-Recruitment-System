/**
 * @file authMiddleware.js
 * @description Authentication guard middleware. Intercepts incoming requests on
 * protected routes to validate authorization headers and establish session identities.
 */

const jwt = require('jsonwebtoken');

/**
 * Verify JWT token before allowing access to protected routes.
 */
const authenticateToken = (req, res, next) => {
    try {
        // Get Authorization header
        const authHeader = req.headers.authorization;

        // Check if Authorization header exists
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authentication verification signature invalid.'
            });
        }

        // Extract JWT token
        const token = authHeader.split(' ')[1];

        // JWT Secret
        const secretKey = process.env.JWT_SECRET || 'fallback_secret_key_6563';

        // Debug logs
        console.log("========== JWT DEBUG ==========");
        console.log("JWT_SECRET:", secretKey);
        console.log("TOKEN:", token);

        // Verify token
        jwt.verify(token, secretKey, (err, decodedPayload) => {
            if (err) {
                console.log("VERIFY ERROR:", err.message);

                return res.status(403).json({
                    success: false,
                    message: err.message
                });
            }

            console.log("TOKEN VERIFIED");
            console.log(decodedPayload);
            console.log("==============================");

            // Attach decoded user to request
            req.user = decodedPayload;

            next();
        });

    } catch (error) {
        console.error("Authentication Middleware Error:", error);

        return res.status(500).json({
            success: false,
            message: 'Internal server initialization fault payload.'
        });
    }
};

module.exports = {
    authenticateToken
};