const express = require("express");
const {
  createPost,
  getPost,
  removePost,
  reactionPost,
  commentOnPost,
  getTimeline,
  getUserPost,
  removeComment,
} = require("../controllers/post.controller");
const { protectFollow } = require("../validators/validator");
const router = express.Router();

router.get("/timeline", protectFollow, getTimeline);

router.get("/:id", getPost);

router.get("/users/:username", getUserPost);

router.post("/create", protectFollow, createPost);

router.delete("/:id", protectFollow, removePost);

router.put("/react/:id", protectFollow, reactionPost);

router.put("/reply/:id", protectFollow, commentOnPost);

router.delete("/reply/:id", protectFollow, removeComment);

module.exports = router;
