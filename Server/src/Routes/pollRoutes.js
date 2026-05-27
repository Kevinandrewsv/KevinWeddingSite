const express = require("express");

const {
  createAdminPoll,
  deletePoll,
  getAdminPolls,
  getPublicPolls,
  resetPollVotes,
  suggestPoll,
  updatePoll,
  votePoll,
} = require("../Controller/pollController");

const { protectAdmin } = require("../Middleware/authMiddleware");

const router = express.Router();

router.route("/public").get(getPublicPolls);
router.route("/suggest").post(suggestPoll);
router.route("/:id/vote").post(votePoll);

router.route("/admin/all").get(protectAdmin, getAdminPolls);
router.route("/admin").post(protectAdmin, createAdminPoll);
router.route("/admin/:id").patch(protectAdmin, updatePoll).delete(protectAdmin, deletePoll);
router.route("/admin/:id/reset-votes").patch(protectAdmin, resetPollVotes);

module.exports = router;
