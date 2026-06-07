const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

const { createConsultation, getMyConsultations } = require("../controllers/consultationController");

router.post("/create", protect, createConsultation);
router.get("/my", protect, getMyConsultations);
module.exports = router;