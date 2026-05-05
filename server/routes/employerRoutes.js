const express = require("express");

const { userAuthenticate,userAutherize } = require("../middleware/auth");
const { createemployerProfile, getMyJobs, getRankedApplicants, updateApplication, dashboardStatus } = require("../controllers/employerProfileController");
const router = express.Router();

router.route("/createemployerprofile").post(userAuthenticate,createemployerProfile);
router.route("/getmyjobs").get(userAuthenticate,userAutherize("employer","admin"),getMyJobs);
router.route("/getrankedlist/:jobId").get(userAuthenticate,userAutherize("employer","admin"),getRankedApplicants);
router.route("/updatestatus/:applicationId/status").patch(userAuthenticate,userAutherize("employer"),updateApplication);
router.route("/dashboardstatus").get(userAuthenticate,userAutherize("employer"),dashboardStatus);
module.exports=router;