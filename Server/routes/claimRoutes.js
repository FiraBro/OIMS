import express from "express";
import * as claimController from "../controllers/claimController.js";
import { protect, restrictTo } from "../middlewares/protect.js";

const router = express.Router();

// User endpoints
router.post("/", protect, claimController.createClaim);
router.get("/me", protect, claimController.getMyClaims);
router.get("/:id", protect, claimController.getClaimById);

// Admin endpoints
router.get("/", protect, restrictTo("admin"), claimController.listAllClaims);
router.patch(
  "/:id/status",
  protect,
  restrictTo("admin"),
  claimController.updateStatus
);
router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  claimController.softDeleteClaim
);

export default router;
