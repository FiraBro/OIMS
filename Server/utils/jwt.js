import jwt from "jsonwebtoken";

//  Generate JWT access token for a user

export const signToken = (user, expiresIn = "7d") => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

//  Generate JWT refresh token for a user

export const signRefreshToken = (user, expiresIn = "30d") => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn,
  });
};

// Verify refresh token

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new Error("Invalid or expired refresh token");
  }
};
