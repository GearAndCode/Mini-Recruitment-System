/**
 * @file jobController.js
 * @description Controller managing job postings lifecycle.
 * Implements clean input validation, try/catch exception shielding, and status routing checks.
 */

const jobModel = require('../models/jobModel');

// Whitelist array defining valid states for a job posting
const ALLOWED_JOB_STATUSES = ["Open", "Closed"];

/**
 * 1. Post a new job position opening
 * @route   POST /api/jobs
 */
const createJob = async (req, res) => {
    try {
        const { title, department, location, description, salary } = req.body;

        // Validation Rule: Title and department are mandatory string payloads
        if (!title || !department) {
            return res.status(400).json({
                success: false,
                message: "Title and department are required fields."
            });
        }

        const job = await jobModel.createJob(
            title,
            department,
            location || null,
            description || null,
            salary || null
        );

        return res.status(201).json({
            success: true,
            message: "Job created successfully.",
            job
        });

    } catch (error) {
        console.error("Job Controller Error (createJob):", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * 2. Retrieve all active and inactive job boards listings
 * @route   GET /api/jobs
 */
const getAllJobs = async (req, res) => {
    try {
        const jobs = await jobModel.getAllJobs();

        return res.status(200).json({
            success: true,
            jobs
        });

    } catch (error) {
        console.error("Job Controller Error (getAllJobs):", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * 3. Retrieve a single job posting details map by ID
 * @route   GET /api/jobs/:id
 */
const getJobById = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await jobModel.getJobById(id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found."
            });
        }

        return res.status(200).json({
            success: true,
            job
        });

    } catch (error) {
        console.error("Job Controller Error (getJobById):", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * 4. Update full data context parameters for a job posting
 * @route   PUT /api/jobs/:id
 */
const updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, department, location, description, salary, status } = req.body;

        // Validation Rule 1: Enforce mandatory attributes
        if (!title || !department) {
            return res.status(400).json({
                success: false,
                message: "Title and department are required fields."
            });
        }

        // Validation Rule 2: Ensure the provided state matches the status schema matrix
        if (!status || !ALLOWED_JOB_STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing status. Must be 'Open' or 'Closed'."
            });
        }

        const updatedJob = await jobModel.updateJob(
            id,
            title,
            department,
            location || null,
            description || null,
            salary || null,
            status
        );

        if (!updatedJob) {
            return res.status(404).json({
                success: false,
                message: "Job not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Job updated successfully.",
            job: updatedJob
        });

    } catch (error) {
        console.error("Job Controller Error (updateJob):", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * 5. Remove an obsolete job profile permanently from active indexing
 * @route   DELETE /api/jobs/:id
 */
const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;
        const isDeleted = await jobModel.deleteJob(id);

        if (!isDeleted) {
            return res.status(404).json({
                success: false,
                message: "Job not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Job deleted successfully."
        });

    } catch (error) {
        console.error("Job Controller Error (deleteJob):", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

// Export controller layer mapping blocks via CommonJS specifications
module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob
};