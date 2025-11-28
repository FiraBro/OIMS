import mongoose from "mongoose";
import { PLAN_TYPES } from "../constants/planTypes.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
const insurancePlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    slug: { type: String, unique: true }, // slug for SEO-friendly URLs

    premium: { type: Number, required: true },

    coverageAmount: { type: Number, required: true },

    description: { type: String },

    // ---------------------------
    // PLAN TYPE (uses constants)
    // ---------------------------
    planType: {
      type: String,
      enum: Object.values(PLAN_TYPES),
      default: PLAN_TYPES.INDIVIDUAL,
    },

    // ---------------------------
    // PLAN STATUS (clean & consistent)
    // ---------------------------
    status: {
      type: String,
      enum: Object.values(STATUS_CODES),
      default: STATUS_CODES.PUBLISHED,
    },

    isDeleted: { type: Boolean, default: false },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Indexes
insurancePlanSchema.index({ slug: 1 });
insurancePlanSchema.index({ isDeleted: 1 });
insurancePlanSchema.index({ status: 1 });
insurancePlanSchema.index({ premium: 1 });

export default mongoose.model("Plan", insurancePlanSchema);
