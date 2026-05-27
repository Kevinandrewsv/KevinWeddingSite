const mongoose = require("mongoose");

const guestResponseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    attending: {
      type: Boolean,
      required: [true, "Please confirm attendance"],
    },

    guestCount: {
      type: Number,
      default: 1,
      min: 1,
    },

    event: {
      type: String,
      enum: ["Engagement", "Marriage", "Both"],
      default: "Both",
    },

    message: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const GuestResponse = mongoose.model(
  "GuestResponse",
  guestResponseSchema
);

module.exports = GuestResponse;