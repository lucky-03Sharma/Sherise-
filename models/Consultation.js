const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.types.objectId,
            ref: "User",
            required: true ,
        },
        issue: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
      type: String,
      enum: ["legal", "mental", "domestic", "harassment"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "resolved"],
      default: "pending",
    },
    response: {
      type: String,
      default: "",
    }
    },
    {timestamps: true}
);

module.exports = mongoose.model("Consultation" , consultationSchema);