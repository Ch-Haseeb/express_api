const express = require("express");
const db = require("./db");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/authRoutes");
const feedbackRoutes = require("./routes/feedbackRoute");
const voteRoutes = require("./routes/voteRoutes");

require("dotenv").config();

const app = express();

app.use(bodyParser.json());

app.use("/users", userRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/vote", voteRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
