// validators/insurancePlanValidator.js
import { body, query } from "express-validator";

export const createPlanValidator = [
  body("name").notEmpty().withMessage("Plan name is required"),
  body("premium")
    .isFloat({ min: 1 })
    .withMessage("Premium must be a positive number"),
  body("coverageAmount")
    .isFloat({ min: 1 })
    .withMessage("Coverage amount must be a positive number"),
  body("description").optional().isString(),
  body("planType")
    .optional()
    .isIn(["individual", "family", "student"])
    .withMessage("Invalid plan type"),
];

export const updatePlanValidator = [
  body("name").optional().isString(),
  body("premium").optional().isFloat({ min: 1 }),
  body("coverageAmount").optional().isFloat({ min: 1 }),
  body("description").optional().isString(),
  body("planType").optional().isIn(["individual", "family", "student"]),
];

export const filterPlansValidator = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1 }),
  query("sortBy").optional().isString(),
  query("order").optional().isIn(["asc", "desc"]),
  query("planType").optional().isIn(["individual", "family", "student"]),
  query("status").optional().isIn(["draft", "published"]),
  query("minPremium").optional().isFloat({ min: 0 }),
  query("maxPremium").optional().isFloat({ min: 0 }),
  query("search").optional().isString(),
];
