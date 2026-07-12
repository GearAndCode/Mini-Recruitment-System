/**
 * @file db.js
 * @description Database configuration module.
 * Initializes the PostgreSQL connection pool
 * and verifies the database connection.
 */

// Load environment variables
require("dotenv").config();

const { Pool } = require("pg");

// Debug: Print connection settings (except password)
console.log("========== DATABASE CONFIG ==========");
console.log({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
});
console.log("=====================================");
console.log("DB_HOST =", process.env.DB_HOST);
console.log("DB_PORT =", process.env.DB_PORT);
console.log("DB_USER =", process.env.DB_USER);
console.log("DB_NAME =", `"${process.env.DB_NAME}"`);
// Create PostgreSQL connection pool
const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

// Test database connection
async function testConnection() {
    let client;

    try {
        client = await pool.connect();

        console.log("=====================================");
        console.log("✅ PostgreSQL Connected Successfully");
        console.log("=====================================");
    } catch (err) {
        console.log("=====================================");
        console.log("❌ Database Connection Failed");
        console.log("Reason:", err.message);
        console.log("=====================================");
    } finally {
        if (client) {
            client.release();
        }
    }
}

testConnection();

module.exports = pool;