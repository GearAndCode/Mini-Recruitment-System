/**
 * @file dashboardRoutes.js
 * @description Express router defining API endpoints for the recruitment dashboard metrics, feeds, and telemetry.
 * @module routes/dashboardRoutes
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Ensure that proper authentication/authorization middleware (e.g., protect, restrictTo) 
// is mounted either here or in the root application stack to secure these endpoints.

/**
 * @route   GET /api/dashboard/stats
 * @desc    Retrieve aggregate counts for key metrics (Total Candidates, Open Jobs, Applications, Scheduled Interviews)
 * @access  Private
 */
router.get('/stats', dashboardController.getDashboardStats);
/**
 * @route   GET /api/dashboard/recent-candidates
 * @desc    Fetch a streamlined feed of the newest candidate profile entries
 * @access  Private
 */
router.get('/recent-candidates', dashboardController.getRecentCandidates);

/**
 * @route   GET /api/dashboard/recent-jobs
 * @desc    Fetch a streamlined feed of the latest active corporate job listings
 * @access  Private
 */
router.get('/recent-jobs', dashboardController.getRecentJobs);

/**
 * @route   GET /api/dashboard/pipeline
 * @desc    Get consolidated processing metrics split by active workflow structural stages
 * @access  Private
 */
router.get('/pipeline', dashboardController.getPipelineData);
/**
 * @route   GET /api/dashboard/notifications
 * @desc    Load recent real-time operational notifications and platform system logs
 * @access  Private
 */
router.get('/notifications', dashboardController.getNotifications);

module.exports = router;