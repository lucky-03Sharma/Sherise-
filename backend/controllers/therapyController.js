const TherapySession = require("../models/TherapySession");

exports.createSession = async (req, res) => {
    try {
        const { psychologistName, issueType, description, sessionDate } = req.body;

        if (!psychologistName || !issueType || !description || !sessionDate) {
            return res.status(400).json({
                message: "Therapist, issue type, description, and appointment date are required",
            });
        }

        const parsedDate = new Date(sessionDate);
        if (Number.isNaN(parsedDate.getTime()) || parsedDate <= new Date()) {
            return res.status(400).json({
                message: "Please choose a valid future appointment date",
            });
        }

        const session = await TherapySession.create({
            userId: req.user.id,
            psychologistName,
            issueType,
            description,
            sessionDate: parsedDate,
            status: "requested",
        });

        res.status(201).json({
            message: "Therapy session booked successfully",
            session,
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTherapists = async (req, res) => {
    try {
        res.json([
            { name: "Dr. Priya Sharma", specialization: "Anxiety & Stress" },
            { name: "Dr. Neha Verma", specialization: "Trauma Recovery" },
        ]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getMySessions = async (req, res) => {
  try {
    const sessions = await TherapySession.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({ sessions });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteSession = async (req, res) => {
  try {
    const session = await TherapySession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    if (session.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await session.deleteOne();

    res.json({
      message: "Session deleted successfully",
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addRating = async (req, res) => {
  try {
    const { rating, review } = req.body;

    const session = await TherapySession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    if (session.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    if (session.status !== "completed") {
      return res.status(400).json({
        message: "You can only rate completed sessions",
      });
    }

    session.rating = rating;
    session.review = review;

    await session.save();

    res.json({
      message: "Rating submitted successfully",
      session,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
