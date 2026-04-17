const TherapySession = require("../models/TherapySession");

exports.createSession = async (req, res) => {
    try {
        const { issueType, description, sessionDate } = req.body;

        const session = await TherapySession.create({
            userId: req.user.id,
            issueType,
            description,
            sessionDate,
        });

        res.status(201).json({
            message: "Therapy session requested",
            session,
        });

    } catch (err) {
        res.status(500).json({ error: error.message });

    }

};