const express = require("express");

const {
  createCircleStory,
  getApprovedCircleStories,
  getAllCircleStoriesForAdmin,
  approveCircleStory,
  rejectCircleStory,
  toggleFeaturedCircleStory,
  deleteCircleStory,
} = require("../Controller/circleOfLoveController");

const { protectAdmin } = require("../Middleware/authMiddleware");

const router = express.Router();

router.route("/").post(createCircleStory).get(getApprovedCircleStories);
router.route("/admin/all").get(protectAdmin, getAllCircleStoriesForAdmin);
router.route("/admin/:id/approve").patch(protectAdmin, approveCircleStory);
router.route("/admin/:id/reject").patch(protectAdmin, rejectCircleStory);
router.route("/admin/:id/featured").patch(protectAdmin, toggleFeaturedCircleStory);
router.route("/admin/:id").delete(protectAdmin, deleteCircleStory);

module.exports = router;
