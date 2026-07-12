/**
 * @file applicationRoutes.js
 * @description Routing management plane for Recruitment Applications. 
 * Securely enforces JWT authentication barriers over all available pipeline operations.
 */

const express = require('express');
const router = express.Router();

// Controller Destructuring
const {
    createApplication,
    getAllApplications,
    getApplicationById,
    updateApplicationStatus,
    deleteApplication
} = require('../controllers/applicationController');

// Security Middleware Layer
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * Global Security Layer Integration
 * Explicitly chains the JWT evaluation interceptor to all downstream routing pathways.
 */
router.use(authenticateToken);

/**
 * @route   GET /api/applications
 * @desc    Fetch a chronologically descending listing of all system applications
 * @access  Protected (Admin / Recruiter)
 */
router.get('/', getAllApplications);

/**
 * @route   GET /api/applications/:id
 * @desc    Fetch a single application mapping record matching the provided ID parameter
 * @access  Protected (Admin / Recruiter)
 */
router.get('/:id', getApplicationById);

/**
 * @route   POST /api/applications
 * @desc    Submit a candidate application profile linking to an active job opening
 * @access  Protected (Admin / Recruiter)
 */
router.post('/', createApplication);

/**
 * @route   PUT /api/applications/:id/status
 * @desc    Isolate mutation targeting pipeline state tags and evaluation summaries
 * @access  Protected (Admin / Recruiter)
 */
router.put('/:id/status', updateApplicationStatus);

/**
 * @route   DELETE /api/applications/:id
 * @desc    Permanently expunge an application record from the tracking system
 * @access  Protected (Admin)
 */
router.delete('/:id', deleteApplication);

// Export fully wired router instance using CommonJS specifications
module.exports = router;