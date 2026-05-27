const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Gallery title is required"],
      trim: true,
    },

    type: {
      type: String,
      required: [true, "Media type is required"],
      enum: ["photo", "video"],
    },

    category: {
      type: String,
      enum: ["Engagement", "Marriage", "Couple", "Family", "Friends", "Other"],
      default: "Other",
    },

    url: {
      type: String,
      required: [true, "Media URL is required"],
    },

    publicId: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isVisible: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Gallery", gallerySchema);