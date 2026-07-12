/**
 * @file server.js
 * @description Entry point for the Mini Recruitment Workflow System API.
 * Configures the network server environment and handles startup execution.
 */

// 1. Load environment variables as early as possible in the application lifecycle
const dotenv = require('dotenv');
dotenv.config();

// 2. Import the configured Express application instance
// Note: This expects an app.js file to exist in the same directory level
const app = require('./app');

// 3. Determine the runtime port from environment variables, defaulting to 5000 if undefined
const PORT = process.env.PORT || 5000;

/**
 * 4. Start the HTTP server to listen for incoming client requests
 */
const server = app.listen(PORT, () => {
    console.log('==========================================');
    console.log('🚀 Mini Recruitment Workflow System API');
    console.log(`   Server running on port ${PORT}`);
    console.log('==========================================');
});

/**
 * 5. Handle unhandled promise rejections gracefully (Production Safety Net)
 * Example: Database connection failures that aren't caught explicitly elsewhere.
 */
process.on('unhandledRejection', (err) => {
    console.error(`🔴 Unhandled Rejection Error: ${err.message}`);
    // Gracefully shut down the server, allowing existing connections to wrap up
    server.close(() => {
        process.exit(1);
    });
});