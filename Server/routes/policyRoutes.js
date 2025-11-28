import express from "express";
import { protect, restrictTo } from "../middlewares/protect.js";
import { ROLES } from "../constants/roles.js";
import {
  enrollPolicy,
  getMyPolicies,
  getPolicyById,
  listAllPolicies,
  updateStatus,
  renewPolicy,
  cancelPolicy,
  softDeletePolicy,
} from "../controllers/policyController.js";

import {
  createPolicyValidator,
  updateStatusValidator,
  paginationValidator,
} from "../validators/policyValidator.js";

import { handleValidation } from "../utils/handleValidation.js";

const router = express.Router();

// USER ROUTES
router.post(
  "/enroll",
  protect,
  createPolicyValidator,
  handleValidation,
  enrollPolicy
);

router.get("/my", protect, getMyPolicies);

// ADMIN ROUTES
router.get(
  "/",
  protect,
  restrictTo(ROLES.ADMIN),
  paginationValidator,
  handleValidation,
  listAllPolicies
);

router.get("/:id", protect, restrictTo(ROLES.ADMIN), getPolicyById);

router.put(
  "/:id/status",
  protect,
  restrictTo(ROLES.ADMIN),
  updateStatusValidator,
  handleValidation,
  updateStatus
);

router.put("/:id/renew", protect, restrictTo(ROLES.ADMIN), renewPolicy);

router.put("/:id/cancel", protect, restrictTo(ROLES.ADMIN), cancelPolicy);

router.delete("/:id", protect, restrictTo(ROLES.ADMIN), softDeletePolicy);

export default router;
