/**
 * @file candidateModel.js
 * @description Data Access Layer (DAL) for Candidate resources. Handles all 
 * raw parameterized PostgreSQL queries, lifecycle statuses, and database anomalies.
 */

// Import the configured PostgreSQL connection pool
const pool = require('../config/db');

/**
 * 1. Create a new candidate profile record
 * @param {string} full_name - Full name of the applicant
 * @param {string} email - Unique email address of the applicant
 * @param {string} phone - Contact phone number
 * @param {string} position_applied - Target position title
 * @param {number} experience - Total years of professional experience
 * @param {string} resume_link - URL string referencing the candidate's resume asset
 * @returns {Promise<Object>} The newly created candidate row record
 */
const createCandidate = async (full_name, email, phone, position_applied, experience, resume_link) => {
    const query = `
        INSERT INTO candidates (full_name, email, phone, position_applied, experience, resume_link, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, 'Applied', NOW(), NOW())
        RETURNING *;
    `;
    const values = [full_name, email, phone, position_applied, experience, resume_link];

    try {
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (error) {
        console.error('Error in candidateModel.createCandidate:', error.message);
        throw error;
    }
};

/**
 * 2. Retrieve all candidate records in the system
 * @returns {Promise<Array>} Sorted collection array of applicant data rows
 */
const getAllCandidates = async () => {
    const query = `
        SELECT id, full_name, email, phone, position_applied, experience, resume_link, status, created_at, updated_at
        FROM candidates
        ORDER BY created_at DESC;
    `;

    try {
        const { rows } = await pool.query(query);
        return rows;
    } catch (error) {
        console.error('Error in candidateModel.getAllCandidates:', error.message);
        throw error;
    }
};

/**
 * 3. Retrieve a single candidate record by its primary identity key
 * @param {number|string} id - The unique candidate ID
 * @returns {Promise<Object|null>} The candidate row object or null if not found
 */
const getCandidateById = async (id) => {
    const query = `
        SELECT id, full_name, email, phone, position_applied, experience, resume_link, status, created_at, updated_at
        FROM candidates
        WHERE id = $1;
    `;

    try {
        const { rows } = await pool.query(query, [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error in candidateModel.getCandidateById:', error.message);
        throw error;
    }
};

/**
 * 4. Update the workflow tracking status of a specific candidate
 * @param {number|string} id - Target candidate ID
 * @param {string} status - New workflow state ('Applied', 'Interview', 'Selected', 'Rejected')
 * @returns {Promise<Object|null>} The updated row record or null if target absent
 */
const updateCandidateStatus = async (id, status) => {
    const query = `
        UPDATE candidates
        SET status = $2, updated_at = NOW()
        WHERE id = $1
        RETURNING *;
    `;
    const values = [id, status];

    try {
        const { rows } = await pool.query(query, values);
        return rows[0] || null;
    } catch (error) {
        console.error('Error in candidateModel.updateCandidateStatus:', error.message);
        throw error;
    }
};

/**
 * 5. Update every editable field parameter of an existing candidate record
 * @param {number|string} id - Target candidate ID
 * @param {string} full_name - Updated candidate full name
 * @param {string} email - Updated unique email address
 * @param {string} phone - Updated phone string
 * @param {string} position_applied - Updated job role assignment title
 * @param {number} experience - Updated years metric integer
 * @param {string} resume_link - Updated document storage link
 * @param {string} status - Updated application workflow status
 * @returns {Promise<Object|null>} The updated row record snapshot or null if action missed
 */
const updateCandidate = async (id, full_name, email, phone, position_applied, experience, resume_link, status) => {
    const query = `
        UPDATE candidates
        SET full_name = $2, email = $3, phone = $4, position_applied = $5, experience = $6, resume_link = $7, status = $8, updated_at = NOW()
        WHERE id = $1
        RETURNING *;
    `;
    const values = [id, full_name, email, phone, position_applied, experience, resume_link, status];

    try {
        const { rows } = await pool.query(query, values);
        return rows[0] || null;
    } catch (error) {
        console.error('Error in candidateModel.updateCandidate:', error.message);
        throw error;
    }
};

/**
 * 6. Permanently drop a candidate record from the active application registry
 * @param {number|string} id - Target candidate ID
 * @returns {Promise<boolean>} True if found and dropped, false if target was missing
 */
const deleteCandidate = async (id) => {
    const query = `
        DELETE FROM candidates
        WHERE id = $1
        RETURNING id;
    `;

    try {
        const { rowCount } = await pool.query(query, [id]);
        return rowCount > 0;
    } catch (error) {
        console.error('Error in candidateModel.deleteCandidate:', error.message);
        throw error;
    }
};

// Export operations using CommonJS specifications
module.exports = {
    createCandidate,
    getAllCandidates,
    getCandidateById,
    updateCandidateStatus,
    updateCandidate,
    deleteCandidate
};