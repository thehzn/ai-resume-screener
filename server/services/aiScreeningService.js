const {GoogleGenerativeAI}= require("@google/generative-ai");
const Application = require("../models/applicationSchema");
const Resume =require("../models/resumeSchema");
const Job = require("../models/jobSchema");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const buildScreeningPrompt = (resume,job)=>{
    const parsedData = resume.parsedData;

    const resumeContext =`
     CANDIDATE PROFILE:
     Name:${parsedData.contactInfo?.name ||"N/A"}
     Total Experience: ${parsedData.totalExperienceYears ?? 0} years
     Skills: ${parsedData.skills?.join(", ") || "None listed"}
     Work Experience:${parsedData.workExperience?.length?parsedData.workExperience.map((w)=>
        `-${w.jobTitle} at ${w.company} (${w.duration})\n ${w.description || ""}`
     )
     .join("\n")
     :"No work experience listed"
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


  //job context
    
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
    return  `You are an expert AI recruitment screener. Analyze how well this candidate matches the job and return a structured JSON response.
    STRICT INSTRUCTIONS FOR KEYWORDS:
1. Compare the "Required Skills" in the JOB DETAILS to the "Skills" and "Work Experience" in the CANDIDATE PROFILE.
2. "keywordsFound": List specific technical skills or qualifications from the Job Details that ARE present in the candidate's profile.
3. "keywordsMissing": List specific technical skills or qualifications from the Job Details that ARE NOT mentioned or implied in the candidate's profile.

${resumeContext}

  ${jobContext}
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
  
    
}

const runAIScreening= async(applicationId)=>{
    let application;

    try{
       application = await Application.findById(applicationId)
            .populate("job")
            .populate("resume");
    if (!application) throw new Error("Application not found");
       const { job, resume } = application;
       if (resume.parseStatus !== "completed") {
      throw new Error("Resume parsing not completed yet");
    }
     application.aiMatch.matchStatus = "processing";
    await application.save();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = buildScreeningPrompt(resume, job);

    const result = await model.generateContent(prompt);
    const rawText = result.response.text().trim();

     let parsed;
    try {
      // Strip markdown code blocks if Gemini wraps in them despite instructions
      const cleaned = rawText.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      throw new Error(`Failed to parse Gemini response: ${rawText}`);
    }
     const { matchScore, matchSummary, keywordsFound, keywordsMissing, strengths, improvements } = parsed;


     if (typeof matchScore !== "number" || matchScore < 0 || matchScore > 100) {
      throw new Error("Invalid matchScore in Gemini response");
    }

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
    }
    catch(error){
        console.error(`❌ AI screening failed for application ${applicationId}:`, error.message);

    // Save failed status so we know to retry later
    if (application) {
      application.aiMatch.matchStatus = "failed";
      await application.save();
    }

    throw error;
    }
}

module.exports = { runAIScreening };

