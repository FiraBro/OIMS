import { Router } from "express";
import {
  register,
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
} from "../controllers/authController.js";

import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from "../validators/authValidator.js";

import validate from "../middlewares/validateMiddleware.js";
import { authLimiter } from "../middlewares/rateLimit.js";
import { bruteForceProtection } from "../middlewares/bruteForce.js";
import { protect } from "../middlewares/protect.js";

const router = Router();

// REGISTER
router.post("/register", authLimiter, registerValidator, validate, register);

// LOGIN
router.post(
  "/login",
  authLimiter,
  bruteForceProtection,
  loginValidator,
  validate,
  login
);

// LOGOUT
router.post("/logout", logout);

// REFRESH TOKEN (cookie-based)
router.post("/refresh", refresh);

// FORGOT PASSWORD
router.post(
  "/forgot-password",
  authLimiter,
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

// EMAIL VERIFY
router.get("/verify-email/:token", verifyEmail);

// RESEND VERIFICATION EMAIL
router.post("/resend-verification", protect, resendVerification);

export default router;
