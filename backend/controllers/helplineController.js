const Helpline = require("../models/Helpline");

// Add helpline only for admin
exports.createHelpline = async (req, res) => {
  try {

    const existingHelpline = await Helpline.findOne({ name: req.body.name });
    if (existingHelpline) {
      return res.status(400).json({ message: "Helpline with this name already exists" });
    }

    const helpline = await Helpline.create(req.body);

    res.status(201).json({
      message: "Helpline added",
      helpline,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHelplines = async (req, res) => {
  try {
    const helplines = await Helpline.find();

    res.json(helplines);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateHelpline = async (req, res) => {
  try {
    const helpline = await Helpline.findById(req.params.id);
    if (!helpline) {
      return res.status(404).json({ message: "Helpline not found" });
    };

    const updatedHelpline = await Helpline.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedHelpline);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteHelpline = async (req, res) => {
  try {
    const helpline = await Helpline.findById(req.params.id);

    if (!helpline) {
      return res.status(404).json({
        message: "Helpline not found",
      });
    }

    await helpline.deleteOne();

    res.json({
      message: "Helpline deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
