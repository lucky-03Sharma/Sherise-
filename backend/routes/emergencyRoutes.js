const express = require("express");
const router = express.Router();
const { protect, optionalAuth } = require("../middlewares/authMiddleware");
const {
  startEmergencyCall,
  updateLiveLocation,
  endEmergencyCall,
  getMyEmergencyAlerts,
  getActiveEmergencyAlerts,
  getNearestPoliceHelpline,
  triggerVoiceHelp,
  triggerSOS,
} = require("../controllers/emergencyController");

// Public / Guest-enabled Emergency Actions (Never block emergency requests!)
router.post("/call", optionalAuth, startEmergencyCall);
router.post("/voice-help", optionalAuth, triggerVoiceHelp);
router.post("/sos", optionalAuth, triggerSOS);
router.put("/:id/location", optionalAuth, updateLiveLocation);
router.put("/:id/end", optionalAuth, endEmergencyCall);
router.get("/nearest-police", optionalAuth, getNearestPoliceHelpline);

// User-authenticated emergency history & admin active alerts
router.get("/my", protect, getMyEmergencyAlerts);
router.get("/active", protect, getActiveEmergencyAlerts);

module.exports = router;
