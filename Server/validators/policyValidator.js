import AppError from "../utils/AppError.js";
import { body, query } from "express-validator";

export const createPolicyValidator = [
  body("planId").notEmpty().withMessage("Plan ID is required"),
  body("startDate").isISO8601().withMessage("Valid start date required"),
  body("endDate").isISO8601().withMessage("Valid end date required"),
];

export const updateStatusValidator = [
  body("status")
    .isIn(["active", "renewed", "cancelled"])
    .withMessage("Invalid policy status"),
];

// Allowed sorting fields for safety (prevent NoSQL injection)
const ALLOWED_SORT_FIELDS = ["createdAt", "updatedAt", "name", "premium"];

export const paginationValidator = [
  // Page must be integer >= 1
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be an integer >= 1")
    .toInt(),

  // Limit must be integer >= 1 (but restrict max)
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
    .toInt(),

  // Sort field
  query("sortBy")
    .optional()
    .isString()
    .custom((value) => {
      if (!ALLOWED_SORT_FIELDS.includes(value)) {
        throw new AppError(
          `Invalid sort field. Allowed: ${ALLOWED_SORT_FIELDS.join(", ")}`,
          400
        );
      }
      return true;
    }),

  // Sort order
  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Order must be either 'asc' or 'desc'"),

  // Sanitize search text
  query("search").optional().trim().escape(),
];
