const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const consultationRoutes = require("./routes/ConsultationRoutes");
const therapyRoutes = require("./routes/therapyRoutes");
const helplineRoutes = require("./routes/helplineRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const translateRoutes = require("./routes/translateRoutes");
const { uploadRoot } = require("./middlewares/upload");

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://sherise-woad.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(uploadRoot));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/therapy", therapyRoutes);
app.use("/api/helplines", helplineRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/translate", translateRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("SheRise API is running");
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });