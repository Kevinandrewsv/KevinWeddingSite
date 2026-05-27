const Poll = require("../Models/Poll");
const PollVote = require("../Models/PollVote");

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const validOptions = ["Kevin", "Jenith"];
const validStatuses = ["pending", "approved", "rejected"];

const normalizeQuestion = (question = "") => String(question).trim().replace(/\s+/g, " ");

const normalizeOption = (option = "") => {
  const value = String(option).trim().toLowerCase();
  if (value === "kevin") return "Kevin";
  if (value === "jenith") return "Jenith";
  return "";
};

const buildStats = async () => {
  const grouped = await Poll.aggregate([
    {
      $group: {
        _id: null,
        totalPolls: { $sum: 1 },
        approved: { $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] } },
        pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
        rejected: { $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] } },
        active: { $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] } },
        guestSuggested: { $sum: { $cond: [{ $eq: ["$createdBy", "guest"] }, 1, 0] } },
        totalVotes: { $sum: "$totalVotes" },
        kevinVotes: { $sum: "$kevinVotes" },
        jenithVotes: { $sum: "$jenithVotes" },
      },
    },
  ]);

  const stats = grouped[0] || {
    totalPolls: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    active: 0,
    guestSuggested: 0,
    totalVotes: 0,
    kevinVotes: 0,
    jenithVotes: 0,
  };

  stats.kevinPercentage = stats.totalVotes
    ? Math.round((stats.kevinVotes / stats.totalVotes) * 100)
    : 0;
  stats.jenithPercentage = stats.totalVotes
    ? Math.round((stats.jenithVotes / stats.totalVotes) * 100)
    : 0;

  return stats;
};

const addVisitorVotes = async (polls, visitorId) => {
  const plainPolls = polls.map((poll) => poll.toObject());

  if (!visitorId) {
    return plainPolls.map((poll) => ({ ...poll, userVote: null }));
  }

  const votes = await PollVote.find({
    poll: { $in: plainPolls.map((poll) => poll._id) },
    visitorId: String(visitorId).trim(),
  }).select("poll selectedOption");

  const voteMap = new Map(votes.map((vote) => [String(vote.poll), vote.selectedOption]));

  return plainPolls.map((poll) => ({
    ...poll,
    userVote: voteMap.get(String(poll._id)) || null,
  }));
};

// @desc    Get approved active polls for public page
// @route   GET /api/polls/public
// @access  Public
const getPublicPolls = asyncHandler(async (req, res) => {
  const { visitorId } = req.query;

  const polls = await Poll.find({ status: "approved", isActive: true })
    .sort({ isFeatured: -1, totalVotes: -1, createdAt: -1 })
    .limit(100);

  const data = await addVisitorVotes(polls, visitorId);
  const stats = await buildStats();

  res.status(200).json({
    success: true,
    count: data.length,
    stats,
    data,
  });
});

// @desc    Suggest a poll question from public page
// @route   POST /api/polls/suggest
// @access  Public
const suggestPoll = asyncHandler(async (req, res) => {
  const { guestName, question } = req.body;
  const cleanQuestion = normalizeQuestion(question);

  if (!cleanQuestion) {
    res.status(400);
    throw new Error("Poll question is required");
  }

  const poll = await Poll.create({
    question: cleanQuestion,
    guestName: guestName?.trim() || "Guest",
    createdBy: "guest",
    status: "pending",
    isActive: true,
    isFeatured: false,
  });

  res.status(201).json({
    success: true,
    message: "Your poll question has been submitted for admin approval.",
    data: poll,
  });
});

// @desc    Vote on a poll once per visitor id
// @route   POST /api/polls/:id/vote
// @access  Public
const votePoll = asyncHandler(async (req, res) => {
  const { visitorId, selectedOption } = req.body;
  const option = normalizeOption(selectedOption);

  if (!visitorId) {
    res.status(400);
    throw new Error("Visitor id is required to vote");
  }

  if (!validOptions.includes(option)) {
    res.status(400);
    throw new Error("Please choose Kevin or Jenith");
  }

  const poll = await Poll.findOne({
    _id: req.params.id,
    status: "approved",
    isActive: true,
  });

  if (!poll) {
    res.status(404);
    throw new Error("Poll not found or not active");
  }

  const cleanVisitorId = String(visitorId).trim();

  try {
    await PollVote.create({
      poll: poll._id,
      visitorId: cleanVisitorId,
      selectedOption: option,
    });
  } catch (error) {
    if (error?.code === 11000) {
      const existingVote = await PollVote.findOne({
        poll: poll._id,
        visitorId: cleanVisitorId,
      });

      res.status(409);
      throw new Error(
        `You have already voted for ${existingVote?.selectedOption || "this poll"}.`
      );
    }

    throw error;
  }

  if (option === "Kevin") {
    poll.kevinVotes += 1;
  } else {
    poll.jenithVotes += 1;
  }

  poll.totalVotes += 1;
  await poll.save();

  res.status(200).json({
    success: true,
    message: `Your vote for ${option} has been recorded.`,
    data: {
      ...poll.toObject(),
      userVote: option,
    },
  });
});

