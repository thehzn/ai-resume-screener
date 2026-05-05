const express = require("express");
const { userAuthenticate,userAutherize } = require("../middleware/auth");
const { getProfile ,updateProfile, getAppliedJobs,syncProfileWithResume, getSingleApplication} = require("../controllers/jobseekerController");
const router = express.Router();



router.route("/getprofile").get(userAuthenticate,userAutherize("jobseeker"),getProfile);
router.route("/updateprofile").patch(userAuthenticate,userAutherize("jobseeker"),updateProfile);
router.route("/getappliedjobs").get(userAuthenticate,userAutherize("jobseeker"),getAppliedJobs);
router.route("/getsingle").get(userAuthenticate,userAutherize("jobseeker"),getSingleApplication);


module.exports=router;