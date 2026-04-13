const express = require("express");
const router = express.Router();
const { createComplaint , getComplaintsById , updateComplaint } = require("../controllers/complaintController");
const protect = require("../middlewares/authMiddleware");
const { create } = require("../models/User");
router.get("/:id", getComplaintsById);
router.put("/:id", updateComplaint);
router.post("/create", protect , createComplaint);
module.exports = router;