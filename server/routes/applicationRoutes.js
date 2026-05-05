const express = require("express");
const { userAuthenticate, userAutherize } = require("../middleware/auth");
const { applyToJob, getMatchResult, getApplications, deleteApplication } = require("../controllers/applicationController");
const router = express.Router();

 router.route("/applytojob/:jobId").post(userAuthenticate,userAutherize("jobseeker"),applyToJob);
 router.route("/getresult/:id").get(userAuthenticate,userAutherize("jobseeker"),getMatchResult);
 router.route("/getapplications").get(userAuthenticate,userAutherize("jobseeker"),getApplications);
 router.route("/deleteone/:id").get(userAuthenticate,userAutherize("jobseeker"),deleteApplication);





module.exports=router;