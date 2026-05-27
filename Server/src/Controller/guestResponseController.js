const GuestResponse = require("../Models/GuestResponse");

// @desc    Create guest response
// @route   POST /api/guest-responses
const createGuestResponse = async (req, res) => {
  try {
    const { name, phone, email, attending, guestCount, event, message } =
      req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone number are required",
      });
    }

    const guestResponse = await GuestResponse.create({
      name,
      phone,
      email,
      attending,
      guestCount,
      event,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Guest attendance response submitted successfully",
      data: guestResponse,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to submit guest attendance response",
      error: error.message,
    });
  }
};

// @desc    Get all guest responses for admin
// @route   GET /api/guest-responses
const getGuestResponses = async (req, res) => {
  try {
    const guestResponses = await GuestResponse.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: guestResponses.length,
      data: guestResponses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch guest attendance responses",
      error: error.message,
    });
  }
};

// @desc    Get single guest response
// @route   GET /api/guest-responses/:id
const getGuestResponseById = async (req, res) => {
  try {
    const guestResponse = await GuestResponse.findById(req.params.id);

    if (!guestResponse) {
      return res.status(404).json({
        success: false,
        message: "Guest response not found",
      });
    }

    res.status(200).json({
      success: true,
      data: guestResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch guest response",
      error: error.message,
    });
  }
};

// @desc    Update guest response
// @route   PUT /api/guest-responses/:id
const updateGuestResponse = async (req, res) => {
  try {
    const guestResponse = await GuestResponse.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!guestResponse) {
      return res.status(404).json({
        success: false,
        message: "Guest response not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Guest response updated successfully",
      data: guestResponse,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update guest response",
      error: error.message,
    });
  }
};

// @desc    Delete guest response
// @route   DELETE /api/guest-responses/:id
const deleteGuestResponse = async (req, res) => {
  try {
    const guestResponse = await GuestResponse.findById(req.params.id);

    if (!guestResponse) {
      return res.status(404).json({
        success: false,
        message: "Guest response not found",
      });
    }

    await GuestResponse.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Guest response deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete guest response",
      error: error.message,
    });
  }
};

module.exports = {
  createGuestResponse,
  getGuestResponses,
  getGuestResponseById,
  updateGuestResponse,
  deleteGuestResponse,
};