import * as authService from "../services/authService.js";
import catchAsync from "../utils/catchAsync.js";

// =============================== REGISTER ===============================
export const register = catchAsync(async (req, res) => {
  // Input validation handled by validator middleware
  const result = await authService.registerUser(req.body);
  res.status(201).json({ status: "success", data: result });
});

// =============================== LOGIN ===============================
export const login = catchAsync(async (req, res) => {
  const { accessToken, user } = await authService.loginUser(req.body);
  res.json({ status: "success", data: { accessToken, user } });
});

// =============================== LOGOUT ===============================
export const logout = catchAsync(async (req, res) => {
  await authService.logoutUser();
  res.json({ status: "success", message: "Logged out successfully" });
});

// =============================== FORGOT PASSWORD ===============================
export const forgotPassword = catchAsync(async (req, res) => {
  const { resetURL } = await authService.forgotPasswordService(req.body.email);
  res.json({ status: "success", data: { resetURL } });
});

// =============================== RESET PASSWORD ===============================
export const resetPassword = catchAsync(async (req, res) => {
  const data = await authService.resetPasswordService(
    req.params.token,
    req.body.password
  );
  res.json({ status: "success", data });
});

// =============================== VERIFY EMAIL ===============================
export const verifyEmail = catchAsync(async (req, res) => {
  const result = await authService.verifyEmailService(req.params.token);
  res.json({ status: "success", data: result });
});

// =============================== RESEND VERIFICATION ===============================
export const resendVerification = catchAsync(async (req, res) => {
  const result = await authService.sendVerificationEmailService(req.user.id);
  res.json({ status: "success", data: result });
});

// =============================== CHANGE PASSWORD ===============================
export const changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const data = await authService.changePassword(
    req.user.id,
    oldPassword,
    newPassword
  );
  res.json({ status: "success", data });
});

// =============================== UPDATE EMAIL ===============================
export const updateEmail = catchAsync(async (req, res) => {
  const result = await authService.updateEmail(req.user.id, req.body.newEmail);
  res.json({ status: "success", data: result });
});
