const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

const { createSession,
     getTherapists,
     getMySessions,
     deleteSession,
     addRating
     } = require("../controllers/therapyController");

router.get("/", getTherapists);
router.post("/create", protect, createSession);
router.get("/my", protect, getMySessions);
router.delete("/:id", protect, deleteSession);
router.post("/:id/rating", protect, addRating);

module.exports = router;