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
    const allowed = [
      "active",
      "pending",
      "expired",
      "pending_renewal",
      "cancelled",
    ];

    if (!allowed.includes(status)) {
      throw new AppError("Invalid status", 400);
    }

    const updated = await Policy.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { status, updatedBy: adminId },
      { new: true }
    );

    if (!updated) throw new AppError("Policy not found", 404);
    return updated;
  }

  // ==================================================
  // USER: REQUEST POLICY RENEWAL (BANK TRANSFER)
  // ==================================================
  async requestRenewal(policyId, userId, paymentReference) {
    const policy = await Policy.findById(policyId);

    if (!policy || policy.isDeleted) {
      throw new AppError("Policy not found", 404);
    }

    if (!["active", "expired"].includes(policy.status)) {
      throw new AppError("Policy not eligible for renewal", 400);
    }

    // Grace period: 30 days after expiry
    if (policy.status === "expired") {
      const daysExpired =
        (Date.now() - new Date(policy.endDate)) / (1000 * 60 * 60 * 24);

      if (daysExpired > 30) {
        throw new AppError("Renewal grace period expired", 400);
      }
    }

    // Prevent duplicate pending renewals
    const hasPending = policy.renewalHistory?.some(
      (r) => r.paymentStatus === "pending"
    );

    if (hasPending) {
      throw new AppError("A renewal request is already pending", 400);
    }

    // Calculate new end date (1 year extension)
    const newEndDate = new Date(policy.endDate);
    newEndDate.setFullYear(newEndDate.getFullYear() + 1);

    policy.renewalHistory = policy.renewalHistory || [];
    policy.renewalHistory.push({
      oldEndDate: policy.endDate,
      newEndDate,
      premium: policy.premium,
      paymentMethod: "bank_transfer",
      paymentStatus: "pending",
      paymentReference,
      requestedAt: new Date(),
    });

    policy.status = "pending_renewal";
    policy.updatedBy = userId;

    await policy.save();

    return {
      message: "Renewal request submitted. Awaiting payment verification.",
    };
  }

  // ==================================================
  // ADMIN: APPROVE RENEWAL (AFTER BANK VERIFICATION)
  // ==================================================
  async approveRenewal(policyId, adminId) {
    const policy = await Policy.findById(policyId);

    if (!policy || policy.isDeleted) {
      throw new AppError("Policy not found", 404);
    }

    const renewal = [...(policy.renewalHistory || [])]
      .reverse()
      .find((r) => r.paymentStatus === "pending");

    if (!renewal) {
      throw new AppError("No pending renewal found", 400);
    }

    renewal.paymentStatus = "verified";
    renewal.approvedAt = new Date();
    renewal.approvedBy = adminId;

    policy.endDate = renewal.newEndDate;
    policy.status = "active";
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
