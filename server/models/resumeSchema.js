const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
    jobSeeker:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    //File info

    fileName:{
        type:String,
        required:true,
    },
    originalName:{
        type:String,
        required:true,
    },
    fileUrl:{
        type:String,
        required:true,
    },
    fileType:{
        type:String,
        enum:["pdf","docx"],
        required:true,
    },
    fileSize:Number,
    isDefault:{
        type:Boolean,
        default:false,
    },

    //Ai parsing results

    parsedData:{
        extractedText:String,
        contactInfo:{
             name: String,
             email: String,
             phone: String,
             location: String,
             linkedIn: String,
             github: String,
        },
        skills:{ type: [String], default: [] },
        workExperience:[
            {
             jobTitle:String,
             company:String,
             duration:String,
             description:String,   
            },
        ],
        education:[
            {
                degree:String,
                institution:String,
                year:String,
            },
        ],
        certifications:[String],
        totalExperienceYears:Number,
    },

    //ai feedback

    // needed when if need to get a resume feedback. but not doing now
    parseStatus:{
        type:String,
        enum:["pending","processing","completed","failed"],
        default:"pending"
        
    },
    parseError:String,

},
{timestamps:true}
);
module.exports =mongoose.model("Resume",resumeSchema);