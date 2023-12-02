const Vote = require("../models/Vote");

exports.addVote = async (req, res) => {
  const { feedback_id, vote } = req.body;
  console.log(req.body);
  const user_id = req.user;
  const existingVote = await Vote.findOne({ user_id, feedback_id });
  if (existingVote) {
    return res
      .status(400)
      .json({ error: "You have already vote for this feedback" });
  }
  const newVote = new Vote({
    user_id,
    feedback_id,
    vote,
  });
  try {
    await newVote.save();
    res.status(201).json({ message: "Vote added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error adding vote: " + err.message });
  }
};
