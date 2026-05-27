const mongoose = require("mongoose");

const pollVoteSchema = new mongoose.Schema(
  {
    poll: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
    },

    visitorId: {
      type: String,
      required: [true, "Visitor id is required"],
      trim: true,
      maxlength: [120, "Visitor id is invalid"],
    },

    selectedOption: {
      type: String,
      enum: ["Kevin", "Jenith"],
      required: [true, "Selected option is required"],
    },
  },
  {
    timestamps: true,
  }
);

pollVoteSchema.index({ poll: 1, visitorId: 1 }, { unique: true });
pollVoteSchema.index({ visitorId: 1, createdAt: -1 });

module.exports = mongoose.model("PollVote", pollVoteSchema);
