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
} from "../controllers/planController.js";

import {
  createPlanValidator,
  updatePlanValidator,
  filterPlansValidator,
} from "../validators/insurancePlanValidator.js";

const router = express.Router();

// ========== Public Routes ==========
router.get(
  "/public",
  filterPlansValidator,
  handleValidation,
  listPlansPublicController
);

router.get("/stats", getPremiumStatsController);

// ========== Admin Only Routes ==========
router.use(protect); // only logged-in users
router.use(restrictTo(ROLES.ADMIN)); // only admins below this line

// Filter / List all plans (admin)
router.get(
  "/filter",
  filterPlansValidator,
  handleValidation,
  listPlansAdminController
);

// Create plan
router.post("/", createPlanValidator, handleValidation, createPlanController);

// Update plan
router.patch(
  "/:id",
  updatePlanValidator,
  handleValidation,
  updatePlanController
);

// Soft delete plan
router.delete("/:id", deletePlanController);

// 👉 Get single plan by ID (admin) - ALWAYS LAST
router.get("/:id", getPlanByIdController);

export default router;
