const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");
const secret = config.get("secret");

const verifyAuth = async (req, res, next) => {
  let token = req.headers.authorization || req.headers.Authorization;
  try {
    const decoded = jwt.verify(token, secret);
    if (!decoded) {
      res.status(400).json({ msg: "invalid Token" });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(400).json({ msg: "Unauthorized" });
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = verifyAuth;
