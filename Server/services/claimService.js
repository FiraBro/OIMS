import Claim from "../models/claim.js";
import Policy from "../models/policy.js";
import AppError from "../utils/AppError.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

class ClaimService {
  async createClaim(data, userId) {
    const policy = await Policy.findOne({
      _id: data.policyId,
      userId,
      isDeleted: false,
    });
    if (!policy) throw new AppError("Policy not found", 404);

    const claimNumber = `CLM-${crypto.randomBytes(6).toString("hex")}`;

    const claim = await Claim.create({
      ...data,
      claimNumber,
      userId,
      createdBy: userId,
    });

    return claim;
  }

  async getMyClaims(userId) {
    return await Claim.find({ userId, isDeleted: false })
      .populate("policyId")
      .sort({ createdAt: -1 })
      .lean();
  }

  async getClaimById(id, userId) {
    const claim = await Claim.findOne({ _id: id, isDeleted: false })
      .populate("policyId")
      .populate("userId");

    if (!claim) throw new AppError("Claim not found", 404);
    if (claim.userId._id.toString() !== userId)
      throw new AppError("Unauthorized", 403);

    return claim;
  }

  async listAllClaims({ page, limit }) {
    const skip = (page - 1) * limit;

    const claims = await Claim.find({ isDeleted: false })
      .populate("policyId")
      .populate("userId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Claim.countDocuments({ isDeleted: false });

    return { claims, total };
  }

  // ---------------------------
  // Update Claim Status & Send Email Notification
  // ---------------------------
  async updateStatus(id, status, adminId) {
    const claim = await Claim.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { status, updatedBy: adminId },
      { new: true }
    ).populate("userId");

    if (!claim) throw new AppError("Claim not found", 404);

    // Send notification email to user
    try {
      const subject = `Your claim ${claim.claimNumber} status has been updated`;
      const text = `Hello ${claim.userId.fullName},\n\nYour claim status has been updated to "${status}".\n\nThank you.`;
      await sendEmail({
        email: claim.userId.email,
        subject,
        text,
      });
    } catch (err) {
      console.error("Error sending status email:", err);
    }

    return claim;
  }

  async softDeleteClaim(id, adminId) {
    const claim = await Claim.findByIdAndUpdate(
      id,
      { isDeleted: true, updatedBy: adminId },
      { new: true }
    );

    if (!claim) throw new AppError("Claim not found", 404);
    return claim;
  }
}

export default new ClaimService();
