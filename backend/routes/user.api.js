const express = require("express");
const {
  followUnfollowUser,
  updateProfile,
  getUserProfile,
} = require("../controllers/users.controller");
const { protectFollow } = require("../validators/validator");
const router = express.Router();

router.get("/profile/:query", getUserProfile);
router.post("/follow/:id", protectFollow, followUnfollowUser);
router.put("/update/:id", protectFollow, updateProfile);

module.exports = router;
