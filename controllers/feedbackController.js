const Feedback = require("../models/Feedback");
const Vote = require("../models/Vote");
const multer = require("multer");
const uuid = require("uuid");
const path = require("path");

const { ValidateaddFeedback } = require("../validations/feedbackValidation");
const { response } = require("express");
const { default: mongoose } = require("mongoose");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuid.v4()}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage });

exports.addFeedback = [
  ValidateaddFeedback,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, description } = req.body;
      const user_id = req.user;
      let image = null;
      if (req.file) {
        image = req.file.filename;
      }
      const newfeedback = new Feedback({
        title,
        description,
        user_id,
        image,
      });
      await newfeedback.save();
      res.status(201).json({ message: "Feedback saved successfully" });
    } catch (err) {
      res.status(500).json({ error: "Error registering user" + err.message });
    }
  },
];

exports.updateFeedback = [
  ValidateaddFeedback,
  upload.single("image"),
  async (req, res) => {
    try {
      const feedbackId = req.query.id;
      const { title, description } = req.body;
      const exisitFeedback = await Feedback.findById(feedbackId);

      if (!exisitFeedback) {
        return res.status(404).json({ error: "Feedback not found!" });
      }

      if (exisitFeedback.image) {
        const imagepath = path.join("public/images", exisitFeedback.image);
        const fs = require("fs");
        fs.unlinkSync(imagepath);
        exisitFeedback.image = null;
      }

      exisitFeedback.title = title;
      exisitFeedback.description = description;
      exisitFeedback.user_id = req.user;

      if (req.file) {
        exisitFeedback.image = req.file.filename;
      }

      await exisitFeedback.save();

      return res.status(200).json({ message: "Feedback updated successfully" });
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Error updating feedback: " + err.message });
    }
  },
];

exports.deleteFeedback = async (req, res) => {
  try {
    const feedbackId = req.query.id;
    const exisitFeedback = await Feedback.findById(feedbackId);
    if (!exisitFeedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }
    console.log(exisitFeedback);
    if (exisitFeedback.image) {
      const imagepath = path.join("public/images", exisitFeedback.image);
      const fs = require("fs");
      fs.unlinkSync(imagepath);
    }
    await exisitFeedback.deleteOne();
    return res.status(200).json({ message: "Feedback Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting feedback: " + err });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const allFeedback = await Feedback.find({});
    const feedbackWithVotes = [];

    for (const feedback of allFeedback) {
      const feedbackId = feedback._id;
      const votesWithUser = await Vote.aggregate([
        {
          $match: { feedback_id: new mongoose.Types.ObjectId(feedbackId) },
        },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $project: {
            _id: 1,
            user: 1,
            vote: 1,
          },
        },
      ]);
      feedbackWithVotes.push({
        feedback: feedback,
        votes: votesWithUser,
      });
    }
    res.status(200).json(feedbackWithVotes);
  } catch (err) {
    res.status(500).json({ error: "Error getting feedback: " + err });
  }
};
