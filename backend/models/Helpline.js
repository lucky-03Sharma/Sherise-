const mongoose = require("mongoose");

const helplineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["police", "legal", "mental", "domestic", "ngo", "sherise"],
      required: true,
    },

    description: {
      type: String,
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

    isEmergency: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Helpline", helplineSchema);