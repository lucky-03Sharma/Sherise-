const EmergencyAlert = require("../models/EmergencyAlert");
const Helpline = require("../models/Helpline");
const User = require("../models/User");

const toMapsLink = (latitude, longitude) =>
  `https://www.google.com/maps?q=${latitude},${longitude}`;

const haversineKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const DEFAULT_HELPLINES = [
  {
    name: "National Emergency Police (112)",
    phone: "112",
    category: "police",
    isEmergency: true,
    location: "National Emergency Response Support System",
  },
  {
    name: "Women in Distress Helpline",
    phone: "1091",
    category: "police",
    isEmergency: true,
    location: "National Women Police Cell",
  },
  {
    name: "SheRise Rapid Response Team",
    phone: "181",
    category: "sherise",
    isEmergency: true,
    location: "SheRise Dedicated Member Support",
  },
];

const pickNearestHelpline = (helplines = [], latitude, longitude, preference = "any") => {
  const merged = [...(helplines || []), ...DEFAULT_HELPLINES];

  let pool = merged;
  if (preference === "police") {
    pool = merged.filter((h) => h.category === "police");
  } else if (preference === "sherise") {
    pool = merged.filter((h) => h.category === "sherise");
  } else if (preference === "support") {
    pool = merged.filter((h) => h.category === "police" || h.category === "sherise" || h.isEmergency);
  }

  if (!pool.length) pool = merged;

  const withCoords = pool.filter(
    (h) => typeof h.latitude === "number" && typeof h.longitude === "number"
  );

  if (withCoords.length && typeof latitude === "number" && typeof longitude === "number") {
    return withCoords.sort(
      (a, b) =>
        haversineKm(latitude, longitude, a.latitude, a.longitude) -
        haversineKm(latitude, longitude, b.latitude, b.longitude)
    )[0];
  }

  return (
    pool.find((h) => h.isEmergency) ||
    pool[0] ||
    DEFAULT_HELPLINES[0]
  );
};

