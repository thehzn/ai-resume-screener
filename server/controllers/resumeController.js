const { extractText } = require("../utils/extractText");
const Resume = require("../models/resumeSchema");
const User = require("../models/userSchema");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Jobseeker = require("../models/jobSeekerProfileSchema");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const parseResumeWithAI = async (extractedText) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });
  const prompt = `Extract structured information from the following resume  text and return a JSON object with this exact structure:
    {
     contactInfo:{
             name: "string or null",
             email:  "string or null",
             phone: "string or null",
             location: "string or null",
             linkedIn: "string or null",
             github:  "string or null",
        },
        skills:["array","of","strings"],
        workExperience:[
            {
             jobTitle:"string",
             company:"string",
             duration:"string (e.g. Jan 2020 - Mar 2022)",
             description:"string",   
            },
        ],
        education:[
            {
                degree:"string" ,
                institution:"string",
                year:"string",
            },
        ],
        certifications:["array","of","strings"],
        totalExperienceYears:number,
    }
    Resume Text:${extractedText}`;
  const result = await model.generateContent(prompt);
  const rawJson = result.response.text().trim();
  return JSON.parse(rawJson);
};

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const userId = req.userId;
    // Extract text regardless of whether it's PDF or DOCX
    const rawText = await extractText(req.file.path, req.file.mimetype);

    // Create record in DB
    const resume = await Resume.create({
      jobSeeker: userId,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileUrl: req.file.path,
      fileType: req.file.mimetype.includes("pdf") ? "pdf" : "docx",
      parsedData: {
        extractedText: rawText,
      },
      parseStatus: "processing",
    });

    //ai parsing

    try {
      const aiParsed = await parseResumeWithAI(rawText);

      const updatedResume = await Resume.findByIdAndUpdate(
        resume._id,
        {
          $set: {
            "parsedData.contactInfo": aiParsed.contactInfo,
            "parsedData.skills": aiParsed.skills,
            "parsedData.workExperience": aiParsed.workExperience,
            "parsedData.education": aiParsed.education,
            "parsedData.certifications": aiParsed.certifications,
            "parsedData.totalExperienceYears": aiParsed.totalExperienceYears,
            parseStatus: "completed", // This is outside parsedData, so it's a top-level update
          },
        },
        { new: true },
      );
      await Jobseeker.findOneAndUpdate(
        { user: userId },
        { $set: { defaultResume: resume._id } },
        { upsert: true },
      );
      await User.findByIdAndUpdate(userId,  { $set: { resume: resume._id } });
      const updatedUser = await User.findById(userId).select("-password");

    //   const updatedUser =  await User.findByIdAndUpdate(
    //   userId,
    //   {$set:{ resume:resume._id }},
    //   {new:true}
    // ).select("-password");

      res.status(201).json({
        success: true,
        resumeId: resume._id,
        user: updatedUser,
        textLength: rawText.length,
        resume: updatedResume,
      });
    } catch (aiError) {
      console.error("AI parsing failed:", aiError.message);
      await Resume.findByIdAndUpdate(resume._id, {
        parseStatus: "failed",
      });
      res.status(201).json({
        success: false,
        resumeId: resume._id,
        message: "Resume uploaded but AI parsing failed, please try again",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
