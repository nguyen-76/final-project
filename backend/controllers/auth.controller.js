import generateTokenAndSetCookie from "../helpers/utils.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const authController = {};

// create account
authController.register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ error: "User already existed" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      username,
      email,
      password: hashPassword,
    });
    await newUser.save();
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        bio: newUser.bio,
        profilePicture: newUser.profilePicture,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to register" });
  }
};

// login to account
authController.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const isMatch = await bcrypt.compare(password, user?.password || "");
    if (!user || !isMatch)
      return res.status(400).json({ error: "User or Password is incorrect" });
    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      password: user.password,
      profilePicture: user.profilePicture,
    });
  } catch (err) {
    return res.status(500).json({ error: "User not found" });
  }
};

// logout of account
authController.logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User is log out" });
  } catch (err) {
    return res.status(500).json({ error: "User already log out" });
  }
};

authController.google = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const { password: pass, ...rest } = user._doc;
      generateTokenAndSetCookie(user._id, res);
      res.status(200).json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        name: req.body.name,
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.photo,
      });

      await newUser.save();
      generateTokenAndSetCookie(newUser._id, res);
      const { password: pass, ...rest } = newUser._doc;
      res.status(200).json(rest);
    }
  } catch (error) {
    return res.status(500).json({ error: "Google account does not exist" });
  }
};
export default authController;
