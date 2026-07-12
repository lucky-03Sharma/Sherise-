const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const {
  startEmergencyCall,
  updateLiveLocation,
  endEmergencyCall,
  getMyEmergencyAlerts,
  getActiveEmergencyAlerts,
  getNearestPoliceHelpline,
  triggerVoiceHelp,
} = require("../controllers/emergencyController");

router.post("/call", protect, startEmergencyCall);
router.post("/voice-help", protect, triggerVoiceHelp);
router.put("/:id/location", protect, updateLiveLocation);
router.put("/:id/end", protect, endEmergencyCall);
router.get("/my", protect, getMyEmergencyAlerts);
router.get("/active", protect, getActiveEmergencyAlerts);
router.get("/nearest-police", protect, getNearestPoliceHelpline);

module.exports = router;
