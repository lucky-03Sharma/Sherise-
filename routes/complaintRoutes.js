const express = require("express");
const router = express.Router();
const { createComplaint } = require("../controllers/complaintController");
const protect = require("../middlewares/authMiddleware");
const { create } = require("../models/User");

router.post("/create", protect , createComplaint);
module.exports = router;