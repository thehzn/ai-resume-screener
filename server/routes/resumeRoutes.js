const express = require("express");
const { userAuthenticate } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { uploadResume } = require("../controllers/resumeController");




const router = express.Router();


// router.route("/upload").post(userAuthenticate,(req, res, next) => {upload.single('resume')(req, res, (err) => {
//     if (err) {
//       return res.status(400).json({ error: err.message });
//     }
//     next();
//   });
// },uploadResume);

router.route("/upload").post(userAuthenticate,upload.single('resume'), uploadResume);


module.exports=router;