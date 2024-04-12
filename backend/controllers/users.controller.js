import User from "../models/User.js";
import Post from "../models/Post.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
    return res.status(500).json({ error: "Can not follow user" });
  }
};
// update profile
userController.updateProfile = async (req, res) => {
  const { name, username, email, bio } = req.body;
  let { profilePicture } = req.body;
  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });
    if (req.params.id == !userId.toString())
      return res
        .status(400)
        .json({ error: "You can't update other user profile" });
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

    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update profile" });
  }
};

userController.getUserProfile = async (req, res) => {
  const { query } = req.params;
  try {
    let user;

    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query }).select("-updatedAt");
    } else {
      user = await User.findOne({ username: { $regex: query } }).select(
        "-updatedAt"
      );
    }
    if (!user) return res.status(400).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "User don't exist" });
  }
};

userController.getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const usersFollowedByYou = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);
    const filteredUsers = users.filter(
      (user) => !usersFollowedByYou.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);

    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    res.status(500).json({ error: "No suggested user" });
  }
};

userController.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  let currentPassword = undefined;
  try {
    const userId = req.user._id;
    let user = await User.findById(userId);
    currentPassword = user.password;

    const result = await bcrypt.compare(oldPassword, currentPassword);
    if (!result) {
      return res.status("401").send({
        error: "Your old password was entered incorrectly, please try again.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user = await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to update password" });
  }
};

userController.searchUsers = async (req, res) => {
  try {
    const users = await User.find({ username: { $regex: req.query.username } })
      .limit(10)
      .select("username profilePicture");

    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: "Failed to search user" });
  }
};

export default userController;
