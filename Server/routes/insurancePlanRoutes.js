import express from "express";
import {
  createPlan,
  updatePlan,
  deletePlan,
  listPlansAdmin,
  listPlansPublic,
  countPlan,
  sumPlanPremiums,
} from "../controllers/insurancePlanController.js";

import { isAdmin, protect } from "../middleware/authMiddleware.js";

const insurancePlanRouter = express.Router();

// Admin routes - protect with middleware
insurancePlanRouter.post("/create", protect, isAdmin, createPlan);
insurancePlanRouter.put("/:id", protect, isAdmin, updatePlan);
insurancePlanRouter.delete("/:id", protect, isAdmin, deletePlan);
insurancePlanRouter.get("/admin", protect, isAdmin, listPlansAdmin);
insurancePlanRouter.get("/count", protect, isAdmin, countPlan);
insurancePlanRouter.get("/sum", protect, isAdmin, sumPlanPremiums);

// Public route - no auth needed
insurancePlanRouter.get("/", listPlansPublic);

export default insurancePlanRouter;
