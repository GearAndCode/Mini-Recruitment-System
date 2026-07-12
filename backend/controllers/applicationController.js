/**
 * @file applicationController.js
 * @description Controller managing the recruitment pipeline processing lifecycle.
 * Validates candidate-to-job matches, controls workflow status state transitions, and enforces standardized JSON formats.
 */

const applicationModel = require('../models/applicationModel');

// Whitelist array defining the allowed state boundaries for an application
const ALLOWED_APPLICATION_STATUSES = [
    "Applied",
    "Interview",
    "Selected",
    "Rejected"
];

/**
 * 1. Submit a candidate application to a job position opening
 * @route   POST /api/applications
 */
const createApplication = async (req, res) => {
    try {
        const { candidate_id, job_id, notes } = req.body;

        // Validation Rule: Core foreign key bindings must exist
        if (!candidate_id || !job_id) {
            return res.status(400).json({
                success: false,
                message: "Candidate ID and Job ID are required fields."
            });
        }

        const application = await applicationModel.createApplication(
            candidate_id,
            job_id,
            notes || null
        );

        return res.status(201).json({
            success: true,
            message: "Application created successfully.",
            application
        });

    } catch (error) {
        console.error("Application Controller Error (createApplication):", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * 2. Retrieve a listing of all tracked candidate applications
 * @route   GET /api/applications
 */
const getAllApplications = async (req, res) => {
    try {
        const applications = await applicationModel.getAllApplications();

        return res.status(200).json({
            success: true,
            applications
        });

    } catch (error) {
        console.error("Application Controller Error (getAllApplications):", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * 3. Retrieve a single pipeline application mapping details by ID
 * @route   GET /api/applications/:id
 */
const getApplicationById = async (req, res) => {
    try {
        const { id } = req.params;
        const application = await applicationModel.getApplicationById(id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found."
            });
        }

        return res.status(200).json({
            success: true,
            application
        });

    } catch (error) {
        console.error("Application Controller Error (getApplicationById):", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * 4. Patch mutation to shift workflow statuses and update administrative evaluation logs
 * @route   PUT /api/applications/:id/status
 */
const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        // Validation Rule: Ensure state updates conform to pipeline constraints
        if (!status || !ALLOWED_APPLICATION_STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing status. Must be 'Applied', 'Interview', 'Selected', or 'Rejected'."
            });
        }

        const updatedApplication = await applicationModel.updateApplicationStatus(id, status, notes || null);

        if (!updatedApplication) {
            return res.status(404).json({
                success: false,
                message: "Application not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Application status updated successfully.",
            application: updatedApplication
        });

    } catch (error) {
        console.error("Application Controller Error (updateApplicationStatus):", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * 5. Expunge an application profile record from the tracking layout
 * @route   DELETE /api/applications/:id
 */
const deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const isDeleted = await applicationModel.deleteApplication(id);

        if (!isDeleted) {
            return res.status(404).json({
                success: false,
                message: "Application not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Application deleted successfully."
        });

    } catch (error) {
        console.error("Application Controller Error (deleteApplication):", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

// Export controller functions utilizing CommonJS specifications
module.exports = {
    createApplication,
    getAllApplications,
    getApplicationById,
    updateApplicationStatus,
    deleteApplication
};