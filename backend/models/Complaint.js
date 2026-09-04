const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "Sexual harassment",
        "Domestic Violence",
        "Rape",
        "Threats",
        "Mental Torture",
        "Other",
      ],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
    },

    latitude: {
      type: Number,
    },

    longitude: {
      type: Number,
    },

    images: [
      {
        type: String,
      },
    ],

    videos: [
      {
        type: String,
      },
    ],

    voiceNote: {
      type: String,
    },

    isAnonymous: {
      type: Boolean,
      default: false,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    severityScore: {
      type: Number,
      default: 0,
    },

    severityTerms: [
      {
        type: String,
      },
    ],

    statusHistory: [
      {
        status: {
          type: String,
          enum: ["pending", "reviewed", "resolved"],
          default: "pending",
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        note: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);