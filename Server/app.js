import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import "./cron/escalation.js";
import authRouter from "./routes/authRoutes.js";
import insurancePlanRouter from "./routes/planRoutes.js";
import policyRoute from "./routes/policyRoutes.js";
import claimRouter from "./routes/claimRoutes.js";
import userRouter from "./routes/userRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";

import AppError from "./utils/AppError.js";
import globalErrorHandler from "./middlewares/errorHandler.js";

// Load environment variables
dotenv.config();

const app = express();

// ===== Middleware =====
app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true); // allow all origins
    },
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ===== Home Route =====
app.get("/", (req, res) => {
  res.send("API is running...");
});
const versions = "v1";
// ===== API Routes =====
app.use(`/api/${versions}/auth`, authRouter);
app.use(`/api/${versions}/plans`, insurancePlanRouter);
app.use(`/api/${versions}/policies`, policyRoute);
app.use(`/api/${versions}/claims`, claimRouter);
app.use(`/api/${versions}/users`, userRouter);
app.use(`/api/${versions}/notifications`, notificationRouter);
app.use(`/api/${versions}/admin`, adminRoutes);
app.use(`/api/${versions}/dashboard`, dashboardRoutes);
app.use(`/api/${versions}/support/tickets`, ticketRoutes);
app.use(`/api/${versions}/applications`, applicationRoutes);

// ===== 404 Handler (No *) =====
app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// ===== Global Error Handler =====
app.use(globalErrorHandler);

export default app;
