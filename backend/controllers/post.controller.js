import User from "../models/User.js";
import Post from "../models/Post.js";
import { v2 as cloudinary } from "cloudinary";

const postController = {};

// create Post
postController.createPost = async (req, res) => {
  try {
    const { username, text } = req.body;
    let { img } = req.body;
    if (!username || !text) {
      return res
        .status(400)
        .json({ error: "username and text field are required" });
    }
    const user = await User.findById(username);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({ error: "Unauthorized to create post" });
    }
    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ error: `Post must be less than ${maxLength} characters` });
    }
    if (img) {
      const uploadResponse = await cloudinary.uploader.upload(img);
      img = uploadResponse.secure_url;
    }
    const newPost = new Post({ username, text, img });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    return res.status(500).json({ error: "Can not create post" });
  }
};

// get post
postController.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ error: "Post not found" });
    }
    res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({ error: "Can not get post" });
  }
};

// delete post
postController.removePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ error: "Post not found" });
    }
    if (post.username.toString() !== req.user._id.toString()) {
      return res.status(400).json({ error: "Not your post to delete" });
    }
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post delete successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Can not delete post" });
  }
};

// like unlike post
postController.reactionPost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(postId);
    if (!post) return res.status(401).json({ error: "Post not found" });
    const userLikePost = post.likes.includes(userId);
    if (userLikePost) {
      // unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unliked" });
    } else {
      post.likes.push(userId);
      await post.save();
      res.status(200).json({ message: "Post liked" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Can not react to post" });
  }
};

// comment under post
postController.commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    const userProfilePicture = req.user.profilePicture;
    const username = req.user.username;

    if (!text) {
      return res.status(401).json({ error: "text field is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(401).json({ error: "Post not found" });
    }

    const reply = { userId, text, userProfilePicture, username };
    post.replies.push(reply);
    await post.save();
    res.status(200).json(reply);
  } catch (error) {
    return res.status(500).json({ error: "Can not comment on post" });
  }
};

// get timeline post
postController.getTimeline = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const myPost = await Post.find({ username: userId }).sort({
      createdAt: -1,
    });

    const following = user.following;

    const feedPosts = await Post.find({ username: { $in: following } }).sort({
      createdAt: -1,
    });
    const timeline = myPost.concat(...feedPosts);
    res.status(200).json(timeline);
  } catch (error) {
    res.status(500).json({ error: "Can not get timeline" });
  }
};

postController.getUserPost = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const posts = await Post.find({ username: user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Can not get post" });
  }
};
export default postController;
