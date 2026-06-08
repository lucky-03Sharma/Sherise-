const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

const { createConsultation, 
    getMyConsultations, 
    deleteConsultation } = require("../controllers/consultationController");

router.post("/create", protect, createConsultation);
router.get("/my", protect, getMyConsultations);
router.delete("/delete/:id", protect, deleteConsultation);
module.exports = router;