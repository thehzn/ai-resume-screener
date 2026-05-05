const Employer = require("../models/employerProfileSchema");
const User = require("../models/userSchema");
const Job =require("../models/jobSchema");
const Application = require("../models/applicationSchema");

exports.createemployerProfile=async(req,res)=>{


 try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const existing = await Employer.findOne({ user: req.userId });
        if (existing) {
            return res.status(400).json({ success: false, message: "Profile already exists" });
        }

        const { companyName, location, website } = req.body;

        const employer = await Employer.create({
            user: req.userId,
            companyName,
            location,
            website,
           
        });
         user.role = 'employer';
    await user.save();

        res.status(201).json({ success: true, message: "Employer profile created successfully", employer ,user});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }



}


exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



exports.getRankedApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    // 1. Verify the job exists and belongs to the requesting employer
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.employer.toString() !== req.userId) {
      return res.status(403).json({ 
        success: false, 
        message: "Unauthorized: You can only view applicants for your own jobs" 
      });
    }
     const totalApplicants = await Application.countDocuments({ job: jobId });
        const pendingCount = await Application.countDocuments({ 
            job: jobId, 
            "aiMatch.matchStatus": { $in: ["pending", "processing"] }
        });

    // 2. Fetch applications, populate candidate details, and SORT by matchScore
    const applications = await Application.find({ job: jobId,
      "aiMatch.matchStatus": "completed" 
     })
     .sort({ "aiMatch.matchScore": -1 })
      .populate({ path: "applicant", select: "name email" }) // Just get basic user info
      .populate({ path: "resume", select: "originalName fileUrl parsedData.skills parsedData.totalExperienceYears" });     // Get the skills/exp the AI analyzed
        // -1 means Descending (100 down to 0)

    const applicants = applications.map((app) => ({
            applicationId: app._id,
            appliedAt: app.createdAt,
            status: app.status,
            applicant: {
                userId: app.applicant._id,
                name: app.applicant.name,
                email: app.applicant.email,
            },
            resume: {
                resumeId: app.resume._id,
                fileName: app.resume.originalName,
                fileUrl: app.resume.fileUrl,
                skills: app.resume.parsedData?.skills || [],
                totalExperienceYears: app.resume.parsedData?.totalExperienceYears || 0,
            },
            aiMatch: {
                matchScore: app.aiMatch.matchScore,
                matchSummary: app.aiMatch.matchSummary,
                keywordsFound: app.aiMatch.keywordsFound,
                keywordsMissing: app.aiMatch.keywordsMissing,
                strengths: app.aiMatch.strengths,
                improvements: app.aiMatch.improvements,
            },
        }));
         res.status(200).json({
            success: true,
            jobTitle: job.title,
            totalApplicants,         // all applicants including pending
            pendingCount,            // how many still being scored
            scoredApplicants: applicants.length,
            applicants,
        });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const emp_id = req.userId;
    const { status } = req.body;

    const ALLOWED_STATUSES = ["applied", "reviewed", "shortlisted", "rejected"];
    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${ALLOWED_STATUSES.join(", ")}`,
      });
    }

    const application = await Application.findById(applicationId)
      .populate("job", "employer");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // authorization check
    if (emp_id.toString() !== application.job.employer.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorised to update this application",
      });
    }

    // update directly — no second DB call needed
    application.status = status;
    const updatedApplication = await application.save();

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      updatedApplication,
    });

  } catch (error) {
    console.error("updateApplication error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


exports.dashboardStatus =  async(req,res)=>{
  try{
    const emp_id = req.userId;

    const jobs = await Job.find({
      employer:emp_id,
      status:"active"

    }).sort({createdAt:-1});

    const jobIds = jobs.map((job)=>job._id);

    const applications = await Application.find({job: {$in:jobIds}})
    .sort({createdAt :-1});

    const statusCounts = {
      applied:     applications.filter((a) => a.status === "applied").length,
      reviewed:    applications.filter((a) => a.status === "reviewed").length,
      shortlisted: applications.filter((a) => a.status === "shortlisted").length,
      rejected:    applications.filter((a) => a.status === "rejected").length,
    };
      res.status(200).json({
      success: true,
        totalJobs: jobs.length,
        totalApplicants: applications.length,
        shortlisted: statusCounts.shortlisted,
        pending: statusCounts.applied,
      });
  }
  catch (error) {
    console.error("Dashboard Stats fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
 
}
