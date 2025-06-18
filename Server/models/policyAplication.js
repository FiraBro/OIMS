import mongoose from "mongoose";

const policyApplicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InsurancePlan",
      required: true,
    },
    documents: [String],
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    remarks: { type: String, default: "" },
  },
  { timestamps: true }
);

const PolicyApplication = mongoose.model(
  "PolicyApplication",
  policyApplicationSchema
);
export default PolicyApplication;
