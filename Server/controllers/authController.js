// controllers/authController.js
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshTokenService,
  forgotPasswordService,
  resetPasswordService,
  verifyEmailService,
  sendVerificationEmailService,
} from "../services/authService.js";

const REFRESH_TTL_MS = parseInt(
  process.env.REFRESH_TTL_MS || `${30 * 24 * 60 * 60 * 1000}`
);
const ACCESS_TTL_MS = 15 * 60 * 1000; // 15 minutes

const setAuthCookies = (res, { accessToken, refreshToken }) => {
  // Access token as httpOnly cookie (short lived)
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: ACCESS_TTL_MS,
  });

  // Refresh token as httpOnly cookie (long lived)
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: REFRESH_TTL_MS,
  });
};

// REGISTER
export const register = catchAsync(async (req, res) => {
  const user = await registerUser(req.body);
  res.status(201).json({ status: "success", message: "Registered", user });
});

// LOGIN
export const login = catchAsync(async (req, res) => {
  const device = req.headers["x-device-name"] || req.body.device || "web";
  const ip = req.ip;
  const userAgent = req.get("User-Agent");

  const result = await loginUser(req.body, { device, ip, userAgent });

  setAuthCookies(res, {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });

  res.status(200).json({
    status: "success",
    message: "Login successful",
    user: result.user,
  });
});

// REFRESH
export const refresh = catchAsync(async (req, res) => {
  const oldRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
  if (!oldRefreshToken) throw new AppError("Refresh token required", 400);

  const device = req.headers["x-device-name"] || "web";
  const ip = req.ip;
  const userAgent = req.get("User-Agent");

  const { token: newAccessToken, refreshToken: newRefreshToken } =
    await refreshTokenService(oldRefreshToken, { device, ip, userAgent });

  setAuthCookies(res, {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });

  res.json({ status: "success" });
});

// LOGOUT
export const logout = catchAsync(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
  await logoutUser(refreshToken);
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ status: "success", message: "Logged out" });
});

// FORGOT
export const forgotPassword = catchAsync(async (req, res) => {
  await forgotPasswordService(req.body.email);
  res.json({ status: "success", message: "Password reset email sent" });
});

// RESET
export const resetPassword = catchAsync(async (req, res) => {
  const { token } = req.params;
  const result = await resetPasswordService(token, req.body.password);
  // set new cookies
  setAuthCookies(res, {
    accessToken: result.token,
    refreshToken: result.refreshToken || "",
  });
  res.json({ status: "success", message: "Password reset" });
});

// EMAIL VERIFY
export const verifyEmail = catchAsync(async (req, res) => {
  await verifyEmailService(req.params.token);
  res.json({ status: "success", message: "Email verified" });
});

// RESEND VERIFY
export const resendVerification = catchAsync(async (req, res) => {
  const userId = req.user?.id || req.body.userId;
  if (!userId) throw new AppError("User required", 400);
  await sendVerificationEmailService(userId);
  res.json({ status: "success", message: "Verification email sent" });
});
