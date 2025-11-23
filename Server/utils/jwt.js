// utils/jwt.js
import jwt from "jsonwebtoken";

export const signToken = (
  user,
  expiresIn = process.env.JWT_ACCESS_EXPIRES || "15m"
) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn,
  });
};

export const signRefreshToken = (
  user,
  expiresIn = process.env.JWT_REFRESH_EXPIRES || "30d"
) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn,
  });
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    const e = new Error("Invalid or expired refresh token");
    e.statusCode = 401;
    throw e;
  }
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    const e = new Error("Invalid or expired access token");
    e.statusCode = 401;
    throw e;
  }
};
