import express from "express";
import {
  submitClaim,
  updateClaimStatus,
} from "../controllers/claimController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";
import upload from "../middleware/upload.js";
const router = express.Router();

// User submits claim
router.post("/submit", protect, upload.single("document"), submitClaim);

// Admin approves/rejects claim
router.put("/status/:id", protect, admin, updateClaimStatus);

export default router;
