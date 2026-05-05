const mongoose = require("mongoose");

const employerProfileSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
        unique:true,
    },
    companyName:{
        type:String,
        required:true,
    },
    website:String,
    location:String,
    status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
},
},
{timestamps:true}
);
module.exports = mongoose.model("Employer",employerProfileSchema);