import express from "express";
import userController from "../controllers/users.controller.js";
import validator from "../validators/validator.js";

const userRouter = express.Router();

userRouter.get("/profile/:query", userController.getUserProfile);
userRouter.get(
  "/suggested",
  validator.protectFollow,
  userController.getSuggestedUsers
);
userRouter.post(
  "/follow/:id",
  validator.protectFollow,
  userController.followUnfollowUser
);
userRouter.put(
  "/update/:id",
  validator.protectFollow,
  userController.updateProfile
);

export { userRouter };
