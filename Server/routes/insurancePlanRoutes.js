import express from "express";
import {
  createPlan,
  updatePlan,
  deletePlan,
  listPlansAdmin,
  listPlansPublic,
} from "../controllers/insurancePlanController.js";

import { isAdmin } from "../middlewares/authMiddleware.js";

const insurancePlanRouter = express.Router();

// Admin routes - protect with middleware
insurancePlanRouter.post("/", isAdmin, createPlan);
insurancePlanRouter.put("/:id", isAdmin, updatePlan);
insurancePlanRouter.delete("/:id", isAdmin, deletePlan);
insurancePlanRouter.get("/admin", isAdmin, listPlansAdmin);

// Public route - no auth needed
router.get("/", listPlansPublic);

export default insurancePlanRouter;
