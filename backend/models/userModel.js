/**
 * @file userModel.js
 * @description Data Access Layer (DAL) for User/Admin resources. Handles all 
 * raw parameterized PostgreSQL queries, data transformations, and pool client exceptions.
 */

// Import the configured PostgreSQL connection pool
const pool = require('../config/db');

/**
 * 1. Create a new user/admin record
 * @param {string} name - Full name of the user
 * @param {string} email - Unique email address
 * @param {string} password - Already hashed password string
 * @param {string} role - System access role (e.g., 'admin')
 * @returns {Promise<Object>} The newly created user row
 */
const createUser = async (name, email, password, role) => {
    const query = `
        INSERT INTO users (name, email, password, role, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING id, name, email, role, created_at, updated_at;
    `;
    // Enforce lowercased formatting across storage bounds to block casing collision variants
    const values = [name, email.toLowerCase(), password, role.toLowerCase()];

    try {
        const { rows } = await pool.query(query, values);
        return rows[0]; // Returns the singular created record object
    } catch (error) {
        console.error('Error caught in userModel.createUser sequence:', error.message);
        throw error; // Escalate error to controller layer
    }
};

/**
 * 2. Retrieve a user record by their unique email address
 * @param {string} email
 * @returns {Promise<Object|null>} The user row or null if not found
 */
const getUserByEmail = async (email) => {
    const query = `
        SELECT id, name, email, password, role, created_at, updated_at
        FROM users
        WHERE email = $1;
    `;
    
    try {
        const { rows } = await pool.query(query, [email.toLowerCase()]);
        return rows[0] || null; // Safely returns null if array is empty
    } catch (error) {
        console.error('Error caught in userModel.getUserByEmail sequence:', error.message);
        throw error;
    }
};

/**
 * 3. Retrieve a user record by its primary identity key
 * @param {number|string} id
 * @returns {Promise<Object|null>} The user row or null if not found
 */
const getUserById = async (id) => {
    const query = `
        SELECT id, name, email, role, created_at, updated_at
        FROM users
        WHERE id = $1;
    `;

    try {
        const { rows } = await pool.query(query, [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error caught in userModel.getUserById sequence:', error.message);
        throw error;
    }
};

/**
 * 4. Retrieve all user records in the system
 * @returns {Promise<Array>} Array of user record objects
 */
const getAllUsers = async () => {
    const query = `
        SELECT id, name, email, role, created_at, updated_at
        FROM users
        ORDER BY created_at DESC;
    `;

    try {
        const { rows } = await pool.query(query);
        return rows; // Returns an array (empty array if no rows found)
    } catch (error) {
        console.error('Error caught in userModel.getAllUsers sequence:', error.message);
        throw error;
    }
};

/**
 * 5. Update an existing user's details
 * @param {number|string} id - Target user ID
 * @param {string} name - Updated full name
 * @param {string} email - Updated unique email address
 * @param {string} role - Updated security role
 * @returns {Promise<Object|null>} The newly updated user row or null if it didn't exist
 */
const updateUser = async (id, name, email, role) => {
    const query = `
        UPDATE users
        SET name = $2, email = $3, role = $4, updated_at = NOW()
        WHERE id = $1
        RETURNING id, name, email, role, created_at, updated_at;
    `;
    const values = [id, name, email.toLowerCase(), role.toLowerCase()];

    try {
        const { rows } = await pool.query(query, values);
        return rows[0] || null;
    } catch (error) {
        console.error('Error caught in userModel.updateUser sequence:', error.message);
        throw error;
    }
};

/**
 * 6. Permanently delete a user record from the database
 * @param {number|string} id
 * @returns {Promise<boolean>} True if a row was found and removed, false otherwise
 */
const deleteUser = async (id) => {
    const query = `
        DELETE FROM users
        WHERE id = $1
        RETURNING id;
    `;

    try {
        const { rowCount } = await pool.query(query, [id]);
        return rowCount > 0; // Explicitly evaluates to true/false based on successful removal
    } catch (error) {
        console.error('Error caught in userModel.deleteUser sequence:', error.message);
        throw error;
    }
};

// Export model functions using CommonJS specification
module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser
};