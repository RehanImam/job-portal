
const express = require("express");
// const mongoose = require('mongoose')
const app = express();
const database = require("./config/database");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

dotenv.config();
const PORT = process.env.PORT || 5000;

// 1. Connect to Services
database.connect();
cloudinaryConnect();

// Routes import
const userRoutes = require("./routes/user");
const jobRoutes = require("./routes/job");
const adminRoutes = require("./routes/adminRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

// 2. Middlewares
app.use(express.json());
app.use(cookieParser());
// app.use(
//   cors({
//     origin: ["http://localhost:3000","https://job-portal-foryou-3yzo.onrender.com"],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );


app.use(
  cors({
    origin: ["http://localhost:3000","https://job-portal-w1gh.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// This MUST be before routes to handle your resume uploads
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// 3. Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/v1/category", categoryRoutes);

// Default Route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "JOBFLOW server is up and running!",
  });
});

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});