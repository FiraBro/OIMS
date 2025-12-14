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
    .isIn(["individual", "family", "student", "group", "senior", "corporate"])
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
  query("page").optional({ checkFalsy: true }).isInt({ min: 1 }),
  query("limit").optional({ checkFalsy: true }).isInt({ min: 1 }),
  query("sortBy").optional({ checkFalsy: true }).isString(),
  query("order").optional({ checkFalsy: true }).isIn(["asc", "desc"]),
  query("planType")
    .optional({ checkFalsy: true })
    .isIn(["individual", "family", "student", "group", "senior", "corporate"]),
  query("status").optional({ checkFalsy: true }).isIn(["draft", "published"]),
  query("minPremium").optional({ checkFalsy: true }).isFloat({ min: 0 }),
  query("maxPremium").optional({ checkFalsy: true }).isFloat({ min: 0 }),
  query("search").optional({ checkFalsy: true }).isString(),
];
