const express = require("express");

const {
  createGalleryItem,
  getGalleryItems,
  getAllGalleryItemsForAdmin,
  getGalleryItemById,
  updateGalleryItem,
  deleteGalleryItem,
} = require("../Controller/galleryController");

const { protectAdmin } = require("../Middleware/authMiddleware");

const router = express.Router();

router.route("/").get(getGalleryItems).post(protectAdmin, createGalleryItem);

router.route("/admin/all").get(protectAdmin, getAllGalleryItemsForAdmin);

router
  .route("/:id")
  .get(getGalleryItemById)
  .put(protectAdmin, updateGalleryItem)
  .delete(protectAdmin, deleteGalleryItem);

module.exports = router;