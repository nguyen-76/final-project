const User = require("../models/User");
const jwt = require("jsonwebtoken");

let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

const validator = {};

validator.register = (req, res, next) => {
  let { username, email, password } = req.body;
  if (!username.length) {
    return res.status(403).json({ Error: "please provide username" });
  }
  if (!email.length) {
    return res.status(403).json({ Error: "Please provide email" });
  }
  if (!passwordRegex.test(password)) {
    return res.status(403).json({
      Error:
        "Password must be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters",
    });
  }
  next();
};

validator.login = (req, res, next) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(403)
      .json({ error: "Please provide both email and password" });
  }
  next();
};

validator.updatePassword = (req, res, next) => {
  let { currentPassword, newPassword } = req.body;
  if (
    !passwordRegex.test(currentPassword) ||
    !passwordRegex.test(newPassword)
  ) {
    return res.status(403).json({
      error:
        "Password must be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters",
    });
  }
  next();
};

validator.protectFollow = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.userId).select("-password");
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
module.exports = validator;