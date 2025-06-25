import express from "express";
import {
  getAllUser,
  getUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
const userRouter = express.Router();

userRouter.get("/all", protect, isAdmin, getAllUser);
userRouter.delete("/delete/:id", protect, isAdmin, deleteUser);

export default policyRouter;
