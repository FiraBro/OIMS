import * as authService from "../services/authService.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import { setRefreshCookie } from "../utils/setRefreshCookie.js";

export const register = catchAsync(async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.status(201).json({ status: "success", data: result });
});

export const login = catchAsync(async (req, res) => {
  const { device } = req.body;
  const { accessToken, refreshToken, refreshTTL, user } =
    await authService.loginUser(
      { email: req.body.email, password: req.body.password },
      { device, ip: req.ip, userAgent: req.get("User-Agent") }
    );

  setRefreshCookie(res, refreshToken, refreshTTL);
  res.json({ status: "success", accessToken, user });
});

export const refresh = catchAsync(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) throw new AppError("Refresh token required", 401);
  const {
    token,
    refreshToken: newRefreshToken,
    refreshTTL,
  } = await authService.refreshTokenService(refreshToken, {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });
  setRefreshCookie(res, newRefreshToken, refreshTTL);
  res.json({ status: "success", accessToken: token });
});
export const logout = catchAsync(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  await authService.logoutUser(refreshToken);
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ status: "success", message: "Logged out" });
});

export const logoutAll = catchAsync(async (req, res) => {
  await authService.logoutAllDevices(req.user.id);
  res.clearCookie("refreshToken");
  res.json({ status: "success", message: "Logged out from all devices" });
});

export const forgotPassword = catchAsync(async (req, res) => {
  const { resetURL } = await authService.forgotPasswordService(req.body.email);
  res.json({ status: "success", resetURL });
});

export const resetPassword = catchAsync(async (req, res) => {
  const data = await authService.resetPasswordService(
    req.params.token,
    req.body.password
  );
  setRefreshCookie(res, data.refreshToken, data.refreshTTL || 0);
  res.json({ status: "success", data: data });
});
export const verifyEmail = catchAsync(async (req, res) => {
  const r = await authService.verifyEmailService(req.params.token);
  res.json({ status: "success", ...r });
});

export const resendVerification = catchAsync(async (req, res) => {
  const r = await authService.sendVerificationEmailService(req.user.id);
  res.json({ status: "success", ...r });
});

export const changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const data = await authService.changePassword(
    req.user.id,
    oldPassword,
    newPassword
  );
  res.clearCookie("refreshToken");
  setRefreshCookie(res, data.refreshToken, data.refreshTTL);
  res.json({ status: "success", data: data.user });
});
export const updateEmail = catchAsync(async (req, res) => {
  const { newEmail } = req.body;
  const r = await authService.updateEmail(req.user.id, newEmail);
  res.json({ status: "success", ...r });
});

export const getSessions = catchAsync(async (req, res) => {
  const sessions = await authService.getSessions(req.user.id);
  res.json({ status: "success", sessions });
});

export const revokeSession = catchAsync(async (req, res) => {
  const { sessionId } = req.params;
  await authService.revokeSession(req.user.id, sessionId);
  res.json({ status: "success", message: "Session revoked" });
});
