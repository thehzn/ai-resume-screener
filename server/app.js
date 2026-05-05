const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const cookieParse = require("cookie-parser");

//middlewares
app.use(cors({

    origin: 'http://localhost:5173', // ✅ exact frontend URL, not *
    credentials: true,               // ✅ allow cookies/credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}
));
app.use(express.json());
app.use(cookieParse());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const userRoutes = require("./routes/userRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const jobRoutes = require("./routes/jobRoutes");
const employerRoutes = require("./routes/employerRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const jobseekerRoutes = require("./routes/jobseekerRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/auth",userRoutes);
app.use("/api/resume",resumeRoutes);
app.use("/api/job",jobRoutes);
app.use("/api/employer",employerRoutes);
app.use("/api/application",applicationRoutes);
app.use("/api/jobseeker",jobseekerRoutes);
app.use("/api/admin",adminRoutes);



// app.use("/apemployeri/jobseeker",     require("./routes/jobSeekerProfile"));
// app.use("/api/employer",      require("./routes/employerProfile"));


// app.use("/api/applications",  require("./routes/applications"));
// app.use("/api/notifications", require("./routes/notifications"));


app.get("/", (req, res) => {
  res.send("AI Resume Intelligence System API is running");
});


app.use((req, res) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  res.status(404).json({ message: "Route not found" });
});


// multer error

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

//global error 

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Internal server error" });
});

module.exports = app;