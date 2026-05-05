const Jobseeker = require("../models/jobSeekerProfileSchema");
const Application = require("../models/applicationSchema");
const Resume = require("../models/resumeSchema");

// 1. Get Profile
exports.getProfile = async (req, res) => {
    try {
        const profile = await Jobseeker
            .findOne({ user: req.userId })
            .populate("defaultResume", "originalName fileUrl createdAt");

        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        res.status(200).json({ success: true, profile });

    } catch (error) {
        console.error("getProfile error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch profile" });
    }
};

// 2. Manual Update
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.userId; // Extracted from your auth middleware
        const updates = req.body;

        // 1. Define which fields are safe to edit manually
        // We exclude 'user' and 'defaultResume' to protect the DB structure
        const allowedUpdates = [ 
            'phone', 
            'location', 
            'skills', 
            'linkedIn',
            'gitHub',
            'totalExperienceYears',
            
            
        ];

        // 2. Filter the req.body to only include allowed fields
        const filteredUpdates = {};
        Object.keys(updates).forEach((key) => {
            if (allowedUpdates.includes(key)) {
                filteredUpdates[key] = updates[key];
            }
        });
        if (Object.keys(filteredUpdates).length === 0) {
            return res.status(400).json({ success: false, message: "No valid fields to update" });
        }
        

        // 3. Update the Jobseeker document
        const updatedProfile = await Jobseeker.findOneAndUpdate(
            { user: userId },
            { $set: filteredUpdates },
            { new: true, runValidators: true}
        ).populate("defaultResume"); // Return the populated version for the frontend

        if (!updatedProfile) {
            return res.status(404).json({ 
                success: false, 
                message: "Profile not found" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profile: updatedProfile
        });

    } catch (error) {
        console.error("Update Profile Error:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Server error during profile update" 
        });
    }
};



exports.getSingleApplication = async (req, res) => {
    try {
        // This 'id' comes from the URL: /analysis/:id
        const { id } = req.params; 

        const application = await Application.findById(id).populate('job');

        if (!application) {
            return res.status(404).json({ success: false, message: "Not found" });
        }

        res.status(200).json({
            success: true,
            data: application // This contains the score, summary, etc.
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Get Applications (The AI Results)
exports.getAppliedJobs = async (req, res) => {
    const applications = await Application.find({ applicant: req.userId })
        .populate("job")
        .select("aiMatch status createdAt"); // Shows the matchScore!
    res.status(200).json({ success: true, applications });
};

