// app.js
import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRouter from "./routes/authRoutes.js";
import insurancePlanRouter from "./routes/insurancePlanRoutes.js";
import PolicyRouter from "./routes/policyAplicationRoutes.js";
import claimRouter from "./routes/claimRoutes.js";
import userRouter from "./routes/userRoutes.js";

import AppError from "./utils/AppError.js";
import globalErrorHandler from "./middlewares/errorHandler.js";

// Load environment variables
dotenv.config();

const app = express();

// ===== Middleware =====
app.use(express.json());
app.use(cookieParser());
const allowedOrigin = [
  "http://localhost:3000",
  /^http:\/\/172\.23\.0\.\d+:5173$/,
];

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ===== Home Route =====
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ===== API Routes =====
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/plans", insurancePlanRouter);
app.use("/api/v1/policy", PolicyRouter);
app.use("/api/v1/claims", claimRouter);
app.use("/api/v1/user", userRouter);

// ===== 404 Handler (No *) =====
app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// ===== Global Error Handler =====
app.use(globalErrorHandler);

export default app;
