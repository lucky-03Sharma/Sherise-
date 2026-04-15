const mongoose = require("mongoose");

const threapySessionSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId ,
        ref: "User",
        required: true ,
      },

      psychologistName : {
        type: String,
      },

      issueType: {
        type: String,
        enum: ["anxiety" , "depression" , "trauma" , "stress" , "other"],
        required: true,
      },

      description: {
        type: String,
        required: true,
      },

      sessionDate: {
        type: Date,
      },

      status: {
        type: String,
        enum: ["requested" , "scheduled" , "completed" , "cancelled"],
        default: "requested" ,
      },

      notes: {
        type: String,
      }
    },
    {timestamps: true}
);

module.exports = mongoose.model("ThreapySession" , therapySessionSchema);