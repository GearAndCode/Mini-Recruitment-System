/**
 * @file dashboardController.js
 * @description Controller implementation for handling Express routes related to Dashboard analytics, stats, and feeds.
 */

const dashboardModel = require('../models/dashboardModel');

/**
 * @desc    Get aggregate statistics for the dashboard cards
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
const getDashboardStats = async (req, res) => {
  try {
    const stats = await dashboardModel.getStats();
    
    return res.status(200).json({
      success: true,
      data: stats || { candidates: 0, jobs: 0, applications: 0, interviews: 0 }
    });
  } catch (error) {
    console.error('Error in getDashboardStats controller:', error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};

/**
 * @desc    Get a list of recent candidates
 * @route   GET /api/dashboard/recent-candidates
 * @access  Private
 */
const getRecentCandidates = async (req, res) => {
  try {
    const candidates = await dashboardModel.getRecentCandidates();
    
    return res.status(200).json({
      success: true,
      data: candidates || []
    });
  } catch (error) {
    console.error('Error in getRecentCandidates controller:', error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};

/**
 * @desc    Get a list of recent job postings
 * @route   GET /api/dashboard/recent-jobs
 * @access  Private
 */
const getRecentJobs = async (req, res) => {
  try {
    const jobs = await dashboardModel.getRecentJobs();
    
    return res.status(200).json({
      success: true,
      data: jobs || []
    });
  } catch (error) {
    console.error('Error in getRecentJobs controller:', error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};

/**
 * @desc    Get metrics for active recruitment pipeline stages
 * @route   GET /api/dashboard/pipeline
 * @access  Private
 */
const getPipelineData = async (req, res) => {
  try {
    const pipelineData = await dashboardModel.getPipelineData();
    
    return res.status(200).json({
      success: true,
      data: pipelineData || { applied: 0, screening: 0, technical: 0, interview: 0, selected: 0 }
    });
  } catch (error) {
    console.error('Error in getPipelineData controller:', error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};

/**
 * @desc    Get recent notifications/system logs
 * @route   GET /api/dashboard/notifications
 * @access  Private
 */
const getNotifications = async (req, res) => {
  try {
    const notifications = await dashboardModel.getNotifications();
    
    return res.status(200).json({
      success: true,
      data: notifications || []
    });
  } catch (error) {
    console.error('Error in getNotifications controller:', error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};

module.exports = {
  getDashboardStats,
  getRecentCandidates,
  getRecentJobs,
  getPipelineData,
  getNotifications
};