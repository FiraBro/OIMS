import express from "express";
import { createAdminUser } from "../controllers/adminController.js";
import { protect } from "../middlewares/protect.js";
import { restrictTo } from "../middlewares/protect.js";
import { ROLES } from "../constants/roles.js";
const router = express.Router();

// Only logged-in admin can create another admin
router.post("/create", protect, restrictTo(ROLES.ADMIN), createAdminUser);

export default router;
