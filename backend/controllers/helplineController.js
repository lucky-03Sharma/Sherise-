const Helpline = require("../models/Helpline");

// Add helpline only for admin
exports.createHelpline = async (req, res) => {
  try {
    const helpline = await Helpline.create(req.body);

    res.status(201).json({
      message: "Helpline added",
      helpline,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all helplines
exports.getHelplines = async (req, res) => {
  try {
    const helplines = await Helpline.find();

    res.json(helplines);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};