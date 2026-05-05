const express = require("express");

const { userAuthenticate, userAutherize } = require("../middleware/auth");
const{getAllUsers , approveEmployer, getPendingEmployers, getdashboardStats, getAllJobList, deleteJob, deleteUser} = require("../controllers/adminController")

const router = express.Router();
 router.route("/dashboardstats").get(userAuthenticate,userAutherize("admin"),getdashboardStats);
  router.route("/getalljoblist").get(userAuthenticate,userAutherize("admin"),getAllJobList);
  router.route("/deletejob/:jobId").delete(userAuthenticate,userAutherize("admin"),deleteJob);
 router.route("/getallusers").get(userAuthenticate,userAutherize("admin"),getAllUsers);
  router.route("/deleteuser/:userId").delete(userAuthenticate,userAutherize("admin"),deleteUser);
  router.route("/getpending").get(userAuthenticate,userAutherize("admin"),getPendingEmployers);
router.route("/approveemp/:userId").patch(userAuthenticate,userAutherize("admin"),approveEmployer);




module.exports=router;