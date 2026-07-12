const express = require("express");
const router = express.Router();
const {
  createComplaint,
  getAllComplaints,
  getComplaintsById,
  getMyComplaints,
  updateComplaint,
  deleteComplaint,
} = require("../controllers/complaintController");
const protect = require("../middlewares/authMiddleware");
const { complaintUpload } = require("../middlewares/upload");

router.get("/", getAllComplaints);
router.post("/create", protect, complaintUpload, createComplaint);
router.get("/my", protect, getMyComplaints);
router.get("/:id", getComplaintsById);
router.put("/:id", protect, updateComplaint);
router.delete("/:id", protect, deleteComplaint);
module.exports = router;