// @desc    Get all polls for admin
// @route   GET /api/polls/admin/all
// @access  Admin
const getAdminPolls = asyncHandler(async (req, res) => {
  const { status = "all", source = "all" } = req.query;
  const filter = {};

  if (validStatuses.includes(status)) filter.status = status;
  if (["admin", "guest"].includes(source)) filter.createdBy = source;

  const polls = await Poll.find(filter).sort({ createdAt: -1 });
  const stats = await buildStats();

  res.status(200).json({
    success: true,
    count: polls.length,
    stats,
    data: polls,
  });
});

// @desc    Create admin poll
// @route   POST /api/polls/admin
// @access  Admin
const createAdminPoll = asyncHandler(async (req, res) => {
  const { question, isFeatured = false } = req.body;
  const cleanQuestion = normalizeQuestion(question);

  if (!cleanQuestion) {
    res.status(400);
    throw new Error("Poll question is required");
  }

  const poll = await Poll.create({
    question: cleanQuestion,
    createdBy: "admin",
    guestName: "Admin",
    status: "approved",
    isActive: true,
    isFeatured: Boolean(isFeatured),
  });

  res.status(201).json({
    success: true,
    message: "Poll question created successfully.",
    data: poll,
  });
});

// @desc    Update poll details/status
// @route   PATCH /api/polls/admin/:id
// @access  Admin
const updatePoll = asyncHandler(async (req, res) => {
  const poll = await Poll.findById(req.params.id);

  if (!poll) {
    res.status(404);
    throw new Error("Poll not found");
  }

  const { question, status, isActive, isFeatured } = req.body;

  if (typeof question === "string") {
    const cleanQuestion = normalizeQuestion(question);
    if (!cleanQuestion) {
      res.status(400);
      throw new Error("Poll question cannot be empty");
    }
    poll.question = cleanQuestion;
  }

  if (status && validStatuses.includes(status)) {
    poll.status = status;
    if (status !== "approved") poll.isFeatured = false;
  }

  if (typeof isActive === "boolean") poll.isActive = isActive;
  if (typeof isFeatured === "boolean") {
    if (isFeatured && poll.status !== "approved") {
      res.status(400);
      throw new Error("Only approved polls can be featured");
    }
    poll.isFeatured = isFeatured;
  }

  await poll.save();

  res.status(200).json({
    success: true,
    message: "Poll updated successfully.",
    data: poll,
  });
});

// @desc    Delete poll and votes
// @route   DELETE /api/polls/admin/:id
// @access  Admin
const deletePoll = asyncHandler(async (req, res) => {
  const poll = await Poll.findById(req.params.id);

  if (!poll) {
    res.status(404);
    throw new Error("Poll not found");
  }

  await PollVote.deleteMany({ poll: poll._id });
  await poll.deleteOne();

  res.status(200).json({
    success: true,
    message: "Poll and related votes deleted successfully.",
  });
});

// @desc    Reset poll votes
// @route   PATCH /api/polls/admin/:id/reset-votes
// @access  Admin
const resetPollVotes = asyncHandler(async (req, res) => {
  const poll = await Poll.findById(req.params.id);

  if (!poll) {
    res.status(404);
    throw new Error("Poll not found");
  }

  await PollVote.deleteMany({ poll: poll._id });
  poll.kevinVotes = 0;
  poll.jenithVotes = 0;
  poll.totalVotes = 0;
  await poll.save();

  res.status(200).json({
    success: true,
    message: "Poll votes reset successfully.",
    data: poll,
  });
});

module.exports = {
  getPublicPolls,
  suggestPoll,
  votePoll,
  getAdminPolls,
  createAdminPoll,
  updatePoll,
  deletePoll,
  resetPollVotes,
};
