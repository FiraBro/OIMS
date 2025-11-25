// routes/insurancePlanRoutes.js
import express from "express";
import { protect, restrictTo } from "../middlewares/protect.js";
import { handleValidation } from "../utils/handleValidation.js";
import {
  createPlanController,
  updatePlanController,
  deletePlanController,
  listPlansAdminController,
  listPlansPublicController,
  getPremiumStatsController,
} from "../controllers/insurancePlanController.js";
import {
  createPlanValidator,
  updatePlanValidator,
  filterPlansValidator,
} from "../validators/insurancePlanValidator.js";

const router = express.Router();

// Public routes
router.get("/public", filterPlansValidator, listPlansPublicController);
router.get("/stats", getPremiumStatsController);

// Admin-only routes
router.use(protect, restrictTo("admin"));
router.get(
  "/",
  filterPlansValidator,
  handleValidation,
  listPlansAdminController
);
router.post("/", createPlanValidator, handleValidation, createPlanController);
router.put("/:id", updatePlanValidator, handleValidation, updatePlanController);
router.delete("/:id", deletePlanController);

export default router;
