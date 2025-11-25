import mongoose from "mongoose";

const insurancePlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    premium: { type: Number, required: true },
    coverageAmount: { type: Number, required: true },
    description: { type: String },
    planType: {
      type: String,
      enum: ["individual", "family", "student"],
      default: "individual",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Indexes
insurancePlanSchema.index({ slug: 1 });
insurancePlanSchema.index({ isDeleted: 1 });
insurancePlanSchema.index({ status: 1 });
insurancePlanSchema.index({ premium: 1 });

export default mongoose.model("InsurancePlan", insurancePlanSchema);
