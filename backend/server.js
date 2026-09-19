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
app.use(
  cors({
    origin: [
      "https://sherise-nine.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.options(/.*/, cors());
app.use(express.json());
app.use("/uploads", express.static(uploadRoot));

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/therapy", therapyRoutes);
app.use("/api/helplines", helplineRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/translate", translateRoutes);
app.get("/", (req, res) => {
  res.send("SheRise API is running");
});
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `Server running on port ${process.env.PORT || 5000}`
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });