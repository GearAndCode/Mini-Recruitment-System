/**
 * @file jobModel.js
 * @description Data Access Layer (DAL) for Job resources. Handles all 
 * raw parameterized PostgreSQL queries, job lifecycle statuses, and database anomalies.
 */

// Import the configured PostgreSQL connection pool
const pool = require('../config/db');

/**
 * 1. Create a new job posting record
 * @param {string} title - The title of the job opening
 * @param {string} department - The department (e.g., Engineering, HR)
 * @param {string} location - Job location (e.g., Remote, New York)
 * @param {string} description - Detailed job requirements and description
 * @param {number|string} salary - Salary range or compensation details
 * @returns {Promise<Object>} The newly created job row record
 */
const createJob = async (title, department, location, description, salary) => {
    const query = `
        INSERT INTO jobs (title, department, location, description, salary, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, 'Open', NOW(), NOW())
        RETURNING *;
    `;
    const values = [title, department, location, description, salary];

    try {
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (error) {
        console.error('Error in jobModel.createJob:', error.message);
        throw error;
    }
};

/**
 * 2. Retrieve all job postings in the system
 * @returns {Promise<Array>} Collection array of job posting rows sorted by creation date
 */
const getAllJobs = async () => {
    const query = `
        SELECT id, title, department, location, description, salary, status, created_at, updated_at
        FROM jobs
        ORDER BY created_at DESC;
    `;

    try {
        const { rows } = await pool.query(query);
        return rows;
    } catch (error) {
        console.error('Error in jobModel.getAllJobs:', error.message);
        throw error;
    }
};

/**
 * 3. Retrieve a single job posting by its primary identity key
 * @param {number|string} id - The unique job ID
 * @returns {Promise<Object|null>} The job row object or null if not found
 */
const getJobById = async (id) => {
    const query = `
        SELECT id, title, department, location, description, salary, status, created_at, updated_at
        FROM jobs
        WHERE id = $1;
    `;

    try {
        const { rows } = await pool.query(query, [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error in jobModel.getJobById:', error.message);
        throw error;
    }
};

/**
 * 4. Update every editable field of an existing job posting record
 * @param {number|string} id - Target job ID
 * @param {string} title - Updated job title
 * @param {string} department - Updated department name
 * @param {string} location - Updated location
 * @param {string} description - Updated description text
 * @param {number|string} salary - Updated salary definition
 * @param {string} status - Updated workflow status (e.g., 'Open', 'Closed')
 * @returns {Promise<Object|null>} The updated row record snapshot or null if job missing
 */
const updateJob = async (id, title, department, location, description, salary, status) => {
    const query = `
        UPDATE jobs
        SET title = $2, department = $3, location = $4, description = $5, salary = $6, status = $7, updated_at = NOW()
        WHERE id = $1
        RETURNING *;
    `;
    const values = [id, title, department, location, description, salary, status];

    try {
        const { rows } = await pool.query(query, values);
        return rows[0] || null;
    } catch (error) {
        console.error('Error in jobModel.updateJob:', error.message);
        throw error;
    }
};

/**
 * 5. Permanently remove a job posting from the registry
 * @param {number|string} id - Target job ID
 * @returns {Promise<boolean>} True if found and dropped, false if target was missing
 */
const deleteJob = async (id) => {
    const query = `
        DELETE FROM jobs
        WHERE id = $1
        RETURNING id;
    `;

    try {
        const { rowCount } = await pool.query(query, [id]);
        return rowCount > 0;
    } catch (error) {
        console.error('Error in jobModel.deleteJob:', error.message);
        throw error;
    }
};

// Export operations using CommonJS specifications
module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob
};