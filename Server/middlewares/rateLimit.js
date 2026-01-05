import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redisClient } from "../config/redis.js";

// Helper to create a store with a custom prefix
const createStore = (prefix) =>
  new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: `rl:${prefix}:`,
  });

// --- AUTH LIMITER ---
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  store: createStore("auth"),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many login attempts. Blocked for 15m.",
  },
});

// --- ANALYTICS LIMITER ---
export const analyticsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60, // 60 requests per minute
  store: createStore("analytics"),
  standardHeaders: true,
  message: { status: 429, message: "Dashboard refresh limit reached." },
});
