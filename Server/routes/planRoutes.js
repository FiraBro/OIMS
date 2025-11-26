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
router.use(restrictTo("admin")); // only admins below this line

router.get(
  "/",
  filterPlansValidator,
  handleValidation,
  listPlansAdminController
);

router.post("/", createPlanValidator, handleValidation, createPlanController);

router.patch(
  "/:id",
  updatePlanValidator,
  handleValidation,
  updatePlanController
);

router.delete("/:id", deletePlanController);

export default router;
