import mongoose from "mongoose";

const insurancePlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  policyNumber: {
    type: String,
    unique: true,
    required: true,
  },
  premium: { type: Number, required: true }, // cost per period
  coverageDetails: { type: String },
  durationMonths: { type: Number, required: true }, // plan duration in months
  createdAt: { type: Date, default: Date.now },
});

const InsurancePlan = mongoose.model("InsurancePlan", insurancePlanSchema);
export default InsurancePlan;
