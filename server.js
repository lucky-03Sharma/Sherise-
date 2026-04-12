const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwtwebtoken = require("jsonwebtoken");
const dotenv = require("dotenv");
const complaintRoutes = require("./routes/complaintRoutes");
const authRoutes = require("./routes/authRoutes");
dotenv.config();
const app = express();
app.use(express.json());
app.use("/api/complaints", complaintRoutes);
app.use("/api/auth", authRoutes);
app.get("/" , (req , res)=>{
    res.send("SheRise API is running");
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.log(err));

