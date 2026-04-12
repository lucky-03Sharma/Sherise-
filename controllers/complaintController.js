const Complaint = require("../models/Complaint");

const createComplaint = async (req, res) => {
    try {
        const { name, type, description, location, isAnonymous } = req.body;

        const complaint = await Complaint.create({
            userId: req.user.id,
            name,
            type,
            description,
            location,
            isAnonymous,
        });
        res.status(201).json({
            message: "Complaint registered successfully",
            complaint,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createComplaint };