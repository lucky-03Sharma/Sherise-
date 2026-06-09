const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const consultationController = require("../controllers/consultationController");
console.log(consultationController);

router.post("/create", protect, consultationController.createConsultation);

router.get("/my", protect, consultationController.getMyConsultations);

router.delete("/delete/:id", (req, res) => {
  res.json({ message: "Delete route working" });
});

module.exports = router;