exports.startEmergencyCall = async (req, res) => {
  try {
    const {
      helplineId,
      helplineName,
      helplinePhone,
      category,
      latitude,
      longitude,
      accuracy,
      triggerType,
    } = req.body;

    if (!helplinePhone) {
      return res.status(400).json({ message: "Helpline phone is required" });
    }

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        message: "GPS location is required to share live location with responders",
      });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);
    const user = await User.findById(req.user.id);

    const alert = await EmergencyAlert.create({
      userId: req.user.id,
      userName: user?.name,
      helplineId: helplineId || undefined,
      helplineName,
      helplinePhone,
      category,
      triggerType: triggerType || "manual_call",
      latitude: lat,
      longitude: lng,
      accuracy: accuracy ? Number(accuracy) : undefined,
      mapsLink: toMapsLink(lat, lng),
      locationHistory: [
        {
          latitude: lat,
          longitude: lng,
          accuracy: accuracy ? Number(accuracy) : undefined,
          recordedAt: new Date(),
        },
      ],
      status: "active",
    });

    res.status(201).json({
      message: "Live location shared with helpline centre",
      alert,
      dialNumber: helplinePhone.replace(/\s/g, ""),
      mapsLink: alert.mapsLink,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateLiveLocation = async (req, res) => {
  try {
    const alert = await EmergencyAlert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: "Emergency alert not found" });
    }

    if (alert.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (alert.status !== "active") {
      return res.status(400).json({ message: "This emergency session has ended" });
    }

    const { latitude, longitude, accuracy } = req.body;
    const lat = Number(latitude);
    const lng = Number(longitude);

    alert.latitude = lat;
    alert.longitude = lng;
    alert.accuracy = accuracy ? Number(accuracy) : alert.accuracy;
    alert.mapsLink = toMapsLink(lat, lng);
    alert.locationHistory.push({
      latitude: lat,
      longitude: lng,
      accuracy: accuracy ? Number(accuracy) : undefined,
      recordedAt: new Date(),
    });

    await alert.save();

    res.json({
      message: "Live location updated",
      alert,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.endEmergencyCall = async (req, res) => {
  try {
    const alert = await EmergencyAlert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: "Emergency alert not found" });
    }

    if (alert.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    alert.status = "ended";
    alert.endedAt = new Date();
    await alert.save();

    res.json({ message: "Live location sharing stopped", alert });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyEmergencyAlerts = async (req, res) => {
  try {
    const alerts = await EmergencyAlert.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json({ alerts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getActiveEmergencyAlerts = async (req, res) => {
  try {
    const alerts = await EmergencyAlert.find({ status: "active" })
      .sort({ updatedAt: -1 })
      .populate("userId", "name email")
      .populate("helplineId", "name phone category");

    res.json({ alerts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNearestPoliceHelpline = async (req, res) => {
  try {
    const latitude = Number(req.query.latitude);
    const longitude = Number(req.query.longitude);

    const helplines = await Helpline.find();
    const nearest = pickNearestHelpline(helplines, latitude, longitude, true);

    if (!nearest) {
      return res.status(404).json({ message: "No police helpline found" });
    }

    res.json({ helpline: nearest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.triggerVoiceHelp = async (req, res) => {
  try {
    const { latitude, longitude, accuracy } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: "GPS location is required" });
    }

    const helplines = await Helpline.find();
    const nearestPolice = pickNearestHelpline(
      helplines,
      Number(latitude),
      Number(longitude),
      true
    );

    if (!nearestPolice) {
      return res.status(404).json({ message: "No police helpline available" });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);
    const user = await User.findById(req.user.id);

    const alert = await EmergencyAlert.create({
      userId: req.user.id,
      userName: user?.name,
      helplineId: nearestPolice._id,
      helplineName: nearestPolice.name,
      helplinePhone: nearestPolice.phone,
      category: nearestPolice.category,
      triggerType: "voice_help",
      latitude: lat,
      longitude: lng,
      accuracy: accuracy ? Number(accuracy) : undefined,
      mapsLink: toMapsLink(lat, lng),
      locationHistory: [
        {
          latitude: lat,
          longitude: lng,
          accuracy: accuracy ? Number(accuracy) : undefined,
          recordedAt: new Date(),
        },
      ],
      status: "active",
    });

    res.status(201).json({
      message: "Voice SOS detected — nearest police station alerted with your live location",
      alert,
      helpline: nearestPolice,
      dialNumber: nearestPolice.phone.replace(/\s/g, ""),
      mapsLink: alert.mapsLink,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.triggerSOS = async (req, res) => {
  try {
    const { latitude, longitude, accuracy, preferredTarget = "support" } = req.body;

    const helplines = await Helpline.find();
    const nearestResponder = pickNearestHelpline(
      helplines,
      latitude !== undefined ? Number(latitude) : undefined,
      longitude !== undefined ? Number(longitude) : undefined,
      preferredTarget
    );

    const lat = latitude !== undefined ? Number(latitude) : 0;
    const lng = longitude !== undefined ? Number(longitude) : 0;
    const user = await User.findById(req.user.id);

    const alert = await EmergencyAlert.create({
      userId: req.user.id,
      userName: user?.name,
      helplineId: nearestResponder._id || undefined,
      helplineName: nearestResponder.name,
      helplinePhone: nearestResponder.phone,
      category: nearestResponder.category,
      triggerType: "sos_button",
      latitude: lat,
      longitude: lng,
      accuracy: accuracy ? Number(accuracy) : undefined,
      mapsLink: toMapsLink(lat, lng),
      locationHistory: [
        {
          latitude: lat,
          longitude: lng,
          accuracy: accuracy ? Number(accuracy) : undefined,
          recordedAt: new Date(),
        },
      ],
      status: "active",
    });

    res.status(201).json({
      message: `SOS Activated — Connecting you to nearest responder: ${nearestResponder.name}`,
      alert,
      responder: nearestResponder,
      dialNumber: nearestResponder.phone.replace(/\s/g, ""),
      mapsLink: alert.mapsLink,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

