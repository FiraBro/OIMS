import Policy from "../models/policy.js";
import AppError from "../utils/AppError.js";

class PolicyService {
  // ==================================================
  // USER: GET ALL POLICIES
  // ==================================================
  async getMyPolicies(userId) {
    return await Policy.find({ userId, isDeleted: false })
      .populate("planId")
      .sort({ createdAt: -1 })
      .lean();
  }

  // ==================================================
  // USER: GET SINGLE POLICY
  // ==================================================
  async getPolicyById(id) {
    const policy = await Policy.findOne({ _id: id, isDeleted: false })
      .populate("userId")
      .populate("planId");

    if (!policy) throw new AppError("Policy not found", 404);
    return policy;
  }

  // ==================================================
  // ADMIN: LIST POLICIES
  // ==================================================
  async listPolicies({ page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;

    const policies = await Policy.find({ isDeleted: false })
      .populate("userId")
      .populate("planId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Policy.countDocuments({ isDeleted: false });

    return {
      policies,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ==================================================
  // ADMIN: UPDATE POLICY STATUS
  // ==================================================
  async updateStatus(id, status, adminId) {
    const allowed = ["active", "pending", "expired", "renewed", "cancelled"];
    if (!allowed.includes(status)) throw new AppError("Invalid status", 400);

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

    if (new Date(newEndDate) <= new Date(policy.endDate))
      throw new AppError("New end date must be after current end date", 400);

    policy.status = "renewed";
    policy.endDate = newEndDate;
    policy.renewalCount = (policy.renewalCount || 0) + 1;
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
