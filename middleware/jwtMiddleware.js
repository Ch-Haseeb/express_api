const jwt = require("jsonwebtoken");

const jwtMiddleware = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded.userid;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};
module.exports = jwtMiddleware;
