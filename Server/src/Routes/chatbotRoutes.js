const express = require("express");

const {
  createChatbotMessage,
  getChatbotMessages,
  updateChatbotMessage,
  deleteChatbotMessage,
} = require("../Controller/chatbotController");

const { protectAdmin } = require("../Middleware/authMiddleware");

const router = express.Router();

router
  .route("/messages")
  .post(createChatbotMessage)
  .get(protectAdmin, getChatbotMessages);

router
  .route("/messages/:id")
  .patch(protectAdmin, updateChatbotMessage)
  .delete(protectAdmin, deleteChatbotMessage);

module.exports = router;
