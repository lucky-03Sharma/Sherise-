const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadRoot = path.join(__dirname, "../uploads");

["images", "videos", "voice"].forEach((folder) => {
  const dir = path.join(uploadRoot, folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "images") {
      cb(null, path.join(uploadRoot, "images"));
      return;
    }
    if (file.fieldname === "videos") {
      cb(null, path.join(uploadRoot, "videos"));
      return;
    }
    if (file.fieldname === "voiceNote") {
      cb(null, path.join(uploadRoot, "voice"));
      return;
    }
    cb(new Error("Unexpected upload field"));
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === "images") {
    const allowed = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    cb(null, allowed.includes(ext));
    return;
  }

  if (file.fieldname === "videos") {
    const allowed = [".mp4", ".webm", ".mov", ".avi", ".mkv"];
    cb(null, allowed.includes(ext));
    return;
  }

  if (file.fieldname === "voiceNote") {
    const allowed = [".webm", ".ogg", ".mp3", ".wav", ".m4a"];
    cb(null, allowed.includes(ext) || file.mimetype.startsWith("audio/"));
    return;
  }

  cb(new Error("Invalid upload field"));
};

const complaintUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
}).fields([
  { name: "images", maxCount: 5 },
  { name: "videos", maxCount: 1 },
  { name: "voiceNote", maxCount: 2 },
]);

module.exports = { complaintUpload, uploadRoot };
