// utils/jwt.js
import jwt from "jsonwebtoken";

// =============================== SIGN ACCESS TOKEN ===============================
export const signToken = (
  user,
  expiresIn = process.env.JWT_ACCESS_EXPIRES || "15m"
) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn,
  });
};

// =============================== VERIFY ACCESS TOKEN ===============================
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    const error = new Error("Invalid or expired token");
    error.statusCode = 401;
    throw error;
  }
};
