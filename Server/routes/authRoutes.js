import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from "../validators/authValidator.js";

import validate from "../middlewares/validateMiddleware.js";

const router = Router();

// REGISTER
router.post("/register", registerValidator, validate, register);

// LOGIN
router.post("/login", loginValidator, validate, login);

// FORGOT PASSWORD
router.post(
  "/forgot-password",
  forgotPasswordValidator,
  validate,
  forgotPassword
);

// RESET PASSWORD
router.put(
  "/reset-password/:token",
  resetPasswordValidator,
  validate,
  resetPassword
);

export default router;
