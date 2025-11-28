import express from "express";
import * as claimController from "../controllers/claimController.js";
import { protect, restrictTo } from "../middlewares/protect.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

// User endpoints
router.post("/", protect, claimController.createClaim);
router.get("/me", protect, claimController.getMyClaims);
router.get("/:id", protect, claimController.getClaimById);

// Admin endpoints
router.get(
  "/",
  protect,
  restrictTo(ROLES.ADMIN),
  claimController.listAllClaims
);
router.patch(
  "/:id/status",
  protect,
  restrictTo(ROLES.ADMIN),
  claimController.updateStatus
);
router.delete(
  "/:id",
  protect,
  restrictTo(ROLES.ADMIN),
  claimController.softDeleteClaim
);

export default router;
