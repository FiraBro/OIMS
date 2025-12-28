import mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  policyNumber: { type: String, required: true },
  reason: { type: String, required: true },
  claimType: { type: String, required: true },
  amount: { type: Number },
  document: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  submittedAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date },
});

export default mongoose.model("Claim", claimSchema);
