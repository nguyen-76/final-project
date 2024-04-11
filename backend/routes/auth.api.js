import express from "express";
import authController from "../controllers/auth.controller.js";
import validator from "../validators/validator.js";
import passport from "passport";

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

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "https://holostagram.onrender.com/",
    failureRedirect: "https://holostagram.onrender.com/auth",
  })
);
export { authRouter };
