const { DeleteObjectCommand } = require("@aws-sdk/client-s3");

const Gallery = require("../Models/Gallery");
const r2Client = require("../Config/r2Client");

const toPositiveInteger = (value, fallback) => {
  const numberValue = Number(value);

  if (!Number.isInteger(numberValue) || numberValue <= 0) {
    return fallback;
  }

  return numberValue;
};

const buildGallerySort = () => ({
  order: 1,
  createdAt: -1,
});

const buildPublicGalleryFilter = (query) => {
  const { type, category, featured } = query;

  const filter = {
    isVisible: true,
  };

  if (type && type !== "all") {
    filter.type = type;
  }

  if (category && category !== "all") {
    filter.category = category;
  }

  if (featured !== undefined && featured !== "") {
    filter.isFeatured = featured === "true";
  }

  return filter;
};

const buildAdminGalleryFilter = (query) => {
  const { search, type, category, visibility, featured } = query;

  const filter = {};

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");

    filter.$or = [
      { title: searchRegex },
      { category: searchRegex },
      { description: searchRegex },
    ];
  }

  if (type && type !== "all") {
    filter.type = type;
  }

  if (category && category !== "all") {
    filter.category = category;
  }

  if (visibility && visibility !== "all") {
    filter.isVisible = visibility === "visible";
  }

  if (featured && featured !== "all") {
    filter.isFeatured = featured === "featured";
  }

  return filter;
};

const getGalleryStats = async () => {
  const [totalItems, visibleItems, featuredItems, photoItems, videoItems] =
    await Promise.all([
      Gallery.countDocuments(),
      Gallery.countDocuments({ isVisible: true }),
      Gallery.countDocuments({ isFeatured: true }),
      Gallery.countDocuments({ type: "photo" }),
      Gallery.countDocuments({ type: "video" }),
    ]);

  return {
    totalItems,
    visibleItems,
    featuredItems,
    photoItems,
    videoItems,
  };
};

// @desc    Create gallery item
// @route   POST /api/gallery
const createGalleryItem = async (req, res) => {
  try {
    const {
      title,
      type,
      category,
      url,
      publicId,
      description,
      isFeatured,
      isVisible,
      order,
    } = req.body;

    if (!title || !type || !url) {
      return res.status(400).json({
        success: false,
        message: "Title, type, and media URL are required",
      });
    }

    const galleryItem = await Gallery.create({
      title,
      type,
      category,
      url,
      publicId,
      description,
      isFeatured,
      isVisible,
      order,
    });

    res.status(201).json({
      success: true,
      message: "Gallery item created successfully",
      data: galleryItem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create gallery item",
      error: error.message,
    });
  }
};

// @desc    Get visible gallery items
// @route   GET /api/gallery
const getGalleryItems = async (req, res) => {
  try {
    const page = toPositiveInteger(req.query.page, 1);
    const limit = Math.min(toPositiveInteger(req.query.limit, 16), 48);
    const skip = (page - 1) * limit;

    const filter = buildPublicGalleryFilter(req.query);

    const [galleryItems, total] = await Promise.all([
      Gallery.find(filter).sort(buildGallerySort()).skip(skip).limit(limit),
      Gallery.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;

    res.status(200).json({
      success: true,
      count: galleryItems.length,
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      nextPage: hasNextPage ? page + 1 : null,
      data: galleryItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch gallery items",
      error: error.message,
    });
  }
};

// @desc    Get all gallery items for admin with pagination
// @route   GET /api/gallery/admin/all
const getAllGalleryItemsForAdmin = async (req, res) => {
  try {
    const page = toPositiveInteger(req.query.page, 1);
    const limit = Math.min(toPositiveInteger(req.query.limit, 12), 36);
    const skip = (page - 1) * limit;

    const filter = buildAdminGalleryFilter(req.query);

    const [galleryItems, total, stats] = await Promise.all([
      Gallery.find(filter).sort(buildGallerySort()).skip(skip).limit(limit),
      Gallery.countDocuments(filter),
      getGalleryStats(),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    res.status(200).json({
      success: true,
      count: galleryItems.length,
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      nextPage: hasNextPage ? page + 1 : null,
      previousPage: hasPreviousPage ? page - 1 : null,
      stats,
      data: galleryItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all gallery items",
      error: error.message,
    });
  }
};

// @desc    Get single gallery item
// @route   GET /api/gallery/:id
const getGalleryItemById = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: galleryItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch gallery item",
      error: error.message,
    });
  }
};

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
const updateGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Gallery item updated successfully",
      data: galleryItem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update gallery item",
      error: error.message,
    });
  }
};

const deleteMediaFromR2 = async (objectKey) => {
  if (!objectKey) {
    return;
  }

  if (!process.env.R2_BUCKET_NAME) {
    throw new Error("R2_BUCKET_NAME is missing");
  }

  const deleteCommand = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: objectKey,
  });

  await r2Client.send(deleteCommand);
};

// @desc    Delete gallery item from MongoDB and Cloudflare R2
// @route   DELETE /api/gallery/:id
const deleteGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    if (galleryItem.publicId) {
      await deleteMediaFromR2(galleryItem.publicId);
    }

    await Gallery.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Gallery item and media deleted successfully",
    });
  } catch (error) {
    console.error("Delete Gallery Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete gallery item",
      error: error.message,
    });
  }
};

module.exports = {
  createGalleryItem,
  getGalleryItems,
  getAllGalleryItemsForAdmin,
  getGalleryItemById,
  updateGalleryItem,
  deleteGalleryItem,
};