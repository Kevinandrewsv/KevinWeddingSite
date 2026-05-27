const express = require("express");

const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../Controller/eventController");

const { protectAdmin } = require("../Middleware/authMiddleware");

const router = express.Router();

router.route("/").get(getEvents).post(protectAdmin, createEvent);

router
  .route("/:id")
  .get(getEventById)
  .put(protectAdmin, updateEvent)
  .delete(protectAdmin, deleteEvent);

module.exports = router;