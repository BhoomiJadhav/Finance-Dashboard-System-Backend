const express = require("express");
const authController = require("../controllers/auth.controller");
const { authLimiter } = require("../middleware/rateLimit.middleware");
const { validateRequest } = require("../middleware/validation.middleware");
const { registerValidator, loginValidator } = require("../utils/validators");

const router = express.Router();

router.post(
  "/register",
  authLimiter,
  registerValidator,
  validateRequest,
  authController.register
);
router.post(
  "/login",
  authLimiter,
  loginValidator,
  validateRequest,
  authController.login
);

module.exports = router;
