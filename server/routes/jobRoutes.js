const express = require("express");
const {createJob,getAllJobs,deleteJob, updateJob, getJobdetails} =require("../controllers/jobController");
const { userAuthenticate,userAutherize } = require("../middleware/auth");
const router = express.Router();

router.route("/createjob").post(userAuthenticate,userAutherize("employer","admin"),createJob);
router.route("/getalljobs").get(userAuthenticate,getAllJobs);
router.route("/deletejob/:id").delete(userAuthenticate,userAutherize("employer","admin"),deleteJob);
router.route("/updatejob/:id").patch(userAuthenticate,userAutherize("employer","admin"),updateJob);
router.route("/getjobdetails/:id").get(userAuthenticate,userAutherize("employer","admin"),getJobdetails);


module.exports=router;