import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

// Define roles
const ROLES = ["customer", "admin", "agent"];

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Passwords do not match!",
    },
  },

  role: {
    type: String,
    enum: ROLES,
    default: "customer",
  },

  phone: {
    type: String,
    required: true,
  },

  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },

  dateOfBirth: {
    type: Date,
    required: true,
  },

  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },

  profilePicture: {
    type: String,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  // For forgot/reset password
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  // For refresh tokens
  refreshTokens: [String], // can store multiple tokens
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordConfirm = undefined;

  next();
});

// Compare password method
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate password reset token
userSchema.methods.getResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min

  return resetToken;
};

// Add refresh token
userSchema.methods.addRefreshToken = function (token) {
  this.refreshTokens.push(token);
  return this.save();
};

// Remove refresh token (logout)
userSchema.methods.removeRefreshToken = function (token) {
  this.refreshTokens = this.refreshTokens.filter((t) => t !== token);
  return this.save();
};

// Check if refresh token exists
userSchema.methods.hasRefreshToken = function (token) {
  return this.refreshTokens.includes(token);
};

const User = mongoose.model("User", userSchema);
export default User;
