const express = require("express");
const { userRegister, userLogin, userLogout, getMe } = require("../controllers/userController");
const { userAuthenticate } = require("../middleware/auth");

const router = express.Router();



router.route("/register").post(userRegister);
router.route("/login").post(userLogin);
router.route("/logout").post(userAuthenticate,userLogout);
router.route("/me").get(userAuthenticate,getMe);


module.exports=router;