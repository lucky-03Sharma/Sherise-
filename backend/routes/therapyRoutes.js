const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

const { createSession, getTherapists } = require("../controllers/therapyController");

router.get("/", getTherapists);
router.post("/create", protect, createSession);

module.exports = router;