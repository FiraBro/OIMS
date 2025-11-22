// app.js
import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

import authRouter from "./routes/authRoutes.js";
import insurancePlanRouter from "./routes/insurancePlanRoutes.js";
import PolicyRouter from "./routes/policyAplicationRoutes.js";
import claimRouter from "./routes/claimRoutes.js";
import userRouter from "./routes/userRoutes.js";

// Load env
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Home route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/plans", insurancePlanRouter);
app.use("/api/v1/policy", PolicyRouter);
app.use("/api/v1/claims", claimRouter);
app.use("/api/v1/user", userRouter);

export default app;
