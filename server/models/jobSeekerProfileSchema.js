const mongoose = require("mongoose");

const jobSeekerProfileSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true,
    },
    //Basis info

    phone: String,
    location: String,

    //social links

    linkedIn: String,
    gitHub: String,
    

    //skills

    skills: [String],

    totalExperienceYears:{
        type:Number,
        default:0,
    },
    
     defaultResume:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Resume",
    },
   
    },
    {timestamps:true}

);
module.exports =mongoose.model("Jobseeker",jobSeekerProfileSchema);