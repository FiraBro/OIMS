import express from "express";
import { getAdminAnalytics } from "../controllers/analyticController.js";
import {
  getSettings,
  updateSettings,
} from "../controllers/settingController.js";
import { protect, restrictTo } from "../middlewares/protect.js";
import { ROLES } from "../constants/roles.js";
const router = express.Router();

// PROTECT ALL ADMIN ROUTES
router.use(protect, restrictTo(ROLES.ADMIN));

// Analytics
router.get("/analytics/financials", getAdminAnalytics);

// Settings
router.get("/settings", getSettings);
router.patch("/settings", updateSettings);

export default router;
