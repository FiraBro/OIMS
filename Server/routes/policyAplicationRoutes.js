import express from "express";
import {
  applyForPolicy,
  getAllApplications,
  updateApplicationStatus,
} from "../controllers/policyApplicationController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/apply", protect, upload.array("documents", 3), applyForPolicy);
router.get(
  "/admin/all",
  protect,
  isAdmin,
  authorizeRoles("admin"),
  getAllApplications
);
router.put(
  "/admin/:id/status",
  protect,
  isAdmin,
  authorizeRoles("admin"),
  updateApplicationStatus
);

export default router;
