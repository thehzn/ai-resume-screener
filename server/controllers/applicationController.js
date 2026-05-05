const Job = require("../models/jobSchema");
const Application = require("../models/applicationSchema");
const Resume = require("../models/resumeSchema");
const {runAIScreening} =require("../services/aiScreeningService");

exports.applyToJob=async(req,res)=>{

    try{
         const {jobId}=req.params;
    const applicantId=req.userId;
    const {resumeId}=req.body;

    const job = await Job.findById(jobId);
    if(!job){
        return res.status(404).json({ success: false, message: "Job not found" });
    }
     if (job.status === "closed") {
      return res.status(400).json({ message: "This job is no longer accepting applications" });
    }
     if (job.deadline && new Date() > new Date(job.deadline)) {
      return res.status(400).json({ message: "Application deadline has passed" });
    }
    const resume = await Resume.findOne({ _id: resumeId, jobSeeker: applicantId });
    
    if (!resume) {
      return res.status(404).json({ message: "Resume not found or access denied." });
    }
    

     const application = await Application.create({
          job: jobId,
          applicant: applicantId,
          resume:resumeId,
        });


         runAIScreening(application._id).catch((err) =>
              console.error("Background AI screening error:", err.message)
            );
           return res.status(201).json({
  success: true, // <--- Add this so your Frontend "if(data.success)" works!
  message: "Application submitted successfully. AI screening is in progress.",
  applicationId: application._id, 
});
    
    }
    catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }
    return res.status(500).json({ message: "Server error", error: error.message });
  }
   

}

exports.getMatchResult= async(req,res)=>{
  try{
    const {id} = req.params;
    
    const application = await Application.findById(id);

    if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }
   if (application.applicant.toString() !== req.userId.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }
   return res.status(200).json({ aiMatch: application.aiMatch });

  }
  catch(error){
    return res.status(500).json({ message: "Server error", error: error.message });
  }

}


exports.getApplications= async(req,res)=>{
  try{
    const id  = req.userId;
   

    const applications = await Application.find({applicant:id});
      if(!applications){
        return res.status(404).json({success:false,message:"Applications not found"});
      }
    
     res.status(200).json({ success: true, applications });
    
  }
  catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

exports.deleteApplication= async(req,res)=>{
  try{
    const {id} = req.params;

    const application= await Application.findById(id);



    if(application.applicant.toString()!==req.userId.toString()){
      return res.status(403).json({ message: "Not authorized" });
    }
    await application.deleteOne();
     res.status(200).json({
      success:true,
      message:"Application deleted successfully",
     });


    
  }
   catch (error) {
    res.status(500).json({ message: "Server error" });
  }

}