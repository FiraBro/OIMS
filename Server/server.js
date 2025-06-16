import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Basic Route
app.get("/", (req, res) => {
  res.send("API is running...");
});
import authRouter from "./routes/authRoutes.js";
import insurancePlanRouter from "./routes/insurancePlanRoutes.js";
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/plans", insurancePlanRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
