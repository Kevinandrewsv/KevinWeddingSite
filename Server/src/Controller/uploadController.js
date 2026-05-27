const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { PutObjectCommand } = require("@aws-sdk/client-s3");

const r2Client = require("../Config/r2Client");
const {
  IMAGE_MIME_TYPES,
  VIDEO_MIME_TYPES,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
} = require("../Middleware/uploadMiddleware");

const getFileExtension = (fileName) => {
  return path.extname(fileName || "").toLowerCase();
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

const createSafeFileName = (file) => {
  const originalExtension = getFileExtension(file.originalname);
  const extension = originalExtension || getFallbackExtension(file.mimetype);
  const randomName = crypto.randomBytes(16).toString("hex");

  return `${Date.now()}-${randomName}${extension}`;
};

const getEnvValue = (key) => {
  const value = process.env[key];

  if (!value) return "";
  return value.trim();
};

const getMissingR2EnvKeys = () => {
  const requiredKeys = [
    "R2_ACCOUNT_ID",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_BUCKET_NAME",
    "R2_PUBLIC_URL",
  ];

  return requiredKeys.filter((key) => !getEnvValue(key));
};

const deleteTempFile = async (filePath) => {
  if (!filePath) return;

  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Temp file cleanup failed:", error.message);
    }
  }
};

const formatFileSize = (bytes) => {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(0)} MB`;
};

const validateUploadedFile = (file) => {
  if (!file) {
    return {
      isValid: false,
      statusCode: 400,
      message: "Please upload an image or video file.",
    };
  }

  const isImage = IMAGE_MIME_TYPES.includes(file.mimetype);
  const isVideo = VIDEO_MIME_TYPES.includes(file.mimetype);

  if (!isImage && !isVideo) {
    return {
      isValid: false,
      statusCode: 400,
      message:
        "Invalid file type. Only JPG, PNG, WEBP, GIF, MP4, WEBM and MOV files are allowed.",
    };
  }

  if (isImage && file.size > MAX_IMAGE_SIZE) {
    return {
      isValid: false,
      statusCode: 400,
      message: `Image is too large. Maximum allowed image size is ${formatFileSize(
        MAX_IMAGE_SIZE
      )}.`,
    };
  }

  if (isVideo && file.size > MAX_VIDEO_SIZE) {
    return {
      isValid: false,
      statusCode: 400,
      message: `Video is too large. Maximum allowed video size is ${formatFileSize(
        MAX_VIDEO_SIZE
      )}.`,
    };
  }

  return {
    isValid: true,
    type: isVideo ? "video" : "photo",
    folderName: isVideo ? "videos" : "images",
  };
};

const uploadMedia = async (req, res) => {
  const tempFilePath = req.file?.path;

  try {
    const missingKeys = getMissingR2EnvKeys();

    if (missingKeys.length > 0) {
      await deleteTempFile(tempFilePath);

      return res.status(500).json({
        success: false,
        message: "Cloudflare R2 environment variables are missing.",
        missingKeys,
      });
    }

    const validation = validateUploadedFile(req.file);

    if (!validation.isValid) {
      await deleteTempFile(tempFilePath);

      return res.status(validation.statusCode).json({
        success: false,
        message: validation.message,
      });
    }

    const fileName = createSafeFileName(req.file);
    const objectKey = `wedding-gallery/${validation.folderName}/${fileName}`;
    const fileStream = fs.createReadStream(tempFilePath);

    const uploadCommand = new PutObjectCommand({
      Bucket: getEnvValue("R2_BUCKET_NAME"),
      Key: objectKey,
      Body: fileStream,
      ContentType: req.file.mimetype,
      ContentLength: req.file.size,
      Metadata: {
        originalName: encodeURIComponent(req.file.originalname || "media"),
        uploadedAt: new Date().toISOString(),
      },
    });

    await r2Client.send(uploadCommand);

    const cleanPublicUrl = getEnvValue("R2_PUBLIC_URL").replace(/\/$/, "");
    const fileUrl = `${cleanPublicUrl}/${objectKey}`;

    await deleteTempFile(tempFilePath);

    return res.status(200).json({
      success: true,
      message: "Media uploaded successfully.",
      data: {
        url: fileUrl,
        publicId: objectKey,
        type: validation.type,
        storage: "cloudflare-r2",
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
    });
  } catch (error) {
    await deleteTempFile(tempFilePath);

    console.error("R2 Upload Error Full:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload media to Cloudflare R2.",
      error: error.message,
      errorName: error.name,
    });
  }
};

module.exports = {
  uploadMedia,
};