const Complaint = require("../models/Complaint");

const buildMediaPaths = (files = {}) => {
  const images = (files.images || []).map((f) => `/uploads/images/${f.filename}`);
  const videos = (files.videos || []).map((f) => `/uploads/videos/${f.filename}`);
  const voiceFile = files.voiceNote?.[0];
  const voiceNote = voiceFile ? `/uploads/voice/${voiceFile.filename}` : undefined;

  return { images, videos, voiceNote };
};

exports.createComplaint = async (req, res) => {
  try {
    const { name, type, description, location, isAnonymous, latitude, longitude } =
      req.body;

    const { images, videos, voiceNote } = buildMediaPaths(req.files);

    const complaint = await Complaint.create({
      userId: req.user.id,
      name,
      type,
      description,
      location,
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
      isAnonymous: isAnonymous === "true" || isAnonymous === true,
      images,
      videos,
      voiceNote,
      statusHistory: [{ status: "pending", note: "Complaint registered" }],
    });

    res.status(201).json({
      message: "Complaint registered successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json({ complaints });
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

exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    if (complaint.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await complaint.deleteOne();

    res.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.id });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
