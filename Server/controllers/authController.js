import catchAsync from "../utils/catchAsync.js";
import {
  registerUser,
  loginUser,
  forgotPasswordService,
  resetPasswordService,
} from "../services/authService.js";

export const register = catchAsync(async (req, res, next) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: "success",
    message: "User registered successfully",
    user,
  });
});

export const login = catchAsync(async (req, res, next) => {
  const result = await loginUser(req.body);

  res.status(200).json({
    status: "success",
    message: "Login successful",
    ...result,
  });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const resetURL = await forgotPasswordService(req.body.email);

  res.status(200).json({
    status: "success",
    message: "Reset password link sent to email",
    resetURL, // remove in production
  });
});

export const resetPassword = catchAsync(async (req, res, next) => {
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
