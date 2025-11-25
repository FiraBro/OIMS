import { validationResult } from "express-validator";
import AppError from "./AppError.js";
export const handleValidation = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array()[0].msg, 400);
  }
};
