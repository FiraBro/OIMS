import express from "express";
import {
  applyForPolicy,
  approveApplication,
  rejectApplication,
  getMyApplications,
  listApplications,
  deleteApplication,
} from "../controllers/applicationController.js";

import { protect, restrictTo } from "../middlewares/protect.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

// ===========================
// USER ROUTES
// ===========================
router.post("/apply", protect, restrictTo(ROLES.USER), applyForPolicy);

router.get(
  "/my-applications",
  protect,
  restrictTo(ROLES.USER),
  getMyApplications
);

// ===========================
// ADMIN ROUTES
// ===========================
router.get("/", protect, restrictTo(ROLES.ADMIN), listApplications);

router.patch(
  "/approve/:id",
  protect,
  restrictTo(ROLES.ADMIN),
  approveApplication
);

router.patch(
  "/reject/:id",
  protect,
  restrictTo(ROLES.ADMIN),
  rejectApplication
);

router.delete("/:id", protect, restrictTo(ROLES.ADMIN), deleteApplication);

export default router;
