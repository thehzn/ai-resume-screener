const Job = require("../models/jobSchema");
const Employer = require("../models/employerProfileSchema");
const Application = require("../models/applicationSchema");


//create job

exports.createJob = async(req,res)=>{
try{
    const {title,description,skills,location,jobType, experienceLevel, salaryRange, deadline, status} = req.body;
    const profile = await Employer.findOne({user:req.userId});
    if(!profile){
        return res.status(404).json({
            success:false,
            message:"Employer not found"

        });

    }
    if (profile.status !== "approved") {
    return res.status(403).json({ 
        success: false, 
        message: "Your employer profile is pending admin approval" 
    });
}
    const job = await Job.create({
         employer: req.userId,
            employerprofile: profile._id,
            title,
            description,
            skills,
            location,
            jobType,
            experienceLevel,
            salaryRange,
            deadline,
            status,
        });
         res.status(201).json({ success: true,message:"job created successfully", job });

    }
    catch(error){
 res.status(500).json({ success: false, message: error.message });
    }
    
}
//get all jobs for the jobseeker

exports.getAllJobs =async(req,res)=>{

    try{
const {search,experienceLevel,jobType,location,status="active"} =req.query;

    const query ={status};

    if(search){
        query.$or=[
            {title:{$regex:search,$options:"i"}},
            {description:{$regex:search,$options:"i"}},
            {skills:{$elemMatch:{$regex:search,$options:"i"}}},

        ];
    }
    if(experienceLevel) query.experienceLevel=experienceLevel;
    if(jobType)query.jobType=jobType;
    if(location)query.location={ $regex: location, $options: "i" };

    const jobs = await Job.find(query)
    .populate("employer","name email")
    .populate("employerprofile","companyName website")
    .sort({createdAt:-1});

    const applications = await Application.find({applicant:req.userId});
    const appliedJobIds = applications.map((app)=>app.job.toString());

      res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
      appliedJobs:appliedJobIds,
    });
    }
    catch(error){
        res.status(500).json({ success: false, message: error.message });

    }
    

}

//delete job

exports.deleteJob = async (req, res) => {
     console.log("req.user:", req.user);  
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.employer.toString() !== req.userId) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to delete this job" });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// edit job

exports.updateJob=async(req,res)=>{
    try{
        const {id} =req.params;
        const job=await Job.findById(id);
        if(!job){
           return res.status(404).json({
                success:false,
                message:"Job not found"
            });

        }
        if(job.employer.toString()!==req.userId){
             return res
        .status(403)
        .json({ success: false, message: "Not authorized to update this job" });
        }

        const { 
      title,
      description,
      skills,
      location,
      jobType,
      experienceLevel,
      salaryRange,
      deadline,
      status,
    }=req.body;

    const updates = {};
      if (title) updates.title = title;
    if (description) updates.description = description;
    if (skills) updates.skills = skills;
    if (location) updates.location = location;
    if (jobType) updates.jobType = jobType;
    if (experienceLevel) updates.experienceLevel = experienceLevel;
    if (deadline) updates.deadline = deadline;
    if (status) updates.status = status;
    if (salaryRange) {
      updates.salaryRange = {
        min: salaryRange.min ?? job.salaryRange.min,
        max: salaryRange.max ?? job.salaryRange.max,
        currency: salaryRange.currency ?? job.salaryRange.currency,
      };
    }

    const updatedJob =await Job.findByIdAndUpdate(
        id,
        {$set:updates},
        {new:true,runValidators:true}
    );
       return res.status(200).json({
        success:true,
      message: "Job updated successfully",
      job: updatedJob,
    });  
    }
    catch(error){
return res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.getJobdetails= async(req,res)=>{
  try{
    const {id} = req.params;
     const job=await Job.findById(id);
        if(!job){
           return res.status(404).json({
                success:false,
                message:"Job not found"
            });

        }
        if(job.employer.toString()!==req.userId){
             return res
        .status(403)
        .json({ success: false, message: "Not authorized to update this job" });
        }
        
         return res.status(200).json({
          success:true,
          message:"Details fetched successfully",
          job,
        })
  }
   catch(error){
return res.status(500).json({ message: "Server error", error: error.message });
    }

}

