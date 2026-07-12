/**
 * @file candidateRoutes.js
 * @description Routing management plane for Candidate resource tracking. 
 * Securely enforces JWT authentication barriers over all available CRUD operations.
 */

const express = require('express');
const router = express.Router();

// Controller Destructuring
const {
    createCandidate,
    getAllCandidates,
    getCandidateById,
    updateCandidate,
    updateCandidateStatus,
    deleteCandidate
} = require('../controllers/candidateController');

// Security Middleware Layer
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * Global Security Layer Integration
 * Explicitly chains the JWT evaluation interceptor to all downstream routing pathways.
 */
router.use(authenticateToken);

/**
 * @route   GET /api/candidates
 * @desc    Fetch a chronologically descending listing of all system candidates
 * @access  Protected (Admin / Recruiter)
 */
router.get('/', getAllCandidates);

/**
 * @route   GET /api/candidates/:id
 * @desc    Fetch a single candidate profile entity matching the provided ID parameter
 * @access  Protected (Admin / Recruiter)
 */
router.get('/:id', getCandidateById);

/**
 * @route   POST /api/candidates
 * @desc    Register a fresh applicant profile record within the tracking pipeline
 * @access  Protected (Admin / Recruiter)
 */
router.post('/', createCandidate);

/**
 * @route   PUT /api/candidates/:id
 * @desc    Perform a complete properties replacement mutation over an existing record
 * @access  Protected (Admin / Recruiter)
 */
router.put('/:id', updateCandidate);

/**
 * @route   PATCH /api/candidates/:id/status
 * @desc    Isolate mutation targeting only pipeline state tags ('Applied', 'Interview', etc.)
 * @access  Protected (Admin / Recruiter)
 */
router.patch('/:id/status', updateCandidateStatus);

/**
 * @route   DELETE /api/candidates/:id
 * @desc    Permanently expunge a candidate record from the active application registry
 * @access  Protected (Admin)
 */
router.delete('/:id', deleteCandidate);

// Export fully wired router instance using CommonJS specifications
module.exports = router;