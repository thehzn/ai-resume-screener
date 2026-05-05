const mongoose = require("mongoose");



const jobSchema = new mongoose.Schema(
  {
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    employerprofile: { type: mongoose.Schema.Types.ObjectId, ref: "Employer" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    skills: [String],
    location: String,
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "remote", "hybrid"],
      default: "full-time",
    },
    experienceLevel: {
      type: String,
      enum: ["fresher", "junior", "mid", "senior"],
      default: "fresher",
    },
    salaryRange: {
      min: { type: Number, required: true },
      max:{ type: Number, required: true },
      currency: { type: String, default: "INR" },
    },
    deadline: Date,
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);