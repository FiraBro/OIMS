import express from "express";
import { protect, restrictTo } from "../middlewares/protect.js";
import { ROLES } from "../constants/roles.js";

import {
  getMyPolicies,
  getPolicyById,
  listPolicies, // FIX
  updatePolicyStatus, // FIX
  renewPolicy,
  cancelPolicy,
  deletePolicy, // FIX
} from "../controllers/policyController.js";

import {
  updateStatusValidator,
  paginationValidator,
} from "../validators/policyValidator.js";

import { handleValidation } from "../utils/handleValidation.js";

const router = express.Router();

// USER ROUTE
router.get("/my", protect, getMyPolicies);

// ADMIN ROUTES
router.get(
  "/",
  protect,
  restrictTo(ROLES.ADMIN),
  paginationValidator,
  handleValidation,
  listPolicies // FIX
);

router.get("/:id", protect, restrictTo(ROLES.ADMIN), getPolicyById);

router.put(
  "/:id/status",
  protect,
  restrictTo(ROLES.ADMIN),
  updateStatusValidator,
  handleValidation,
  updatePolicyStatus // FIX
);

router.put("/:id/renew", protect, restrictTo(ROLES.ADMIN), renewPolicy);

router.put("/:id/cancel", protect, restrictTo(ROLES.ADMIN), cancelPolicy);

router.delete("/:id", protect, restrictTo(ROLES.ADMIN), deletePolicy); // FIX

export default router;
