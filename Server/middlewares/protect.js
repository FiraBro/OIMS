// middlewares/protect.js
import { verifyAccessToken } from "../utils/jwt.js";
import AppError from "../utils/AppError.js";
import User from "../models/user.js";
import { ROLES } from "../constants/roles.js"; // ✅ import roles

// -----------------------------
// Protect route
// -----------------------------
export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return next(new AppError("Not logged in", 401));
    }

    const payload = await verifyAccessToken(token);

    const currentUser = await User.findById(payload.id);
    if (!currentUser) {
      return next(new AppError("User no longer exists", 401));
    }

    req.user = { id: currentUser._id, role: currentUser.role };
    next();
  } catch (err) {
    next(err);
  }
};

// -----------------------------
// Admin only
// -----------------------------
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== ROLES.ADMIN) {
    return next(new AppError("Admin access required", 403));
  }
  next();
};

// -----------------------------
// Generic Role Restriction
// -----------------------------
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
