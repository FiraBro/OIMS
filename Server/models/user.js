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
    select: false, // Security: don't return on queries
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
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Only run if password was modified
  if (!this.isModified("password")) return next();

  // Hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // Remove confirm password so it is NOT stored in DB
  this.passwordConfirm = undefined;

  next();
});

// Password compare method
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

const User = mongoose.model("User", userSchema);
export default User;
