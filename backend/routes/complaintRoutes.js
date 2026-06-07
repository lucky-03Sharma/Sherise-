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

router.get("/", getAllComplaints);
router.post("/create", protect, createComplaint);
router.get("/my", protect, getMyComplaints);
router.get("/:id", getComplaintsById);
router.put("/:id", protect, updateComplaint);
router.delete("/:id", protect, deleteComplaint);
module.exports = router;