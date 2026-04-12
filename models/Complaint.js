const mongoose = require ("mongoose");

const complaintSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        name:{
            type: String ,
            required: true,
        },

        type: {
            type: String,
            enum:[
                " Sexual harassment",
                "domestic Voilence",
                "Rape",
                "Threats",
                "Mental Torture",
                "other",
            ],
            required: true,
        },

        location:{
            type: String,
        },

        isAnonymous: {
            type: Boolean ,
            default: false,
        },

        status:{
            type: String,
            enum: ["pending" , "reviewed" , "resolved"],
            default: "pending",
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("Complaint", complaintSchema);