const express = require("express");
const router = express.Router();

const voteController = require('../controllers/voteController');

const jwtMiddleware = require("../middleware/jwtMiddleware");

router.use(jwtMiddleware);

router.post("/", voteController.addVote);

module.exports = router;