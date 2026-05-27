const express = require("express");

const {
  createGuestResponse,
  getGuestResponses,
  getGuestResponseById,
  updateGuestResponse,
  deleteGuestResponse,
} = require("../Controller/guestResponseController");

const { protectAdmin } = require("../Middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .post(createGuestResponse)
  .get(protectAdmin, getGuestResponses);

router
  .route("/:id")
  .get(protectAdmin, getGuestResponseById)
  .put(protectAdmin, updateGuestResponse)
  .delete(protectAdmin, deleteGuestResponse);

module.exports = router;