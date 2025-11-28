import express from "express";
import {
  getAllUser,
  getUser,
  deleteUser,
  countUser,
} from "../controllers/userController.js";
import { protect, restrictTo } from "../middlewares/protect.js";
import { ROLES } from "../constants/roles.js";
const userRouter = express.Router();

userRouter.get("/all", protect, restrictTo(ROLES.ADMIN), getAllUser);
userRouter.delete("/delete/:id", protect, restrictTo(ROLES.ADMIN), deleteUser);
userRouter.get("/count", protect, restrictTo(ROLES.ADMIN), countUser);
export default userRouter;
