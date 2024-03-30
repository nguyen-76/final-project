const express = require("express");
const {
  register,
  login,
  logout,
} = require("../controllers/auth.controller.js");
const validator = require("../validators/validator.js");
const router = express.Router();

/**
 * @route POST /users/register
 * @description create a user
 * @body {username, email, password}
 * @access public
 */
router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

module.exports = router;
