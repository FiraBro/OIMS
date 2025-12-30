import * as userService from "../services/userService.js";
import catchAsync from "../utils/catchAsync.js";

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await userService.getAllUsers();
  res
    .status(200)
    .json({ status: "success", results: users.length, data: { users } });
});

export const getUser = catchAsync(async (req, res, next) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json({ status: "success", data: { user } });
});

export const updateUser = catchAsync(async (req, res, next) => {
  const user = await userService.updateUser(req.params.id, req.body);
  res.status(200).json({ status: "success", data: { user } });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  await userService.deleteUser(req.params.id);
  res.status(204).json({ status: "success", data: null });
});
export const getUserAnalysis = catchAsync(async (req, res, next) => {
  const data = await userService.getUserStats();

  res.status(200).json({
    status: "success",
    data: {
      registeredUsers: data.users,
      planApplicants: data.applicants,
      summary: {
        totalRegistered: data.totalRegistered,
        totalApplicants: data.totalApplicants,
      },
    },
  });
});
