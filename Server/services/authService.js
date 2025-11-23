// services/authService.js
import AppError from "../utils/AppError.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import User from "../models/user.js"; // <-- fixed import name
import {
  signToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

const REFRESH_TTL_MS = parseInt(
  process.env.REFRESH_TTL_MS || `${30 * 24 * 60 * 60 * 1000}`
);
const MAX_LOGIN_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS || "5");
const LOCK_TIME_MS = parseInt(process.env.LOCK_TIME_MS || `${15 * 60 * 1000}`);

// REGISTER
export const registerUser = async (data) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) throw new AppError("Email already registered", 409);

  const newUser = await User.create(data);

  // send verification email (create token)
  const verifyToken = newUser.createEmailVerifyToken();
  await newUser.save({ validateBeforeSave: false });

  // send email (controller could do this instead)
  const verifyURL = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;
  try {
    await sendEmail({
      email: newUser.email,
      subject: "Verify your email",
      text: `Verify here: ${verifyURL}`,
    });
  } catch (err) {
    // log, but allow registration — user can request resend
    console.error("Failed to send verification email:", err);
  }

  return {
    id: newUser._id,
    fullName: newUser.fullName,
    email: newUser.email,
    role: newUser.role,
  };
};

// LOGIN
export const loginUser = async (
  { email, password },
  { device = "web", ip, userAgent } = {}
) => {
  if (!email || !password)
    throw new AppError("Email and password are required", 400);

  // find the user (note: variable not named `user` to avoid shadowing)
  const existingUser = await User.findOne({ email }).select(
    "+password +loginAttempts +lockUntil"
  );
  if (!existingUser) throw new AppError("Invalid credentials", 401);

  // check locked
  if (existingUser.lockUntil && existingUser.lockUntil > Date.now()) {
    throw new AppError("Too many failed attempts. Try again later.", 423);
  }

  const isMatch = await existingUser.comparePassword(password);
  if (!isMatch) {
    // Prefer model helper if present
    if (typeof existingUser.incrementLoginAttempts === "function") {
      await existingUser.incrementLoginAttempts(
        MAX_LOGIN_ATTEMPTS,
        LOCK_TIME_MS
      );
    } else {
      // fallback manual increment
      existingUser.loginAttempts = (existingUser.loginAttempts || 0) + 1;
      if (existingUser.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        existingUser.lockUntil = new Date(Date.now() + LOCK_TIME_MS);
      }
      await existingUser.save();
    }
    throw new AppError("Invalid credentials", 401);
  }

  // successful login: reset counters
  if (typeof existingUser.resetLoginAttempts === "function") {
    await existingUser.resetLoginAttempts();
  } else {
    existingUser.loginAttempts = 0;
    existingUser.lockUntil = undefined;
    await existingUser.save();
  }

  // generate tokens
  const accessToken = signToken(existingUser);
  const refreshToken = signRefreshToken(existingUser);

  // store hashed refresh token with metadata
  await existingUser.addRefreshSession({
    refreshToken,
    device,
    ip,
    userAgent,
    ttlMs: REFRESH_TTL_MS,
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: existingUser._id,
      fullName: existingUser.fullName,
      email: existingUser.email,
      role: existingUser.role,
      isVerified: existingUser.isVerified,
    },
  };
};

// REFRESH (rotation)
export const refreshTokenService = async (
  oldRefreshToken,
  { device = "web", ip, userAgent } = {}
) => {
  if (!oldRefreshToken) throw new AppError("Refresh token required", 400);

  // verify signature
  const payload = verifyRefreshToken(oldRefreshToken);
  const currentUser = await User.findById(payload.id);
  if (!currentUser) throw new AppError("Invalid refresh token", 401);

  // check existence
  if (!currentUser.hasRefreshSession(oldRefreshToken)) {
    // token reuse or revoked: clear sessions and force re-login
    await currentUser.clearAllSessions();
    throw new AppError("Refresh token revoked or reused. Login again.", 401);
  }

  // rotate: create new refresh token, replace old session
  const newRefreshToken = signRefreshToken(currentUser);
  await currentUser.rotateRefreshSession(oldRefreshToken, newRefreshToken, {
    device,
    ip,
    userAgent,
    ttlMs: REFRESH_TTL_MS,
  });

  const newAccessToken = signToken(currentUser);
  return { token: newAccessToken, refreshToken: newRefreshToken };
};

// LOGOUT (revoke one refresh token)
export const logoutUser = async (refreshToken) => {
  if (!refreshToken) return { message: "No token provided" };
  try {
    const payload = verifyRefreshToken(refreshToken);
    const currentUser = await User.findById(payload.id);
    if (currentUser) await currentUser.removeRefreshSession(refreshToken);
  } catch (err) {
    // ignore invalid token, but client should clear cookie
  }
  return { message: "Logged out successfully" };
};

// FORGOT PASSWORD
export const forgotPasswordService = async (email) => {
  const currentUser = await User.findOne({ email });
  if (!currentUser) throw new AppError("User not found with this email", 404);

  const resetToken = currentUser.getResetToken();
  await currentUser.save({ validateBeforeSave: false });

  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendEmail({
    email: currentUser.email,
    subject: "Password Reset",
    text: `Reset your password here: ${resetURL}`,
  });
  // Invalidate all refresh sessions on password reset request? Optional. We'll invalidate on reset.
  return { resetURL };
};

// RESET PASSWORD
export const resetPasswordService = async (token, newPassword) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const currentUser = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!currentUser) throw new AppError("Invalid or expired token", 400);

  currentUser.password = newPassword;
  currentUser.passwordConfirm = newPassword;
  currentUser.resetPasswordToken = undefined;
  currentUser.resetPasswordExpire = undefined;

  // clear all refresh sessions on password change
  await currentUser.clearAllSessions();

  await currentUser.save();

  const authToken = signToken(currentUser);
  return {
    token: authToken,
    user: {
      id: currentUser._id,
      fullName: currentUser.fullName,
      email: currentUser.email,
      role: currentUser.role,
    },
  };
};

// EMAIL VERIFY
export const verifyEmailService = async (token) => {
  const hashed = crypto.createHash("sha256").update(token).digest("hex");
  const currentUser = await User.findOne({
    emailVerifyToken: hashed,
    emailVerifyExpire: { $gt: Date.now() },
  });
  if (!currentUser) throw new AppError("Invalid or expired token", 400);
  currentUser.isVerified = true;
  currentUser.emailVerifyToken = undefined;
  currentUser.emailVerifyExpire = undefined;
  await currentUser.save();
  return { message: "Email verified" };
};

// SEND VERIFICATION (resend)
export const sendVerificationEmailService = async (userId) => {
  const currentUser = await User.findById(userId);
  if (!currentUser) throw new AppError("User not found", 404);
  const token = currentUser.createEmailVerifyToken();
  await currentUser.save({ validateBeforeSave: false });
  const verifyURL = `${process.env.CLIENT_URL}/verify-email/${token}`;
  await sendEmail({
    email: currentUser.email,
    subject: "Verify your email",
    text: `Verify: ${verifyURL}`,
  });
  return { verifyURL };
};
