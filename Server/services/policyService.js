import Policy from "../models/policy.js";
import Plan from "../models/plan.js";
import AppError from "../utils/AppError.js";
import crypto from "crypto";
import mongoose from "mongoose";

class PolicyService {
  // ==================================================
  // ENROLL USER INTO A POLICY (with transaction)
  // ==================================================
  async enrollPolicy(data, userId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const plan = await Plan.findOne({
        _id: data.planId,
        isDeleted: false,
        status: "published",
      }).lean();

      if (!plan) throw new AppError("Insurance plan not found", 404);

      // Validate dates
      if (new Date(data.endDate) <= new Date(data.startDate)) {
        throw new AppError("End date must be after start date", 400);
      }

      // Unique policy number
      const policyNumber = `POL-${crypto.randomBytes(6).toString("hex")}`;

      // Create policy with snapshot + premium frozen
      const policy = await Policy.create(
        [
          {
            userId,
            planId: plan._id,
            policyNumber,
            startDate: data.startDate,
            endDate: data.endDate,

            premium: plan.premium,
            currency: plan.currency || "USD",

            planSnapshot: {
              name: plan.name,
              coverageAmount: plan.coverageAmount,
              planType: plan.planType,
            },

            createdBy: userId,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return policy[0];
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }

  // ==================================================
  // GET ALL POLICIES OF LOGGED-IN USER
  // ==================================================
  async getMyPolicies(userId) {
    return await Policy.find({ userId, isDeleted: false })
      .populate("planId")
      .sort({ createdAt: -1 })
      .lean();
  }

  // ==================================================
  // GET SINGLE POLICY BY ID
  // ==================================================
  async getPolicyById(id) {
    const policy = await Policy.findOne({ _id: id, isDeleted: false })
      .populate("userId")
      .populate("planId");

    if (!policy) throw new AppError("Policy not found", 404);
    return policy;
  }

  // ==================================================
  // ADMIN: LIST POLICIES WITH PAGINATION
  // ==================================================
  async listPolicies({ page, limit }) {
    const skip = (page - 1) * limit;

    const policies = await Policy.find({ isDeleted: false })
      .populate("userId")
      .populate("planId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Policy.countDocuments({ isDeleted: false });

    return { policies, total };
  }

  // ==================================================
  // ADMIN: UPDATE POLICY STATUS
  // ==================================================
  async updateStatus(id, status, adminId) {
    const allowed = ["active", "pending", "expired", "renewed", "cancelled"];
    if (!allowed.includes(status))
      throw new AppError("Invalid status value", 400);

    const updated = await Policy.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { status, updatedBy: adminId },
      { new: true }
    );

    if (!updated) throw new AppError("Policy not found", 404);
    return updated;
  }

  // ==================================================
  // ADMIN: RENEW POLICY
  // ==================================================
  async renewPolicy(id, newEndDate, adminId) {
    const policy = await Policy.findById(id);

    if (!policy || policy.isDeleted)
      throw new AppError("Policy not found", 404);

    if (new Date(newEndDate) <= new Date(policy.endDate)) {
      throw new AppError("New end date must be after current end date", 400);
    }

    policy.status = "renewed";
    policy.endDate = newEndDate;
    policy.renewalCount += 1;
    policy.lastRenewedAt = new Date();
    policy.updatedBy = adminId;

    await policy.save();
    return policy;
  }

  // ==================================================
  // ADMIN: CANCEL POLICY
  // ==================================================
  async cancelPolicy(id, reason, adminId) {
    const policy = await Policy.findById(id);

    if (!policy || policy.isDeleted)
      throw new AppError("Policy not found", 404);

    policy.status = "cancelled";
    policy.cancellationReason = reason || "No reason provided";
    policy.cancelledAt = new Date();
    policy.updatedBy = adminId;

    await policy.save();
    return policy;
  }

  // ==================================================
  // ADMIN: SOFT DELETE POLICY
  // ==================================================
  async softDeletePolicy(id, adminId) {
    const deleted = await Policy.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, updatedBy: adminId },
      { new: true }
    );

    if (!deleted) throw new AppError("Policy not found", 404);
    return deleted;
  }
}

export default new PolicyService();
