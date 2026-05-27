const express = require("express");

const {
  createWish,
  getApprovedWishes,
  getFeaturedWishes,
  getAllWishesForAdmin,
  approveWish,
  rejectWish,
  toggleFeaturedWish,
  deleteWish,
} = require("../Controller/wishController");

const { protectAdmin } = require("../Middleware/authMiddleware");

const router = express.Router();

// Public routes
router.route("/").post(createWish).get(getApprovedWishes);

// IMPORTANT: keep this before admin dynamic routes
router.get("/featured", getFeaturedWishes);

// Admin routes
// Your admin panel is calling /api/wishes/admin/all
router.get("/admin/all", protectAdmin, getAllWishesForAdmin);

// Keeping this also for future compatibility
router.get("/admin", protectAdmin, getAllWishesForAdmin);

router.patch("/admin/:id/approve", protectAdmin, approveWish);

router.patch("/admin/:id/reject", protectAdmin, rejectWish);

router.patch("/admin/:id/featured", protectAdmin, toggleFeaturedWish);

router.delete("/admin/:id", protectAdmin, deleteWish);

module.exports = router;