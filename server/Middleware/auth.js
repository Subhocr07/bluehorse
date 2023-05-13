const jwt = require("jsonwebtoken");
require("dotenv").config();
const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authorization;
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    console.log("decode", decoded);
    req.token = token;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
module.exports = requireAuth;
