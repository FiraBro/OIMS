// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const ROLES = ["customer", "admin", "agent"];

const refreshSessionSchema = new mongoose.Schema({
  tokenHash: { type: String, required: true },
  device: { type: String, default: "unknown" },
  ip: { type: String },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

// Auto-delete expired refresh sessions
refreshSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },

  password: { type: String, required: true, minlength: 6, select: false },

  passwordConfirm: {
    type: String,
    required: function () {
      return this.isNew;
    },
    validate: {
      validator: function (val) {
        return this.password === val;
      },
      message: "Passwords do not match!",
    },
    select: false,
  },

  role: { type: String, enum: ROLES, default: "customer" },

  phone: { type: String },

  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },

  dateOfBirth: { type: Date },
  gender: { type: String, enum: ["male", "female", "other"] },
  profilePicture: { type: String },

  isVerified: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },

  // Password reset
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  // Email verify
  emailVerifyToken: String,
  emailVerifyExpire: Date,

  // Refresh token sessions
  refreshSessions: [refreshSessionSchema],

  // Rate limit
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
});

// Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// reset password token
userSchema.methods.getResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

// email verify token
userSchema.methods.createEmailVerifyToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.emailVerifyToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // expiration in minutes (default 24 hours = 1440 minutes)
  const expireMinutes = process.env.EMAIL_VERIFY_EXPIRES_MINUTES
    ? parseInt(process.env.EMAIL_VERIFY_EXPIRES_MINUTES)
    : 1440;

  this.emailVerifyExpire = Date.now() + expireMinutes * 60 * 1000; // convert minutes → ms

  return token;
};

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

// === Refresh Token Methods ===
userSchema.methods.addRefreshSession = async function ({
  refreshToken,
  device = "unknown",
  ip,
  userAgent,
  ttlMs,
}) {
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + ttlMs);
  this.refreshSessions.push({ tokenHash, device, ip, userAgent, expiresAt });
  return this.save();
};

userSchema.methods.hasRefreshSession = function (refreshToken) {
  const tokenHash = hashToken(refreshToken);
  return this.refreshSessions.some(
    (s) => s.tokenHash === tokenHash && s.expiresAt > Date.now()
  );
};

userSchema.methods.removeRefreshSession = async function (refreshToken) {
  const tokenHash = hashToken(refreshToken);
  this.refreshSessions = this.refreshSessions.filter(
    (s) => s.tokenHash !== tokenHash
  );
  return this.save();
};

userSchema.methods.rotateRefreshSession = async function (
  oldToken,
  newToken,
  { device = "unknown", ip, userAgent, ttlMs }
) {
  const oldHash = hashToken(oldToken);
  this.refreshSessions = this.refreshSessions.filter(
    (s) => s.tokenHash !== oldHash
  );

  const newHash = hashToken(newToken);
  this.refreshSessions.push({
    tokenHash: newHash,
    device,
    ip,
    userAgent,
    expiresAt: new Date(Date.now() + ttlMs),
  });

  return this.save();
};

userSchema.methods.clearAllSessions = async function () {
  this.refreshSessions = [];
  return this.save();
};

// brute force
userSchema.methods.incrementLoginAttempts = async function (
  maxAttempts = 5,
  lockTimeMs = 15 * 60 * 1000
) {
  this.loginAttempts = (this.loginAttempts || 0) + 1;
  if (this.loginAttempts >= maxAttempts) {
    this.lockUntil = new Date(Date.now() + lockTimeMs);
  }
  return this.save();
};

userSchema.methods.resetLoginAttempts = async function () {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  return this.save();
};

export default mongoose.model("User", userSchema);
