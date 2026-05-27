const ChatbotMessage = require("../Models/ChatbotMessage");

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const normalizeType = (type) => {
  const allowedTypes = ["suggestion", "question", "issue", "appreciation", "general"];
  return allowedTypes.includes(type) ? type : "general";
};

// @desc    Submit chatbot message / suggestion
// @route   POST /api/chatbot/messages
// @access  Public
const createChatbotMessage = asyncHandler(async (req, res) => {
  const { name, phone, message, type } = req.body;

  if (!message || String(message).trim().length < 3) {
    res.status(400);
    throw new Error("Please enter a valid message");
  }

  const chatbotMessage = await ChatbotMessage.create({
    name: name?.trim() || "Guest",
    phone: phone?.trim() || "",
    message: message.trim(),
    type: normalizeType(type),
    source: "wedding-assistant",
    isReviewed: false,
  });

  res.status(201).json({
    success: true,
    message: "Thanks! Your message has been sent to the couple.",
    data: chatbotMessage,
  });
});

// @desc    Get all chatbot messages for admin
// @route   GET /api/chatbot/messages
// @access  Admin
const getChatbotMessages = asyncHandler(async (req, res) => {
  const { status = "all", type = "all" } = req.query;

  const filter = {};

  if (status === "reviewed") {
    filter.isReviewed = true;
  }

  if (status === "pending") {
    filter.isReviewed = false;
  }

  if (["suggestion", "question", "issue", "appreciation", "general"].includes(type)) {
    filter.type = type;
  }

  const messages = await ChatbotMessage.find(filter).sort({ createdAt: -1 });

  const stats = await ChatbotMessage.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        pending: {
          $sum: {
            $cond: [{ $eq: ["$isReviewed", false] }, 1, 0],
          },
        },
        reviewed: {
          $sum: {
            $cond: [{ $eq: ["$isReviewed", true] }, 1, 0],
          },
        },
        suggestions: {
          $sum: {
            $cond: [{ $eq: ["$type", "suggestion"] }, 1, 0],
          },
        },
        questions: {
          $sum: {
            $cond: [{ $eq: ["$type", "question"] }, 1, 0],
          },
        },
        issues: {
          $sum: {
            $cond: [{ $eq: ["$type", "issue"] }, 1, 0],
          },
        },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    count: messages.length,
    stats: stats[0] || {
      total: 0,
      pending: 0,
      reviewed: 0,
      suggestions: 0,
      questions: 0,
      issues: 0,
    },
    data: messages,
  });
});

// @desc    Update chatbot message review status / admin note
// @route   PATCH /api/chatbot/messages/:id
// @access  Admin
const updateChatbotMessage = asyncHandler(async (req, res) => {
  const { isReviewed, adminNote } = req.body;

  const chatbotMessage = await ChatbotMessage.findById(req.params.id);

  if (!chatbotMessage) {
    res.status(404);
    throw new Error("Chatbot message not found");
  }

  if (typeof isReviewed === "boolean") {
    chatbotMessage.isReviewed = isReviewed;
  }

  if (typeof adminNote === "string") {
    chatbotMessage.adminNote = adminNote.trim();
  }

  await chatbotMessage.save();

  res.status(200).json({
    success: true,
    message: "Chatbot message updated successfully",
    data: chatbotMessage,
  });
});

// @desc    Delete chatbot message
// @route   DELETE /api/chatbot/messages/:id
// @access  Admin
const deleteChatbotMessage = asyncHandler(async (req, res) => {
  const chatbotMessage = await ChatbotMessage.findById(req.params.id);

  if (!chatbotMessage) {
    res.status(404);
    throw new Error("Chatbot message not found");
  }

  await chatbotMessage.deleteOne();

  res.status(200).json({
    success: true,
    message: "Chatbot message deleted successfully",
  });
});

module.exports = {
  createChatbotMessage,
  getChatbotMessages,
  updateChatbotMessage,
  deleteChatbotMessage,
};
