const TherapySession = require("../models/TherapySession");

const haversineKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const THERAPISTS = [
  {
    id: "th-1",
    name: "Dr. Shrradha Sidhwani",
    specialization: "Clinical Psychologist",
    clinicName: "Mind Body Wellness Clinic",
    address: "Bandra West, Mumbai",
    city: "Mumbai",
    latitude: 19.0596,
    longitude: 72.8295,
    experience: "14+ years",
    rating: 4.9,
    reviewsCount: 142,
    fee: "₹1,500",
    modes: ["In-Clinic", "Video Call"],
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
    id: "th-2",
    name: "Dr. Harish Shetty",
    specialization: "Senior Psychiatrist",
    clinicName: "Dr. L.H. Hiranandani Hospital",
    address: "Powai, Mumbai",
    city: "Mumbai",
    latitude: 19.1197,
    longitude: 72.9051,
    experience: "25+ years",
    rating: 4.9,
    reviewsCount: 310,
    fee: "₹2,000",
    modes: ["In-Clinic", "Video Call"],
    bestFor: ["Depression", "Anxiety & Panic", "Adolescents", "Family Therapy"],
    problems: ["depression", "anxiety", "adolescents", "family"],
  },
  {
    id: "th-3",
    name: "Dr. Sonali Gupta",
    specialization: "Clinical Psychologist",
    clinicName: "Vandrevala Foundation Partner Clinic",
    address: "Khar West, Mumbai",
    city: "Mumbai",
    latitude: 19.07,
    longitude: 72.8338,
    experience: "16+ years",
    rating: 4.8,
    reviewsCount: 188,
    fee: "₹1,800",
    modes: ["In-Clinic", "Video Call"],
    bestFor: [
      "Trauma & Abuse",
      "Grief",
      "Relationships",
      "Emotional Wellness",
      "Women's Mental Health",
    ],
    problems: ["trauma", "grief", "relationships", "women"],
  },
  {
    id: "th-4",
    name: "Dr. Samir Parikh",
    specialization: "Director & Senior Psychiatrist",
    clinicName: "Fortis Healthcare Mental Health",
    address: "Okhla, New Delhi",
    city: "New Delhi",
    latitude: 28.5355,
    longitude: 77.2732,
    experience: "22+ years",
    rating: 4.9,
    reviewsCount: 420,
    fee: "₹2,200",
    modes: ["In-Clinic", "Video Call"],
    bestFor: ["Stress & Burnout", "Depression", "Workplace Mental Health"],
    problems: ["stress", "depression", "workplace"],
  },
  {
    id: "th-5",
    name: "Dr. Kamna Chhibber",
    specialization: "Clinical Psychologist & Author",
    clinicName: "Fortis Escorts Clinic",
    address: "South Extension, New Delhi",
    city: "New Delhi",
    latitude: 28.57,
    longitude: 77.22,
    experience: "15+ years",
    rating: 4.8,
    reviewsCount: 165,
    fee: "₹1,600",
    modes: ["In-Clinic", "Video Call"],
    bestFor: ["Trauma & Abuse", "Relationships", "Women's Mental Health"],
    problems: ["trauma", "relationships", "women"],
  },
  {
    id: "th-6",
    name: "Dr. Anand Nadkarni",
    specialization: "Consultant Psychiatrist & Founder",
    clinicName: "Institute for Psychological Health (IPH)",
    address: "Thane West, Maharashtra",
    city: "Thane",
    latitude: 19.197,
    longitude: 72.9634,
    experience: "30+ years",
    rating: 4.9,
    reviewsCount: 512,
    fee: "₹1,500",
    modes: ["In-Clinic", "Video Call"],
    bestFor: ["Family Therapy", "Stress & Burnout", "Organizational Psychology"],
    problems: ["family", "stress", "organizational"],
  },
  {
    id: "th-7",
    name: "Dr. Amit Malik",
    specialization: "Psychiatrist & Healthcare Leader",
    clinicName: "Amaha Mind Care",
    address: "Indiranagar, Bengaluru",
    city: "Bengaluru",
    latitude: 12.9716,
    longitude: 77.6412,
    experience: "18+ years",
    rating: 4.8,
    reviewsCount: 230,
    fee: "₹1,800",
    modes: ["In-Clinic", "Video Call"],
    bestFor: ["Anxiety & Panic", "OCD", "Depression"],
    problems: ["anxiety", "ocd", "depression"],
  },
  {
    id: "th-8",
    name: "Dr. Avinash De Sousa",
    specialization: "Consultant Psychiatrist & Psychotherapist",
    clinicName: "De Sousa Foundation Clinic",
    address: "Santacruz West, Mumbai",
    city: "Mumbai",
    latitude: 19.0805,
    longitude: 72.836,
    experience: "20+ years",
    rating: 4.9,
    reviewsCount: 290,
    fee: "₹1,700",
    modes: ["In-Clinic", "Video Call"],
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
    let therapists = THERAPISTS.map((t) => ({ ...t }));
    const { problem, latitude, longitude, nearMe } = req.query;

    if (problem) {
      therapists = therapists.filter((therapist) =>
        matchesProblem(therapist.problems, problem)
      );
    }

    const userLat =
      latitude !== undefined && latitude !== "" ? parseFloat(latitude) : null;
    const userLng =
      longitude !== undefined && longitude !== "" ? parseFloat(longitude) : null;

    if (
      userLat !== null &&
      userLng !== null &&
      !isNaN(userLat) &&
      !isNaN(userLng)
    ) {
      therapists = therapists.map((t) => {
        const km = haversineKm(userLat, userLng, t.latitude, t.longitude);
        const roundedKm = Math.round(km * 10) / 10;
        return {
          ...t,
          distanceKm: roundedKm,
          distanceLabel:
            roundedKm < 1
              ? `${Math.round(roundedKm * 1000)} m away`
              : `${roundedKm} km away`,
        };
      });

      if (nearMe === "true" || nearMe === true || nearMe === "1") {
        therapists.sort((a, b) => a.distanceKm - b.distanceKm);
      }
    }

    res.json(therapists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSession = async (req, res) => {
  try {
    const {
      psychologistName,
      issueType,
      description,
      sessionDate,
      timeSlot,
      mode,
    } = req.body;

    if (!psychologistName || !issueType || !description || !sessionDate) {
      return res.status(400).json({
        message:
          "Therapist, issue type, description, and appointment date are required",
      });
    }

    const parsedDate = new Date(sessionDate);
    if (Number.isNaN(parsedDate.getTime()) || parsedDate <= new Date()) {
      return res.status(400).json({
        message: "Please choose a valid future appointment date",
      });
    }

    const sessionNotes = [
      mode ? `Mode: ${mode}` : null,
      timeSlot ? `Time: ${timeSlot}` : null,
    ]
      .filter(Boolean)
      .join(" • ");

    const session = await TherapySession.create({
      userId: req.user.id,
      psychologistName,
      issueType,
      description,
      sessionDate: parsedDate,
      notes: sessionNotes || undefined,
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
