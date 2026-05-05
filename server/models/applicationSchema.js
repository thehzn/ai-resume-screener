const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true },

    // AI Match Results (job specific)
    
    aiMatch: {
      matchScore: { type: Number, min: 0, max: 100, default: 0 },
      matchSummary: String,         

      
      keywordsFound: [String],       
      keywordsMissing: [String],     
      strengths: [String],         
      improvements: [String],        

      matchStatus: {
        type: String,
        enum: ["pending", "processing", "completed", "failed"],
        default: "pending",
      },
      generatedAt: Date,
    },

    // Employer decision
    status: {
      type: String,
      enum: ["applied", "reviewed", "shortlisted", "rejected"],
      default: "applied",
    },
  },
  { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);