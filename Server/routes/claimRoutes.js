import express from "express";
import {
  submitClaim,
  updateClaimStatus,
} from "../controllers/claimController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
const claimRouter = express.Router();

// User submits claim
claimRouter.post("/submit", protect, upload.single("document"), submitClaim);

// Admin approves/rejects claim
claimRouter.put("/status/:id", protect, isAdmin, updateClaimStatus);

export default claimRouter;
