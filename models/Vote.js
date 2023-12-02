const mongoose = require("mongoose");

const voteScehma = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    feedback_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feedback",
      required: true,
    },
    vote:{
        type: Number,
        enum: [0,1],
        default: 0,
    }

  },
  {
    timestamps: true,
  }
);
const Vote = mongoose.model("Vote", voteScehma);
module.exports = Vote;
