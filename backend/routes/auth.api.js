import express from "express";
import authController from "../controllers/auth.controller.js";
import validator from "../validators/validator.js";

const authRouter = express.Router();

/**
 * @route POST /users/register
 * @description create a user
 * @body {username, email, password}
 * @access public
 */
authRouter.post("/register", validator.signUp, authController.register);

authRouter.post("/login", validator.signIn, authController.login);

authRouter.post("/logout", authController.logout);

authRouter.post("/request", authController.getGoogleUser);

authRouter.get("/oauth", authController.googleAuth);

export { authRouter };
