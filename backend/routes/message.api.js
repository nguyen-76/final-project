import express from "express";
import messageController from "../controllers/message.controller.js";
import validator from "../validators/validator.js";

const messageRouter = express.Router();

messageRouter.get(
  "/conversation",
  validator.protectFollow,
  messageController.getAllMessage
);

messageRouter.get(
  "/:otherUserId",
  validator.protectFollow,
  messageController.getMessage
);

messageRouter.post("/", validator.protectFollow, messageController.sendMessage);

export { messageRouter };
