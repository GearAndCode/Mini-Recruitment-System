/**
 * @file jobRoutes.js
 * @description Routing matrix for Job Posting entities. Securely channels 
 * workflow operations through the JWT access shield before reaching controllers.
 */

const express = require('express');
const router = express.Router();

// Controller Destructuring
const {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob
} = require('../controllers/jobController');

// Security Middleware Layer
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * Global Security Layer Integration
 * Explicitly forces token evaluation over all downstream endpoints inside this router block.
 */
router.use(authenticateToken);

/**
 * @route   GET /api/jobs
 * @desc    Fetch a chronologically descending listing of all job openings
 * @access  Protected (Admin / Recruiter)
 */
router.get('/', getAllJobs);

/**
 * @route   GET /api/jobs/:id
 * @desc    Fetch a single job posting entity matching the primary ID parameter
 * @access  Protected (Admin / Recruiter)
 */
router.get('/:id', getJobById);

/**
 * @route   POST /api/jobs
 * @desc    Publish a new job board opening position to the registry
 * @access  Protected (Admin / Recruiter)
 */
router.post('/', createJob);

/**
 * @route   PUT /api/jobs/:id
 * @desc    Perform a complete properties replacement mutation over an existing job record
 * @access  Protected (Admin / Recruiter)
 */
router.put('/:id', updateJob);

/**
 * @route   DELETE /api/jobs/:id
 * @desc    Permanently expunge a job opening record from the tracking system
 * @access  Protected (Admin)
 */
router.delete('/:id', deleteJob);

// Export fully wired router instance using CommonJS specifications
module.exports = router;