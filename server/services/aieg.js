// services/aiScreeningService.js

const { GoogleGenerativeAI } = require("@google/generative-ai");
const Application = require("../models/Application");
const Resume = require("../models/Resume");
const Job = require("../models/Job");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const buildScreeningPrompt = (resume, job) => {
  const parsedData = resume.parsedData;

  // Build a clean resume summary to feed into the prompt
  const resumeContext = `
CANDIDATE PROFILE:
Name: ${parsedData.contactInfo?.name || "N/A"}
Total Experience: ${parsedData.totalExperienceYears ?? 0} years
Skills: ${parsedData.skills?.join(", ") || "None listed"}

Work Experience:
${
  parsedData.workExperience?.length
    ? parsedData.workExperience
        .map(
          (w) =>
            `- ${w.jobTitle} at ${w.company} (${w.duration})\n  ${w.description || ""}`
        )
        .join("\n")
    : "No work experience listed"
}

Education:
${
  parsedData.education?.length
    ? parsedData.education
        .map((e) => `- ${e.degree} from ${e.institution} (${e.year})`)
        .join("\n")
    : "No education listed"
}

Certifications: ${parsedData.certifications?.join(", ") || "None"}

Raw Resume Text (for additional context):
${parsedData.extractedText?.slice(0, 3000) || ""}
  `.trim();

  const jobContext = `
JOB DETAILS:
Title: ${job.title}
Type: ${job.jobType}
Experience Level Required: ${job.experienceLevel}
Location: ${job.location || "Not specified"}
Required Skills: ${job.skills?.join(", ") || "Not specified"}
Salary Range: ${job.salaryRange.min} - ${job.salaryRange.max} ${job.salaryRange.currency}

Job Description:
${job.description}
  `.trim();

  return `
You are an expert AI recruitment screener. Analyze how well this candidate matches the job and return a structured JSON response.

${resumeContext}

---

${jobContext}

---

Evaluate the candidate against the job and return ONLY a valid JSON object with this exact structure (no extra text, no markdown, no code blocks):

{
  "matchScore": <number between 0-100>,
  "matchSummary": "<2-3 sentence overall summary of fit>",
  "keywordsFound": ["<skills/keywords from job that candidate has>"],
  "keywordsMissing": ["<skills/keywords from job that candidate lacks>"],
  "strengths": ["<3-5 specific strengths relevant to this job>"],
  "improvements": ["<3-5 specific areas candidate should improve for this role>"]
}

Scoring guide:
- 85-100: Excellent match, meets almost all requirements
- 70-84: Good match, meets most requirements  
- 50-69: Partial match, meets some requirements
- 30-49: Weak match, meets few requirements
- 0-29: Poor match, does not meet requirements
  `.trim();
};

const runAIScreening = async (applicationId) => {
  let application;

  try {
    // 1. Fetch application with related job and resume
    application = await Application.findById(applicationId)
      .populate("job")
      .populate("resume");

    if (!application) throw new Error("Application not found");

    const { job, resume } = application;

    // 2. Guard: resume must be parsed before screening
    if (resume.parseStatus !== "completed") {
      throw new Error("Resume parsing not completed yet");
    }

    // 3. Mark as processing
    application.aiMatch.matchStatus = "processing";
    await application.save();

    // 4. Build prompt and call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = buildScreeningPrompt(resume, job);

    const result = await model.generateContent(prompt);
    const rawText = result.response.text().trim();

    // 5. Parse Gemini's response safely
    let parsed;
    try {
      // Strip markdown code blocks if Gemini wraps in them despite instructions
      const cleaned = rawText.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      throw new Error(`Failed to parse Gemini response: ${rawText}`);
    }

    // 6. Validate the shape of the response
    const { matchScore, matchSummary, keywordsFound, keywordsMissing, strengths, improvements } = parsed;

    if (typeof matchScore !== "number" || matchScore < 0 || matchScore > 100) {
      throw new Error("Invalid matchScore in Gemini response");
    }

    // 7. Save results to application
    application.aiMatch = {
      matchScore,
      matchSummary,
      keywordsFound: keywordsFound || [],
      keywordsMissing: keywordsMissing || [],
      strengths: strengths || [],
      improvements: improvements || [],
      matchStatus: "completed",
      generatedAt: new Date(),
    };

    await application.save();

    console.log(`✅ AI screening completed for application ${applicationId} — Score: ${matchScore}`);

    return application.aiMatch;

  } catch (error) {
    console.error(`❌ AI screening failed for application ${applicationId}:`, error.message);

    // Save failed status so we know to retry later
    if (application) {
      application.aiMatch.matchStatus = "failed";
      await application.save();
    }

    throw error;
  }
};

module.exports = { runAIScreening };


///controller



// controllers/applicationController.js

const { runAIScreening } = require("../services/aiScreeningService");

const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const applicantId = req.user._id;
    const { resume } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.status === "closed") {
      return res.status(400).json({ message: "This job is no longer accepting applications" });
    }
    if (job.deadline && new Date() > new Date(job.deadline)) {
      return res.status(400).json({ message: "Application deadline has passed" });
    }

    const application = await Application.create({
      job: jobId,
      applicant: applicantId,
      resume,
    });

    // 🔥 Trigger AI screening in the background — don't await it
    // This way the user gets an instant response and screening runs behind the scenes
    runAIScreening(application._id).catch((err) =>
      console.error("Background AI screening error:", err.message)
    );

    return res.status(201).json({
      message: "Application submitted successfully. AI screening is in progress.",
      application,
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

