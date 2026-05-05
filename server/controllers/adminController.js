const User = require("../models/userSchema");
const Employer = require("../models/employerProfileSchema");
const Job = require("../models/jobSchema");

exports.getAllUsers = async (req, res) => {
    try {
        const { role } = req.query; // optional filter: ?role=jobseeker or ?role=employer

        const filter = { role: { $ne: "admin" } }; // never return admin accounts
        if (role && ["jobseeker", "employer"].includes(role)) {
            filter.role = role;
        }

        const users = await User.find(filter)
            .select("name email role")
            .sort({ createdAt: -1 }); // newest first

        res.status(200).json({
            success: true,
            totalUsers: users.length,
            users,
        });

    } catch (error) {
        console.error("getAllUsers error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// // 3. CHANGE USER ROLE TO EMPLOYER
// // ─────────────────────────────────────────
// exports.changeRoleToEmployer = async (req, res) => {
//     try {
//         const { userId } = req.params;

//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         // Guard checks
//         if (user.role === "admin") {
//             return res.status(403).json({ success: false, message: "Cannot change admin role" });
//         }

//         if (user.role === "employer") {
//             return res.status(400).json({ success: false, message: "User is already an employer" });
//         }

//         const updatedUser = await User.findByIdAndUpdate(
//             userId,
//             { $set: { role: "employer" } },
//             { new: true }
//         ).select("-password -passwordResetToken -emailVerificationToken -passwordResetExpires");

//         res.status(200).json({
//             success: true,
//             message: `${user.name} is now an employer`,
//             user: updatedUser,
//         });

//     } catch (error) {
//         console.error("changeRoleToEmployer error:", error);
//         res.status(500).json({ success: false, message: "Server error" });
//     }


    
// };

exports.getPendingEmployers = async (req, res) => {
    try {
       

        const pendingProfiles = await Employer.find({ status: "pending" })
            .populate("user", "name email createdAt")
            .sort({ createdAt: -1 }); // oldest first — been waiting longest

        res.status(200).json({
            success: true,
            totalPending: pendingProfiles.length,
            pendingProfiles,
        });

    } catch (error) {
        console.error("getPendingEmployers error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.approveEmployer = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body; // "approved" or "rejected"
         
        console.log("userId from params:", userId);          // 👈 add this
        console.log("status from body:", status);            // 👈 add this

        // Check if profile exists BEFORE updating
        const existingProfile = await Employer.findById(userId);
        console.log("existing profile:", existingProfile); 
        const ALLOWED = ["approved", "rejected"];
        if (!status || !ALLOWED.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be 'approved' or 'rejected'"
            });
        }

       
        

            // // Update role to employer only if approved
            // User.findByIdAndUpdate(
            //     userId,
            //     { $set: { role: status === "approved" ? "employer" : "jobseeker" } },
            //     { new: true }
            // ).select("name email role"),

            // Update employer profile status
          const updatedProfile = await Employer.findByIdAndUpdate(
            userId,
            {$set:{status}},
            {new:true}
          ) ;

        res.status(200).json({
            success: true,
            message:"employer status updated successfully",
            updatedProfile,
        });

    } catch (error) {
        console.error("approveEmployer error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }


};

exports.getdashboardStats = async(req,res)=>{
    
    try{
         

    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
       console.log("Total jobs:", totalJobs);
    const approvalCount = await Employer.countDocuments({status:"pending"});
     
        res.status(200).json({
            success: true,
            message:"status fetched successfully",
            totalUsers,
            totalJobs,
            approvalCount

        });

    }
    catch (error) {
        console.error("dashboard status fetch error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
    
    
}

exports.getAllJobList = async(req,res)=>{
    try{
       

        const joblist = await Job.find({status:"active"})
        .select("title jobType location createdAt employerprofile")
        .populate("employerprofile","companyName");
        res.json({joblist});
    }
      catch (error) {
        console.error("job list fetch error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }

}
exports.deleteJob = async(req,res)=>{
     try{
        const {jobId} = req.params;
        const job = await Job.findByIdAndDelete(jobId);
        if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
     res.json({ success: true, message: "Job deleted successfully" });

     }
     catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
}

exports.deleteUser= async(req,res)=>{
    try{
        const {userId} = req.params;
        const user = await User.findByIdAndDelete(userId);
        if(!user){
             return res.status(404).json({ success: false, message: "user not found" });
        }
         res.json({ success: true, message: "user deleted successfully" });
    } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
}