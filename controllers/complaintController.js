const Complaint = require("../models/Complaint");

exports.createComplaint = async (req, res) => {
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
exports.getComplaintsById = async (req, res) => {
    try {
        const complaints = await Complaint.findById(req.params.id);
        if (!complaints) {
            return res.status(404).json({ message: "Complaint not found" });
        }
        res.json(complaints);
        } catch (error) {
            res.status(500).json({ error: error.message });  
    }
};

exports.updateComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }
        if (complaint.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const updated = await Complaint.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};