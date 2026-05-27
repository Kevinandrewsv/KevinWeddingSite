const Wish = require("../Models/Wish");

// Local async handler - no need to install express-async-handler
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// @desc    Create wish
// @route   POST /api/wishes
// @access  Public
const createWish = asyncHandler(async (req, res) => {
  const { name, message, relation } = req.body;

  if (!name || !message) {
    res.status(400);
    throw new Error("Name and message are required");
  }

  const wish = await Wish.create({
    name,
    message,
    relation: relation || "",
    isApproved: false,
    isFeatured: false,
  });

  res.status(201).json({
    success: true,
    message: "Wish submitted successfully. It will appear after approval.",
    data: wish,
  });
});

// @desc    Get approved wishes
// @route   GET /api/wishes
// @access  Public
const getApprovedWishes = asyncHandler(async (req, res) => {
  const wishes = await Wish.find({ isApproved: true })
    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json({
    success: true,
    count: wishes.length,
    data: wishes,
  });
});

// @desc    Get featured wishes for home page
// @route   GET /api/wishes/featured
// @access  Public
const getFeaturedWishes = asyncHandler(async (req, res) => {
  const wishes = await Wish.find({
    isApproved: true,
    isFeatured: true,
  })
    .sort({ createdAt: -1 })
    .limit(6);

  res.status(200).json({
    success: true,
    count: wishes.length,
    data: wishes,
  });
});

// @desc    Get all wishes for admin
// @route   GET /api/wishes/admin
// @access  Admin
const getAllWishesForAdmin = asyncHandler(async (req, res) => {
  const wishes = await Wish.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: wishes.length,
    data: wishes,
  });
});

// @desc    Approve wish
// @route   PATCH /api/wishes/admin/:id/approve
// @access  Admin
const approveWish = asyncHandler(async (req, res) => {
  const wish = await Wish.findById(req.params.id);

  if (!wish) {
    res.status(404);
    throw new Error("Wish not found");
  }

  wish.isApproved = true;
  await wish.save();

  res.status(200).json({
    success: true,
    message: "Wish approved successfully",
    data: wish,
  });
});

// @desc    Reject wish
// @route   PATCH /api/wishes/admin/:id/reject
// @access  Admin
const rejectWish = asyncHandler(async (req, res) => {
  const wish = await Wish.findById(req.params.id);

  if (!wish) {
    res.status(404);
    throw new Error("Wish not found");
  }

  wish.isApproved = false;
  wish.isFeatured = false;
  await wish.save();

  res.status(200).json({
    success: true,
    message: "Wish rejected successfully",
    data: wish,
  });
});

// @desc    Toggle featured wish
// @route   PATCH /api/wishes/admin/:id/featured
// @access  Admin
const toggleFeaturedWish = asyncHandler(async (req, res) => {
  const wish = await Wish.findById(req.params.id);

  if (!wish) {
    res.status(404);
    throw new Error("Wish not found");
  }

  if (!wish.isApproved) {
    res.status(400);
    throw new Error("Only approved wishes can be featured");
  }

  wish.isFeatured = !wish.isFeatured;
  await wish.save();

  res.status(200).json({
    success: true,
    message: wish.isFeatured
      ? "Wish marked as featured"
      : "Wish removed from featured",
    data: wish,
  });
});

// @desc    Delete wish
// @route   DELETE /api/wishes/admin/:id
// @access  Admin
const deleteWish = asyncHandler(async (req, res) => {
  const wish = await Wish.findById(req.params.id);

  if (!wish) {
    res.status(404);
    throw new Error("Wish not found");
  }

  await wish.deleteOne();

  res.status(200).json({
    success: true,
    message: "Wish deleted successfully",
  });
});

module.exports = {
  createWish,
  getApprovedWishes,
  getFeaturedWishes,
  getAllWishesForAdmin,
  approveWish,
  rejectWish,
  toggleFeaturedWish,
  deleteWish,
};