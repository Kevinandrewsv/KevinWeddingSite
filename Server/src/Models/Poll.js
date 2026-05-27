const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Poll question is required"],
      trim: true,
      minlength: [8, "Question should be at least 8 characters"],
      maxlength: [180, "Question cannot exceed 180 characters"],
    },

    createdBy: {
      type: String,
      enum: ["admin", "guest"],
      default: "guest",
    },

    guestName: {
      type: String,
      trim: true,
      default: "",
      maxlength: [70, "Name cannot exceed 70 characters"],
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    kevinVotes: {
      type: Number,
      default: 0,
      min: 0,
    },

    jenithVotes: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalVotes: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

pollSchema.index({ status: 1, isActive: 1, isFeatured: -1, createdAt: -1 });
pollSchema.index({ createdBy: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model("Poll", pollSchema);
