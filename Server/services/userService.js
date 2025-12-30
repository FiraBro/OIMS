import AppError from "../utils/AppError.js";
import User from "../models/user.js";
import Application from "../models/application.js";

export const getAllUsers = async () => {
  return await User.find().select("-__v");
};

export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new AppError("No user found with that ID", 404);
  return user;
};

export const updateUser = async (id, data) => {
  const user = await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new AppError("No user found with that ID", 404);
  return user;
};

export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new AppError("No user found with that ID", 404);
  return user;
};

export const getUserStats = async () => {
  // 1. Get all registered users
  const allUsers = await User.find().select("fullName email role createdAt");

  // 2. Get users who have at least one application (Plan Applicants)
  // We use .distinct() to ensure we don't list the same user twice if they applied for 2 plans
  const applicantIds = await Application.distinct("userId");

  const planApplicants = await User.find({
    _id: { $in: applicantIds },
  }).select("fullName email");

  return {
    totalRegistered: allUsers.length,
    totalApplicants: planApplicants.length,
    users: allUsers,
    applicants: planApplicants,
  };
};
