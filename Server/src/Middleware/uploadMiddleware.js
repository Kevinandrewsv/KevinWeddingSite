const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
const multer = require("multer");

const TEMP_UPLOAD_DIR = path.join(os.tmpdir(), "wedding-invitation-uploads");

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 150 * 1024 * 1024;
const MAX_UPLOAD_SIZE = MAX_VIDEO_SIZE;

const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

const VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/mov",
];

const ALLOWED_MIME_TYPES = [...IMAGE_MIME_TYPES, ...VIDEO_MIME_TYPES];

const ensureTempUploadDir = () => {
  if (!fs.existsSync(TEMP_UPLOAD_DIR)) {
    fs.mkdirSync(TEMP_UPLOAD_DIR, { recursive: true });
  }
};

const getFileExtension = (fileName = "") => {
  return path.extname(fileName).toLowerCase();
};

const getFallbackExtension = (mimeType = "") => {
  const extensionMap = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "video/quicktime": ".mov",
    "video/mov": ".mov",
  };

  return extensionMap[mimeType] || "";
};

const createTempFileName = (file) => {
  const originalExtension = getFileExtension(file.originalname);
  const extension = originalExtension || getFallbackExtension(file.mimetype);
  const randomName = crypto.randomBytes(16).toString("hex");

  return `${Date.now()}-${randomName}${extension}`;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      ensureTempUploadDir();
      cb(null, TEMP_UPLOAD_DIR);
    } catch (error) {
      cb(error);
    }
  },

  filename: (req, file, cb) => {
    cb(null, createTempFileName(file));
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(
    new Error(
      "Invalid file type. Only JPG, PNG, WEBP, GIF, MP4, WEBM and MOV files are allowed."
    ),
    false
  );
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_UPLOAD_SIZE,
    files: 1,
  },
});

module.exports = {
  upload,
  IMAGE_MIME_TYPES,
  VIDEO_MIME_TYPES,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
};