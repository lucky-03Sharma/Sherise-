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

const THERAPISTS = [
    {
        name: "Dr. Shrradha Sidhwani",
        specialization: "Clinical Psychologist",
        bestFor: [
            "Stress & Burnout",
            "Anxiety & Panic",
            "Trauma & Abuse",
            "Anger Management",
            "Women's Mental Health",
        ],
        problems: ["stress", "anxiety", "trauma", "anger", "women"],
    },
    {
        name: "Dr. Harish Shetty",
        specialization: "Psychiatrist",
        bestFor: ["Depression", "Anxiety & Panic", "Adolescents", "Family Therapy"],
        problems: ["depression", "anxiety", "adolescents", "family"],
    },
    {
        name: "Dr. Sonali Gupta",
        specialization: "Clinical Psychologist",
        bestFor: ["Trauma & Abuse", "Grief", "Relationships", "Emotional Wellness", "Women's Mental Health"],
        problems: ["trauma", "grief", "relationships", "women"],
    },
    {
        name: "Dr. Samir Parikh",
        specialization: "Psychiatrist",
        bestFor: ["Stress & Burnout", "Depression", "Workplace Mental Health"],
        problems: ["stress", "depression", "workplace"],
    },
    {
        name: "Dr. Anand Nadkarni",
        specialization: "Psychiatrist",
        bestFor: ["Family Therapy", "Stress & Burnout", "Organizational Psychology"],
        problems: ["family", "stress", "organizational"],
    },
    {
        name: "Dr. Kamna Chhibber",
        specialization: "Clinical Psychologist",
        bestFor: ["Trauma & Abuse", "Relationships", "Women's Mental Health"],
        problems: ["trauma", "relationships", "women"],
    },
    {
        name: "Dr. Amit Malik",
        specialization: "Psychiatrist",
        bestFor: ["Anxiety & Panic", "OCD", "Depression"],
        problems: ["anxiety", "ocd", "depression"],
    },
    {
        name: "Dr. Avinash De Sousa",
        specialization: "Psychiatrist",
        bestFor: ["Addiction", "Anxiety & Panic", "Depression", "Stress"],
        problems: ["addiction", "anxiety", "depression", "stress"],
    },
];

const normalizeProblem = (value) =>
    (value || "")
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();

const matchesProblem = (therapistProblems, query) => {
    const normalizedQuery = normalizeProblem(query);
    return therapistProblems.some((problem) => {
        const normalizedProblem = normalizeProblem(problem);
        return (
            normalizedProblem === normalizedQuery ||
            normalizedProblem.includes(normalizedQuery) ||
            normalizedQuery.includes(normalizedProblem)
        );
    });
};

exports.getTherapists = async (req, res) => {
    try {
        let therapists = THERAPISTS;
        const { problem } = req.query;

        if (problem) {
            therapists = therapists.filter((therapist) =>
                matchesProblem(therapist.problems, problem)
            );
        }

        res.json(therapists);
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
