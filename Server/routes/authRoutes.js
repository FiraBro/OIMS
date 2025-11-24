import { Router } from "express";
import cookieParser from "cookie-parser";
import {
  register,
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  logoutAll,
  changePassword,
  updateEmail,
  getSessions,
  revokeSession,
} from "../controllers/authController.js";

import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
  updateEmailValidator,
} from "../validators/authValidator.js";

import validate from "../middlewares/validateMiddleware.js";
import { authLimiter } from "../middlewares/rateLimit.js";
import { bruteForceProtection } from "../middlewares/bruteForce.js";
import { protect } from "../middlewares/protect.js";
import { csrfProtection, csrfCookie } from "../middlewares/csrf.js";

const router = Router();

// PUBLIC
router.post("/register", authLimiter, registerValidator, validate, register);

router.post(
  "/login",
  authLimiter,
  bruteForceProtection,
  loginValidator,
  validate,
  csrfCookie,
  csrfProtection,
  login
);

// Cookie-based refresh and logout
router.post("/refresh", refresh);
router.post("/logout", logout);

// Forgot / Reset
router.post(
  "/forgot-password",
  authLimiter,
  forgotPasswordValidator,
  validate,
  forgotPassword
);

router.put(
  "/reset-password/:token",
  resetPasswordValidator,
  validate,
  resetPassword
);

// Email verify
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", protect, resendVerification);

// Protected user actions
router.post("/logout-all", protect, logoutAll);
router.put(
  "/change-password",
  protect,
  changePasswordValidator,
  validate,
  changePassword
);
router.put(
  "/update-email",
  protect,
  updateEmailValidator,
  validate,
  updateEmail
);

// Session management
router.get("/sessions", protect, getSessions);
router.delete("/sessions/:sessionId", protect, revokeSession);

export default router;
