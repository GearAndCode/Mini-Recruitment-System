/**
 * @file applicationModel.js
 * @description Data Access Layer (DAL) for Recruitment Applications. Bridges the relationship
 * between Candidates and Jobs, managing application workflows and joining operational details.
 */

// Import the configured PostgreSQL connection pool
const pool = require('../config/db');

/**
 * 1. Create a new recruitment application profile
 * @param {number|string} candidate_id - Target candidate record identifier
 * @param {number|string} job_id - Target job position record identifier
 * @param {string} [notes] - Optional initial evaluation notes or comments
 * @returns {Promise<Object>} The newly created application row record
 */
const createApplication = async (candidate_id, job_id, notes) => {
    const query = `
        INSERT INTO applications (candidate_id, job_id, status, notes, applied_at, updated_at)
        VALUES ($1, $2, 'Applied', $3, NOW(), NOW())
        RETURNING *;
    `;
    const values = [candidate_id, job_id, notes || null];

    try {
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (error) {
        console.error('Error in applicationModel.createApplication:', error.message);
        throw error;
    }
};

/**
 * 2. Retrieve all system applications linked with relational profiles
 * @returns {Promise<Array>} Chronologically sorted collection array of joined application data rows
 */
const getAllApplications = async () => {
    const query = `
  SELECT
a.id,
a.candidate_id,
c.full_name AS candidate_name,
c.email,
c.phone,
c.position,
a.job_id,
    j.title AS job_title,
    a.status,
    a.notes,
    a.applied_at,
    a.updated_at
FROM applications a
JOIN candidates c
ON a.candidate_id = c.id
JOIN jobs j
ON a.job_id = j.id
ORDER BY a.applied_at DESC;
    `;

    try {
        const { rows } = await pool.query(query);
        return rows;
    } catch (error) {
        console.error('Error in applicationModel.getAllApplications:', error.message);
        throw error;
    }
};

/**
 * 3. Retrieve a single joined application record details map by ID
 * @param {number|string} id - The unique application ID
 * @returns {Promise<Object|null>} The application row object or null if not found
 */
const getApplicationById = async (id) => {
    const query = `
   SELECT
a.id,
a.candidate_id,
c.full_name AS candidate_name,
c.email,
c.phone,
c.position,
a.job_id,
    j.title AS job_title,
    a.status,
    a.notes,
    a.applied_at,
    a.updated_at
FROM applications a
JOIN candidates c
ON a.candidate_id = c.id
JOIN jobs j
ON a.job_id = j.id
WHERE a.id=$1;
    `;

    try {
        const { rows } = await pool.query(query, [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error in applicationModel.getApplicationById:', error.message);
        throw error;
    }
};

/**
 * 4. Update the pipeline lifecycle status and administrative notes for an application
 * @param {number|string} id - Target application ID
 * @param {string} status - New workflow state ('Applied', 'Interview', 'Selected', 'Rejected')
 * @param {string} notes - Updated evaluation summaries or log entries
 * @returns {Promise<Object|null>} The updated row record or null if target was missing
 */
const updateApplicationStatus = async (id, status, notes) => {
    const query = `
        UPDATE applications
        SET status = $2, notes = $3, updated_at = NOW()
        WHERE id = $1
        RETURNING *;
    `;
    const values = [id, status, notes];

    try {
        const { rows } = await pool.query(query, values);
        return rows[0] || null;
    } catch (error) {
        console.error('Error in applicationModel.updateApplicationStatus:', error.message);
        throw error;
    }
};

/**
 * 5. Permanently drop an application entry from the active processing registry
 * @param {number|string} id - Target application ID
 * @returns {Promise<boolean>} True if found and dropped, false if target was absent
 */
const deleteApplication = async (id) => {
    const query = `
        DELETE FROM applications
        WHERE id = $1
        RETURNING id;
    `;

    try {
        const { rowCount } = await pool.query(query, [id]);
        return rowCount > 0;
    } catch (error) {
        console.error('Error in applicationModel.deleteApplication:', error.message);
        throw error;
    }
};

// Export operations using CommonJS specifications
module.exports = {
    createApplication,
    getAllApplications,
    getApplicationById,
    updateApplicationStatus,
    deleteApplication
};