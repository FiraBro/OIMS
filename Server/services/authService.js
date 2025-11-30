// services/authService.js
import AppError from "../utils/AppError.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import User from "../models/user.js";
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

// =============================== REGISTER ===============================
export const registerUser = async (data) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) throw new AppError("Email already registered", 409);

  // 🔒 FORCE role = "user" always
  data.role = "customer";

  const newUser = await User.create(data);

  const verifyToken = newUser.createEmailVerifyToken();
  await newUser.save({ validateBeforeSave: false });

  const verifyURL = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;

  try {
    await sendEmail({
      email: newUser.email,
      subject: "Verify your email",
      text: `Verify here: ${verifyURL}`,
    });
  } catch (err) {
    console.error("Failed to send verification email:", err);
  }

  return {
    id: newUser._id,
    fullName: newUser.fullName,
    email: newUser.email,
    role: newUser.role,
  };
};

// =============================== LOGIN ===============================
export const loginUser = async (
  { email, password },
  { device = "web", ip, userAgent } = {}
) => {
  if (!email || !password)
    throw new AppError("Email and password are required", 400);

  const existingUser = await User.findOne({ email }).select(
    "+password +loginAttempts +lockUntil"
  );
  if (!existingUser) throw new AppError("Invalid credentials", 401);

  // lock check
  if (existingUser.lockUntil && existingUser.lockUntil > Date.now()) {
    throw new AppError("Too many failed attempts. Try again later.", 423);
  }

  const isMatch = await existingUser.comparePassword(password);
  if (!isMatch) {
    if (existingUser.incrementLoginAttempts) {
      await existingUser.incrementLoginAttempts(
        MAX_LOGIN_ATTEMPTS,
        LOCK_TIME_MS
      );
    } else {
      existingUser.loginAttempts = (existingUser.loginAttempts || 0) + 1;
      if (existingUser.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        existingUser.lockUntil = new Date(Date.now() + LOCK_TIME_MS);
      }
      await existingUser.save();
    }
    throw new AppError("Invalid credentials", 401);
  }

  // reset attempts
  if (existingUser.resetLoginAttempts) {
    await existingUser.resetLoginAttempts();
  } else {
    existingUser.loginAttempts = 0;
    existingUser.lockUntil = undefined;
    await existingUser.save();
  }

  // generate tokens
  const accessToken = signToken(existingUser);
  const refreshToken = signRefreshToken(existingUser);

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
    refreshTTL: REFRESH_TTL_MS,
    user: {
      id: existingUser._id,
      fullName: existingUser.fullName,
      email: existingUser.email,
      role: existingUser.role,
      isVerified: existingUser.isVerified,
    },
  };
};

// =============================== REFRESH TOKEN ===============================
export const refreshTokenService = async (
  oldRefreshToken,
  { device = "web", ip, userAgent } = {}
) => {
  if (!oldRefreshToken) throw new AppError("Refresh token required", 400);

  const payload = verifyRefreshToken(oldRefreshToken);
  const currentUser = await User.findById(payload.id);
  if (!currentUser) throw new AppError("Invalid refresh token", 401);

  if (!currentUser.hasRefreshSession(oldRefreshToken)) {
    await currentUser.clearAllSessions();
    throw new AppError("Refresh token revoked or reused. Login again.", 401);
  }

  const newRefreshToken = signRefreshToken(currentUser);
  await currentUser.rotateRefreshSession(oldRefreshToken, newRefreshToken, {
    device,
    ip,
    userAgent,
    ttlMs: REFRESH_TTL_MS,
  });

  const newAccessToken = signToken(currentUser);

  return {
    token: newAccessToken,
    refreshToken: newRefreshToken,
    refreshTTL: REFRESH_TTL_MS,
  };
};

// =============================== LOGOUT ===============================
export const logoutUser = async (refreshToken) => {
  if (!refreshToken) return { message: "No token provided" };

  try {
    const payload = verifyRefreshToken(refreshToken);
    const currentUser = await User.findById(payload.id);
    if (currentUser) await currentUser.removeRefreshSession(refreshToken);
  } catch (err) {}

  return { message: "Logged out successfully" };
};

// =============================== FORGOT PASSWORD ===============================
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

  return { resetURL };
};

// =============================== RESET PASSWORD ===============================
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

  await currentUser.clearAllSessions();
  await currentUser.save();

  const accessToken = signToken(currentUser);
  const refreshToken = signRefreshToken(currentUser);

  await currentUser.addRefreshSession({
    refreshToken,
    device: "password-reset",
    ip: null,
    userAgent: null,
    ttlMs: REFRESH_TTL_MS,
  });

  return {
    accessToken,
    refreshToken,
    refreshTTL: REFRESH_TTL_MS,
    user: {
      id: currentUser._id,
      fullName: currentUser.fullName,
      email: currentUser.email,
      role: currentUser.role,
    },
  };
};

// =============================== VERIFY EMAIL ===============================
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

// =============================== RESEND VERIFY EMAIL ===============================
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

// =============================== CHANGE PASSWORD ===============================
export const changePassword = async (userId, oldPassword, newPassword) => {
  const currentUser = await User.findById(userId).select("+password");
  if (!currentUser) throw new AppError("User not found", 404);

  const isMatch = await currentUser.comparePassword(oldPassword);
  if (!isMatch) throw new AppError("Old password incorrect", 400);

  currentUser.password = newPassword;
  currentUser.passwordConfirm = newPassword;

  await currentUser.clearAllSessions();
  await currentUser.save();

  const accessToken = signToken(currentUser);
  const refreshToken = signRefreshToken(currentUser);

  await currentUser.addRefreshSession({
    refreshToken,
    device: "password-change",
    ip: null,
    userAgent: null,
    ttlMs: REFRESH_TTL_MS,
  });

  return {
    user: {
      id: currentUser._id,
      fullName: currentUser.fullName,
      email: currentUser.email,
      role: currentUser.role,
    },
    refreshToken,
    refreshTTL: REFRESH_TTL_MS,
  };
};
