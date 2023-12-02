const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");

const jwtMiddleware = require("../middleware/jwtMiddleware");

router.use(jwtMiddleware);

router.post("/", feedbackController.addFeedback);

// router.put("/:id", feedbackController.updateFeedback);

router.put("/", feedbackController.updateFeedback);

router.delete("/", feedbackController.deleteFeedback);

router.get("/", feedbackController.getAllFeedback);

module.exports = router;
