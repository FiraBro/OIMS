import express from "express";
import { protect, restrictTo } from "../middlewares/protect.js";
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
  restrictTo("admin"),
  paginationValidator,
  handleValidation,
  listAllPolicies
);

router.get("/:id", protect, restrictTo("admin"), getPolicyById);

router.put(
  "/:id/status",
  protect,
  restrictTo("admin"),
  updateStatusValidator,
  handleValidation,
  updateStatus
);

router.put("/:id/renew", protect, restrictTo("admin"), renewPolicy);

router.put("/:id/cancel", protect, restrictTo("admin"), cancelPolicy);

router.delete("/:id", protect, restrictTo("admin"), softDeletePolicy);

export default router;
