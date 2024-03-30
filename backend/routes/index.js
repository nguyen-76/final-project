var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).send("Welcome to CoderSchool!");
});

const authRouter = require("./auth.api.js");
router.use("/users", authRouter);

const userRouter = require("./user.api.js");
router.use("/users", userRouter);

const postRouter = require("./post.api.js");
router.use("/posts", postRouter);

const messageRouter = require("./message.api.js");
router.use("/messages", messageRouter);
module.exports = router;
