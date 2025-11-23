import catchAsync from "../utils/catchAsync.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPasswordService,
  resetPasswordService,
} from "../services/authService.js";

export const register = catchAsync(async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: "success",
    message: "User registered successfully",
    user,
  });
});

export const login = catchAsync(async (req, res) => {
  const result = await loginUser(req.body);

  res.status(200).json({
    status: "success",
    message: "Login successful",
    ...result,
  });
});
export const logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.body; // make sure the client sends the refresh token
  if (!refreshToken) {
    return res.status(400).json({
      status: "fail",
      message: "Refresh token is required",
    });
  }

  const result = await logoutUser(refreshToken);

  res.status(200).json({
    status: "success",
    message: result.message,
  });
});

export const forgotPassword = catchAsync(async (req, res) => {
  const resetURL = await forgotPasswordService(req.body.email);

  res.status(200).json({
    status: "success",
    message: "Reset password link sent to email",
    resetURL, // remove in production
  });
});

export const resetPassword = catchAsync(async (req, res) => {
  const result = await resetPasswordService(
    req.params.token,
    req.body.password
  );

  res.status(200).json({
    status: "success",
    message: "Password reset successfully",
    ...result,
  });
});
