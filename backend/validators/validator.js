import User from "../models/User.js";
import jwt from "jsonwebtoken";

let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,20}$/;
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const validator = {};

validator.signUp = (req, res, next) => {
  let { username, email, password } = req.body;
  if (!username.length) {
    return res.status(403).json({ error: "please provide username" });
  }
  if (!email.length || !emailRegex.test(email)) {
    return res.status(403).json({ error: "Please provide email" });
  }
  if (!passwordRegex.test(password)) {
    return res.status(403).json({
      error:
        "Password must be 8 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters",
    });
  }
  next();
};

validator.signIn = (req, res, next) => {
  let { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(403)
      .json({ error: "Please provide both email and password" });
  }
  next();
};

validator.updatePassword = (req, res, next) => {
  let { oldPassword, newPassword } = req.body;
  if (!passwordRegex.test(oldPassword) || !passwordRegex.test(newPassword)) {
    return res.status(403).json({
      error:
        "Password must be 8 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters",
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
export default validator;
