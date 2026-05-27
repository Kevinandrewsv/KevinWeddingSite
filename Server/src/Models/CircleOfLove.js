const mongoose = require("mongoose");

const circleOfLoveSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [70, "Name cannot exceed 70 characters"],
    },

    side: {
      type: String,
      enum: ["groom", "bride", "both"],
      required: [true, "Please choose groom side, bride side, or both"],
    },

    relationship: {
      type: String,
      required: [true, "Relationship is required"],
      trim: true,
      maxlength: [60, "Relationship cannot exceed 60 characters"],
    },

    story: {
      type: String,
      required: [true, "Please share your connection story"],
      trim: true,
      minlength: [10, "Story should be at least 10 characters"],
      maxlength: [700, "Story cannot exceed 700 characters"],
    },

    phone: {
      type: String,
      trim: true,
      default: "",
      maxlength: [20, "Phone cannot exceed 20 characters"],
    },

    memoryTag: {
      type: String,
      trim: true,
      default: "",
      maxlength: [80, "Memory tag cannot exceed 80 characters"],
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

circleOfLoveSchema.index({ isApproved: 1, side: 1, createdAt: -1 });
circleOfLoveSchema.index({ isApproved: 1, isFeatured: 1, createdAt: -1 });

module.exports = mongoose.model("CircleOfLove", circleOfLoveSchema);
