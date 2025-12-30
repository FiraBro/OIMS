import express from "express";
import * as userController from "../controllers/userController.js";
import { protect, restrictTo } from "../middlewares/protect.js";
const router = express.Router();

// Apply protection to all routes below
router.use(protect);

// Admin-only routes
router.use(restrictTo("admin"));

router.route("/").get(userController.getAllUsers);
// Get list of all users and identify plan applicants
router.get("/analysis", restrictTo("admin"), userController.getUserAnalysis);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
