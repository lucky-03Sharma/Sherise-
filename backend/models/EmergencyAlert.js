const mongoose = require("mongoose");

const locationPointSchema = new mongoose.Schema(
  {
    latitude: Number,
    longitude: Number,
    accuracy: Number,
    recordedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const emergencyAlertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: String,
    helplineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Helpline",
    },
    helplineName: String,
    helplinePhone: String,
    category: String,
    triggerType: {
      type: String,
      enum: ["manual_call", "voice_help"],
      default: "manual_call",
    },
    latitude: Number,
    longitude: Number,
    accuracy: Number,
    mapsLink: String,
    locationHistory: [locationPointSchema],
    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
    },
    endedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmergencyAlert", emergencyAlertSchema);
