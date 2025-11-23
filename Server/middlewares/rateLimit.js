// middleware/rateLimit.js
import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { status: "fail", message: "Too many requests. Try later." },
  legacyHeaders: false,
  standardHeaders: true,
});
