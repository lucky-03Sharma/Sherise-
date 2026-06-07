require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const consultationRoutes = require("./routes/ConsultationRoutes");
const therapyRoutes = require("./routes/therapyRoutes");
const helplineRoutes = require("./routes/helplineRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/therapy", therapyRoutes);
app.use("/api/helplines", helplineRoutes);

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