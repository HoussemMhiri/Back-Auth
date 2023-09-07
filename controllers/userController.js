const User = require("../models/User");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const secret = config.get("secret");

exports.register = async (req, res) => {
  const { fullName, email, password } = req.body;
  const existantUser = await User.findOne({ email });
  if (existantUser) {
    res.status(409).json({ msg: "User already exists !" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });
    const payload = {
      id: newUser._id,
    };
    let token = jwt.sign(payload, secret);
    res.send({
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
    //res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ msg: "Worng Cordonnes" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(404).json({ msg: "Worng Cordonnes" });
    }
    const payload = {
      id: user._id,
    };
    let token = jwt.sign(payload, secret);
    res.send({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.auth = (req, res) => {
  res.send(req.user);
};
