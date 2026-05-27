const express = require("express");

const {
  loginAdmin,
  getAdminProfile,
} = require("../Controller/adminController");

const { protectAdmin } = require("../Middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/profile", protectAdmin, getAdminProfile);

module.exports = router;