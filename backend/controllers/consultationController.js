const Consultation = require("../models/Consultation");

exports.createConsultation = async (req, res) => {
  try {
    const { issue, description, category } = req.body;

    const consultation = await Consultation.create({
      userId: req.user.id,
      issue,
      description,
      category,
    });

    res.status(201).json({
      message: "Consultation request submitted",
      consultation,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};