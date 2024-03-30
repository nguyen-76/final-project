const express = require("express");
const {
  sendMessage,
  getMessage,
  getAllMessage,
} = require("../controllers/message.controller");
const { protectFollow } = require("../validators/validator");
const router = express.Router();

router.get("/conversation", protectFollow, getAllMessage);

router.get("/:otherUserId", protectFollow, getMessage);

router.post("/", protectFollow, sendMessage);

module.exports = router;
