const express = require("express");
const router = express.Router();

const {
  createHelpline,
  getHelplines
} = require("../controllers/helplineController");

router.post("/create", createHelpline); 
router.get("/", getHelplines);

module.exports = router;