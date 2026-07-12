/**
 * @file candidateController.js
 * @description Controller handling core candidate operations and recruitment workflows.
 * Implements strict payload parsing, status validation constraints, and standardized JSON signatures.
 */

const candidateModel = require('../models/candidateModel');

// Shared workflow status matrix used for routing state alignment verification
const ALLOWED_STATUSES = ["Applied", "Interview", "Selected", "Rejected"];

/**
 * 1. Register a new applicant candidate profile
 * @route   POST /api/candidates
 */
const createCandidate = async (req, res) => {
    try {
        const { full_name, email, phone, position_applied, experience, resume_link } = req.body;

        // Validation: Enforce presence of minimum structural attributes
        if (!full_name || !email || !position_applied) {
            return res.status(400).json({
                success: false,
                message: "Full name, email, and position applied are required."
            });
        }

        // Safe integer casting logic with fallback parameters
        const parsedExperience = parseInt(experience, 10) || 0;

        const candidate = await candidateModel.createCandidate(
            full_name, 
            email, 
            phone || null, 
            position_applied, 
            parsedExperience, 
            resume_link || null
        );

        return res.status(201).json({
            success: true,
            message: "Candidate created successfully.",
            candidate
        });

    } catch (error) {
    console.error("Candidate Controller Error:", error);

    return res.status(500).json({
        success: false,
        message: error.message,
        error: error
    });
}
};

/**
 * 2. Retrieve all system candidates matching standard temporal filters
 * @route   GET /api/candidates
 */
const getAllCandidates = async (req, res) => {
    try {
        const candidates = await candidateModel.getAllCandidates();
        
        return res.status(200).json({
            success: true,
            candidates
        });
        
    } catch (error) {
        console.error("Candidate Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * 3. Retrieve a single candidate's administrative profile mapping
 * @route   GET /api/candidates/:id
 */
const getCandidateById = async (req, res) => {
    try {
        const { id } = req.params;
        const candidate = await candidateModel.getCandidateById(id);

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found."
            });
        }

        return res.status(200).json({
            success: true,
            candidate
        });

    } catch (error) {
        console.error("Candidate Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * 4. Micro-Patch endpoint for updating only workflow tracking metrics
 * @route   PATCH /api/candidates/:id/status
 */
const updateCandidateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validation: Verify status passes state matrix criteria
        if (!status || !ALLOWED_STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing status."
            });
        }

        const candidate = await candidateModel.updateCandidateStatus(id, status);

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Candidate status updated successfully.",
            candidate
        });

    } catch (error) {
        console.error("Candidate Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * 5. Full replacement mutation handler for candidate records
 * @route   PUT /api/candidates/:id
 */
const updateCandidate = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, email, phone, position_applied, experience, resume_link, status } = req.body;

        // Validation: Ensure structure fields are fully populated
        if (!full_name || !email || !position_applied || !status) {
            return res.status(400).json({
                success: false,
                message: "Full name, email, position applied, and status are required fields."
            });
        }

        // Validation: Guarantee alignment on modifications to structural pipeline tags
        if (!ALLOWED_STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid workflow status provided."
            });
        }

        const parsedExperience = parseInt(experience, 10) || 0;

        const candidate = await candidateModel.updateCandidate(
            id,
            full_name,
            email,
            phone || null,
            position_applied,
            parsedExperience,
            resume_link || null,
            status
        );

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Candidate updated successfully.",
            candidate
        });

    } catch (error) {
        console.error("Candidate Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * 6. Deletion handler module
 * @route   DELETE /api/candidates/:id
 */
const deleteCandidate = async (req, res) => {
    try {
        const { id } = req.params;
        const successDeleted = await candidateModel.deleteCandidate(id);

        if (!successDeleted) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Candidate deleted successfully."
        });

    } catch (error) {
        console.error("Candidate Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

// Export controller methods via CommonJS specifications
module.exports = {
    createCandidate,
    getAllCandidates,
    getCandidateById,
    updateCandidateStatus,
    updateCandidate,
    deleteCandidate
};