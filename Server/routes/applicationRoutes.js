import express from "express";
import {
  applyForPolicy,
  getMyApplications,
  approveApplication,
  rejectApplication,
  listApplications,
  deleteApplication,
} from "../controllers/applicationController.js";
import { protect, restrictTo } from "../middlewares/protect.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

// USER ROUTES
router.post("/", protect, applyForPolicy);
router.get("/mine", protect, getMyApplications);

// ADMIN ROUTES
router.get("/", protect, restrictTo(ROLES.ADMIN), listApplications);
router.patch(
  "/:id/approve",
  protect,
  restrictTo(ROLES.ADMIN),
  approveApplication
);
router.patch(
  "/:id/reject",
  protect,
  restrictTo(ROLES.ADMIN),
  rejectApplication
);
router.delete("/:id", protect, restrictTo(ROLES.ADMIN), deleteApplication);

export default router;
