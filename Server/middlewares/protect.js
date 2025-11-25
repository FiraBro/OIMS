// middlewares/protect.js
import { verifyAccessToken } from "../utils/jwt.js";
import AppError from "../utils/AppError.js";
import User from "../models/user.js";

// Protect route (check JWT)
export const protect = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) throw new AppError("Not logged in", 401);

    const payload = verifyAccessToken(token);
    const currentUser = await User.findById(payload.id);
    if (!currentUser) throw new AppError("User no longer exists", 401);

    req.user = { id: currentUser._id, role: currentUser.role };
    next();
  } catch (err) {
    next(err);
  }
};

// Check admin role (middleware)
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return next(new AppError("Admin access required", 403));
  }
  next();
};

// Generic role check middleware
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError(`You do not have permission to perform this action`, 403)
      );
    }
    next();
  };
};
