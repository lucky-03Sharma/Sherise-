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

exports.getMyConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ consultations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }
    if (consultation.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await consultation.deleteOne();
    res.json({ message: "Consultation deleted" });
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};
