/**
 * @file dashboardModel.js
 * @description Data Access Object (DAO) layer for processing PostgreSQL database metrics for the Dashboard view.
 */

const pool = require("../config/db");

/**
 * @desc    Fetch aggregate counts for fundamental platform metrics
 * @returns {Promise<Object>} Object containing totals for candidates, jobs, applications, and scheduled interviews
 */
const getStats = async () => {
  const queries = {
    candidates: "SELECT COUNT(*)::int FROM candidates",
    jobs: "SELECT COUNT(*)::int FROM jobs",
    applications: "SELECT COUNT(*)::int FROM applications",
    interviews: "SELECT COUNT(*)::int FROM applications WHERE status = 'Interview'"
  };

  // Run database counters concurrently to maintain snappy performance
  const [candidatesRes, jobsRes, appsRes, interviewsRes] = await Promise.all([
    pool.query(queries.candidates),
    pool.query(queries.jobs),
    pool.query(queries.applications),
    pool.query(queries.interviews)
  ]);

  return {
    candidates: candidatesRes.rows[0].count,
    jobs: jobsRes.rows[0].count,
    applications: appsRes.rows[0].count,
    interviews: interviewsRes.rows[0].count
  };
};

/**
 * @desc    Fetch the 5 most recently created candidate entries
 * @returns {Promise<Array>} Array of candidate database records
 */
const getRecentCandidates = async () => {
  const query = `
    SELECT id, name, position, experience, status, created_at
    FROM candidates
    ORDER BY created_at DESC
    LIMIT 5
  `;
  const result = await pool.query(query);
  return result.rows;
};

/**
 * @desc    Fetch the 5 most recently created job postings
 * @returns {Promise<Array>} Array of job posting database records
 */
const getRecentJobs = async () => {
  const query = `
    SELECT id, title, dept, loc, salary, status, created_at
    FROM jobs
    ORDER BY created_at DESC
    LIMIT 5
  `;
  const result = await pool.query(query);
  return result.rows;
};

/**
 * @desc    Compile totals split by structural application workflow status stages
 * @returns {Promise<Object>} Structured status mapping dictionary with explicit fallbacks
 */
const getPipelineData = async () => {
  const query = `
    SELECT status, COUNT(*)::int as count
    FROM applications
    GROUP BY status
  `;
  const result = await pool.query(query);

  // Map database groupings to structural layout contracts cleanly
  const defaultPipeline = {
    'Applied': 0,
    'Screening': 0,
    'Technical Assessment': 0,
    'Interview': 0,
    'Selected': 0,
    'Rejected': 0
  };

  result.rows.forEach(row => {
    if (row.status in defaultPipeline) {
      defaultPipeline[row.status] = row.count;
    }
  });

  return defaultPipeline;
};

/**
 * @desc    Staged system log trigger placeholder for operational system activities
 * @returns {Promise<Array>} Initially returns an empty array pending notification engine lifecycle build out
 */
const getNotifications = async () => {
  // Staged for structural platform notification tables expansion down the road
  return [];
};

module.exports = {
  getStats,
  getRecentCandidates,
  getRecentJobs,
  getPipelineData,
  getNotifications
};