const mongoose = require("mongoose");

const chatbotMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "Guest",
      maxlength: [80, "Name cannot exceed 80 characters"],
    },

    phone: {
      type: String,
      trim: true,
      default: "",
      maxlength: [30, "Phone number cannot exceed 30 characters"],
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [3, "Message must be at least 3 characters"],
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },

    type: {
      type: String,
      enum: ["suggestion", "question", "issue", "appreciation", "general"],
      default: "general",
    },

    source: {
      type: String,
      enum: ["wedding-assistant", "home-popup"],
      default: "wedding-assistant",
    },

    isReviewed: {
      type: Boolean,
      default: false,
    },

    adminNote: {
      type: String,
      trim: true,
      default: "",
      maxlength: [600, "Admin note cannot exceed 600 characters"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ChatbotMessage", chatbotMessageSchema);
