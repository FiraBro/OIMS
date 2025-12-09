import AppError from "../utils/AppError.js";
import { body, query, validationResult } from "express-validator";

// Allowed claim types
const ALLOWED_CLAIM_TYPES = [
  "Accident",
  "Medical",
  "Property Damage",
  "Theft",
  "Liability",
  "Natural Disaster",
];

// Allowed statuses
const ALLOWED_STATUSES = ["pending", "approved", "rejected"];

// Allowed file types & max size (10MB)
const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// ---------------------------
// Middleware to check validation results
// ---------------------------
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((err) => err.msg)
      .join(", ");
    return next(new AppError(message, 400));
  }
  next();
};

// ---------------------------
// Create Claim Validator
// ---------------------------
export const createClaimValidator = [
  body("policyId").notEmpty().withMessage("Policy ID is required"),
  body("claimType")
    .notEmpty()
    .withMessage("Claim type is required")
    .isIn(ALLOWED_CLAIM_TYPES)
    .withMessage(
      `Claim type must be one of: ${ALLOWED_CLAIM_TYPES.join(", ")}`
    ),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description should be at least 10 characters"),
  body("amount")
    .notEmpty()
    .withMessage("Claim amount is required")
    .isFloat({ min: 0.01 })
    .withMessage("Claim amount must be a positive number"),
  body("document").custom((value, { req }) => {
    const file = req.file;
    if (!file) throw new AppError("Supporting document is required", 400);
    if (!ALLOWED_FILE_TYPES.includes(file.mimetype))
      throw new AppError(
        "Invalid file type. Only PDF, JPG, PNG are allowed",
        400
      );
    if (file.size > MAX_FILE_SIZE)
      throw new AppError("File size must be less than 10MB", 400);
    return true;
  }),
];

// ---------------------------
// Update Claim Status Validator
// ---------------------------
export const updateClaimStatusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(ALLOWED_STATUSES)
    .withMessage(`Status must be one of: ${ALLOWED_STATUSES.join(", ")}`),
];

// ---------------------------
// Pagination Validator for Claims Listing
// ---------------------------
const ALLOWED_SORT_FIELDS = ["createdAt", "updatedAt", "amount", "claimType"];

export const claimPaginationValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be an integer >= 1")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
    .toInt(),

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

  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Order must be either 'asc' or 'desc'"),

  query("search").optional().trim().escape(),
];
