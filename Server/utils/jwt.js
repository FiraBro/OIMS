// utils/jwt.js
import jwt from "jsonwebtoken";

/**
 * Generate JWT token for a user
 * @param {Object} user - User object
 * @param {string} expiresIn - Token expiration (default 7d)
 * @returns {string} JWT token
 */
export const signToken = (user, expiresIn = "7d") => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};
