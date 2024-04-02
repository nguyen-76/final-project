import express from "express";
import { authRouter } from "./auth.api.js";
import { userRouter } from "./user.api.js";
import { postRouter } from "./post.api.js";
import { messageRouter } from "./message.api.js";

const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).send("Welcome to Social Platform");
});

router.use("/users", authRouter);

router.use("/users", userRouter);

router.use("/posts", postRouter);

router.use("/messages", messageRouter);

export { router };
