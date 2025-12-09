import express from "express";
import { protect, restrictTo } from "../middlewares/protect.js";
import { handleValidation } from "../utils/handleValidation.js";
import { ROLES } from "../constants/roles.js";

import {
  createPlanController,
  updatePlanController,
  deletePlanController,
  listPlansAdminController,
  listPlansPublicController,
  getPremiumStatsController,
  getPlanByIdController,
  getPopularPlansController,
} from "../controllers/planController.js";

import {
  createPlanValidator,
  updatePlanValidator,
  filterPlansValidator,
} from "../validators/insurancePlanValidator.js";

const router = express.Router();

// ==================== Public Routes ====================

// Get all published plans with optional filters
router.get(
  "/public",
  filterPlansValidator,
  handleValidation,
  listPlansPublicController
);

// Get popular plans
router.get("/popular", getPopularPlansController);

// Get premium statistics
router.get("/stats", getPremiumStatsController);

// Get single plan by ID (public)
router.get("/public/:id", getPlanByIdController);

// ==================== Admin Routes ====================

// All routes below require authentication
router.use(protect);

// Filter / List all plans (admin)
router.get(
  "/admin/filter",
  restrictTo(ROLES.ADMIN),
  filterPlansValidator,
  handleValidation,
  listPlansAdminController
);

// Create a new plan
router.post(
  "/admin",
  restrictTo(ROLES.ADMIN),
  createPlanValidator,
  handleValidation,
  createPlanController
);

// Update an existing plan
router.patch(
  "/admin/:id",
  restrictTo(ROLES.ADMIN),
  updatePlanValidator,
  handleValidation,
  updatePlanController
);

// Soft delete a plan
router.delete("/admin/:id", restrictTo(ROLES.ADMIN), deletePlanController);

// Get single plan by ID (admin)
router.get("/admin/:id", restrictTo(ROLES.ADMIN), getPlanByIdController);

export default router;
