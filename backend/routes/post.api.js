import express from "express";
import postController from "../controllers/post.controller.js";
import validator from "../validators/validator.js";

const postRouter = express.Router();

postRouter.get(
  "/timeline",
  validator.protectFollow,
  postController.getTimeline
);

postRouter.get("/:id", postController.getPost);

postRouter.get("/users/:username", postController.getUserPost);

postRouter.post("/create", validator.protectFollow, postController.createPost);

postRouter.delete("/:id", validator.protectFollow, postController.removePost);

postRouter.put(
  "/react/:id",
  validator.protectFollow,
  postController.reactionPost
);

postRouter.put(
  "/reply/:id",
  validator.protectFollow,
  postController.commentOnPost
);

export { postRouter };
