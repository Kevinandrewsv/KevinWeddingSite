const CircleOfLove = require("../Models/CircleOfLove");

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const allowedSides = ["groom", "bride", "both"];

const normalizeSide = (side) => {
  if (!side) return "";
  const normalized = String(side).trim().toLowerCase();
  return allowedSides.includes(normalized) ? normalized : "";
};

const buildStats = async () => {
  const stats = await CircleOfLove.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        pending: {
          $sum: { $cond: [{ $eq: ["$isApproved", false] }, 1, 0] },
        },
        approved: {
          $sum: { $cond: [{ $eq: ["$isApproved", true] }, 1, 0] },
        },
        groom: {
          $sum: { $cond: [{ $eq: ["$side", "groom"] }, 1, 0] },
        },
        bride: {
          $sum: { $cond: [{ $eq: ["$side", "bride"] }, 1, 0] },
        },
        both: {
          $sum: { $cond: [{ $eq: ["$side", "both"] }, 1, 0] },
        },
        featured: {
          $sum: { $cond: [{ $eq: ["$isFeatured", true] }, 1, 0] },
        },
      },
    },
  ]);

  return (
    stats[0] || {
      total: 0,
      pending: 0,
      approved: 0,
      groom: 0,
      bride: 0,
      both: 0,
      featured: 0,
    }
  );
};

// @desc    Create circle of love story
// @route   POST /api/circle-of-love
// @access  Public
const createCircleStory = asyncHandler(async (req, res) => {
  const { name, side, relationship, story, phone, memoryTag } = req.body;

  if (!name || !relationship || !story) {
    res.status(400);
    throw new Error("Name, relationship, and story are required");
  }

  const normalizedSide = normalizeSide(side);

  if (!normalizedSide) {
    res.status(400);
    throw new Error("Please choose groom side, bride side, or both");
  }

  const circleStory = await CircleOfLove.create({
    name: name.trim(),
    side: normalizedSide,
    relationship: relationship.trim(),
    story: story.trim(),
    phone: phone?.trim() || "",
    memoryTag: memoryTag?.trim() || "",
    isApproved: false,
    isFeatured: false,
  });

  res.status(201).json({
    success: true,
    message: "Your Circle of Love story has been submitted for approval.",
    data: circleStory,
  });
});

// @desc    Get approved circle stories for public page
// @route   GET /api/circle-of-love
// @access  Public
const getApprovedCircleStories = asyncHandler(async (req, res) => {
  const stories = await CircleOfLove.find({ isApproved: true })
    .sort({ isFeatured: -1, createdAt: -1 })
    .limit(120);

  const grouped = {
    groom: stories.filter((item) => item.side === "groom"),
    bride: stories.filter((item) => item.side === "bride"),
    both: stories.filter((item) => item.side === "both"),
  };

  res.status(200).json({
    success: true,
    count: stories.length,
    data: stories,
    grouped,
  });
});

// @desc    Get all circle stories for admin
// @route   GET /api/circle-of-love/admin/all
// @access  Admin
const getAllCircleStoriesForAdmin = asyncHandler(async (req, res) => {
  const { status = "all", side = "all" } = req.query;

  const filter = {};

  if (status === "approved") filter.isApproved = true;
  if (status === "pending") filter.isApproved = false;
  if (allowedSides.includes(side)) filter.side = side;

  const stories = await CircleOfLove.find(filter).sort({ createdAt: -1 });
  const stats = await buildStats();

  res.status(200).json({
    success: true,
    count: stories.length,
    stats,
    data: stories,
  });
});

// @desc    Approve circle story
// @route   PATCH /api/circle-of-love/admin/:id/approve
// @access  Admin
const approveCircleStory = asyncHandler(async (req, res) => {
  const circleStory = await CircleOfLove.findById(req.params.id);

  if (!circleStory) {
    res.status(404);
    throw new Error("Circle of Love story not found");
  }

  circleStory.isApproved = true;
  await circleStory.save();

  res.status(200).json({
    success: true,
    message: "Circle of Love story approved successfully",
    data: circleStory,
  });
});

// @desc    Reject circle story
// @route   PATCH /api/circle-of-love/admin/:id/reject
// @access  Admin
const rejectCircleStory = asyncHandler(async (req, res) => {
  const circleStory = await CircleOfLove.findById(req.params.id);

  if (!circleStory) {
    res.status(404);
    throw new Error("Circle of Love story not found");
  }

  circleStory.isApproved = false;
  circleStory.isFeatured = false;
  await circleStory.save();

  res.status(200).json({
    success: true,
    message: "Circle of Love story moved to pending",
    data: circleStory,
  });
});

// @desc    Toggle featured circle story
// @route   PATCH /api/circle-of-love/admin/:id/featured
// @access  Admin
const toggleFeaturedCircleStory = asyncHandler(async (req, res) => {
  const circleStory = await CircleOfLove.findById(req.params.id);

  if (!circleStory) {
    res.status(404);
    throw new Error("Circle of Love story not found");
  }

  if (!circleStory.isApproved) {
    res.status(400);
    throw new Error("Only approved Circle of Love stories can be featured");
  }

  circleStory.isFeatured = !circleStory.isFeatured;
  await circleStory.save();

  res.status(200).json({
    success: true,
    message: circleStory.isFeatured
      ? "Story marked as featured"
      : "Story removed from featured",
    data: circleStory,
  });
});

// @desc    Delete circle story
// @route   DELETE /api/circle-of-love/admin/:id
// @access  Admin
const deleteCircleStory = asyncHandler(async (req, res) => {
  const circleStory = await CircleOfLove.findById(req.params.id);

  if (!circleStory) {
    res.status(404);
    throw new Error("Circle of Love story not found");
  }

  await circleStory.deleteOne();

  res.status(200).json({
    success: true,
    message: "Circle of Love story deleted successfully",
  });
});

module.exports = {
  createCircleStory,
  getApprovedCircleStories,
  getAllCircleStoriesForAdmin,
  approveCircleStory,
  rejectCircleStory,
  toggleFeaturedCircleStory,
  deleteCircleStory,
};
