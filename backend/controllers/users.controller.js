const { default: mongoose } = require("mongoose");
const User = require("../models/User.js");
const Post = require("../models/Post.js");
const cloudinary = require("cloudinary").v2;

const userController = {};

userController.followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString())
      return res
        .status(400)
        .json({ message: "You cant follow or unfollow yourself" });
    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "User not found" });
    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      // Unfollow user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // Follow user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
// update profile
userController.updateProfile = async (req, res) => {
  const { name, username, email, password, bio } = req.body;
  let { profilePicture } = req.body;
  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });
    if (req.params.id == !userId.toString())
      return res
        .status(400)
        .json({ error: "You can't update other user profile" });
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      user.password = hashPassword;
    }
    if (profilePicture) {
      if (user.profilePicture) {
        await cloudinary.uploader.destroy(
          user.profilePicture.split("/").pop().split(".")[0]
        );
      }
      const uploadResponse = await cloudinary.uploader.upload(profilePicture);
      profilePicture = uploadResponse.secure_url;
    }
    user.name = name || user.name;
    user.username = username || user.username;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.profilePicture = profilePicture || user.profilePicture;

    user = await user.save();

    await Post.updateMany(
      { "replies.userId": userId },
      {
        $set: {
          "replies.$[reply].username": user.username,
          "replies.$[reply].userProfilePicture": user.profilePicture,
        },
      },
      { arrayFilters: [{ "reply.userId": userId }] }
    );

    user.password = null;

    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
userController.getUserProfile = async (req, res) => {
  const { query } = req.params;
  try {
    let user;

    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
      user = await User.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
    }
    if (!user) return res.status(400).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = userController;
