const express = require("express");
const multer = require("multer");

const { uploadMedia } = require("../Controller/uploadController");
const { upload, MAX_VIDEO_SIZE } = require("../Middleware/uploadMiddleware");
const { protectAdmin } = require("../Middleware/authMiddleware");

const router = express.Router();

const formatFileSize = (bytes) => {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(0)} MB`;
};

const handleMulterUpload = (req, res, next) => {
  upload.single("media")(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: `File is too large. Maximum allowed upload size is ${formatFileSize(
            MAX_VIDEO_SIZE
          )}.`,
        });
      }

      if (error.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({
          success: false,
          message: "Only one file can be uploaded at a time.",
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message || "File upload failed.",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message || "File upload failed.",
    });
  });
};

router.post("/media", protectAdmin, handleMulterUpload, uploadMedia);

module.exports = router;