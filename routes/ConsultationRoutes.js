const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

const {createConsultation} = require("../controllers/consultationController");

router.post("/create" , protect , createConsultation);
module.exports = router;