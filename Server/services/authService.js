import User from "../models/user.js";
import AppError from "../utils/AppError.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import {
  signToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

// ========================= REGISTER ==============================
export const registerUser = async (data) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) throw new AppError("Email already registered", 409);

  const user = await User.create(data);

  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
};

// ============================ LOGIN =============================
export const loginUser = async ({ email, password }) => {
  if (!email || !password)
    throw new AppError("Email and password are required", 400);

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new AppError("Invalid credentials", 401);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError("Invalid credentials", 401);

  // Generate access and refresh tokens
  const token = signToken(user);
  const refreshToken = signRefreshToken(user);

  // Save refresh token in DB
  await user.addRefreshToken(refreshToken);

  return {
    token,
    refreshToken,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
};

// ===================== REFRESH TOKEN ===========================
export const refreshTokenService = async (refreshToken) => {
  if (!refreshToken) throw new AppError("Refresh token required", 400);

  // Verify refresh token
  const payload = verifyRefreshToken(refreshToken);

  const user = await User.findById(payload.id);
  if (!user || !user.hasRefreshToken(refreshToken))
    throw new AppError("Invalid refresh token", 401);

  // Generate new access token
  const newToken = signToken(user);

  return { token: newToken };
};

// ====================== LOGOUT ================================
export const logoutUser = async (refreshToken) => {
  const payload = verifyRefreshToken(refreshToken);
  const user = await User.findById(payload.id);
  if (user) await user.removeRefreshToken(refreshToken);

  return { message: "Logged out successfully" };
};

// ======================== FORGOT PASSWORD =========================
export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError("User not found with this email", 404);

  const resetToken = user.getResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  if (sendEmail) {
    await sendEmail({
      email: user.email,
      subject: "Password Reset",
      message: `Reset your password here: ${resetURL}`,
    });
  }

  return resetURL;
};

// ========================== RESET PASSWORD =========================
export const resetPasswordService = async (token, newPassword) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) throw new AppError("Invalid or expired token", 400);

  user.password = newPassword;
  user.passwordConfirm = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  const authToken = signToken(user);

  return {
    token: authToken,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
};
