import Claim from "../models/claim.js";
import Policy from "../models/policy.js";
import AppError from "../utils/AppError.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import NotificationService from "./notificationService.js"; // <-- for creating notifications
import mongoose from "mongoose"; // Required for isValidObjectId check

class ClaimService {
  // ---------------------------
  // Existing methods
  // ---------------------------

  async createClaim(data, userId) {
    // 1. Find the policy by ID OR by Policy Number
    // We check if data.policyId is a valid MongoDB ID format before searching by _id
    const isId = mongoose.isValidObjectId(data.policyId);

    const policy = await Policy.findOne({
      $and: [
        {
          $or: [
            { _id: isId ? data.policyId : null },
            { policyNumber: data.policyId },
          ],
        },
        { userId: userId }, // Security: Must belong to the logged-in user
        { isDeleted: false },
      ],
    });

    if (!policy) {
      throw new AppError(
        "Policy not found, unauthorized, or has been deleted.",
        404
      );
    }

    // 2. Generate unique claim number
    const claimNumber = `CLM-${crypto.randomBytes(6).toString("hex")}`;

    // 3. Create the claim using data from both the request and the found policy
    const claim = await Claim.create({
      // Fields from the Frontend request
      claimType: data.claimType,
      description: data.description,
      amount: data.amount,
      reason: data.description, // Mapping description to reason per your Model
      documentUrl: data.documentUrl,

      // Fields from the Policy we just found (The "Source of Truth")
      policyId: policy._id,
      policyNumber: policy.policyNumber,
      user: userId, // Mapping userId to user per your Model

      // System generated fields
      claimNumber,
      createdBy: userId,
    });

    return claim;
  }

  async getMyClaims(userId) {
    return await Claim.find({
      user: userId, // Match schema field "user"
      // Removed "isDeleted" because it's not in your schema
    })
      .populate("user", "fullName email") // Optional: get user details
      .sort({ submittedAt: -1 }) // Match schema field "submittedAt"
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

  async updateStatus(id, status, adminId) {
    const claim = await Claim.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { status, updatedBy: adminId },
      { new: true }
    ).populate("userId");

    if (!claim) throw new AppError("Claim not found", 404);

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

  // ---------------------------
  // NEW: Send Reminders for Pending Claims
  // ---------------------------
  async sendClaimReminders(daysPending = 3) {
    // Find claims that are pending for more than X days
    const pendingClaims = await Claim.find({
      status: "pending",
      isDeleted: false,
      createdAt: {
        $lte: new Date(Date.now() - daysPending * 24 * 60 * 60 * 1000),
      },
    }).populate("userId");

    for (const claim of pendingClaims) {
      if (!claim.userId) continue;

      // Create notification
      await NotificationService.createNotification({
        userId: claim.userId._id,
        title: "Pending Claim Reminder",
        message: `Your claim ${claim.claimNumber} is still pending. Please submit any required documents.`,
      });

      // Optional: send email
      try {
        const subject = `Reminder: Pending Claim ${claim.claimNumber}`;
        const text = `Hello ${claim.userId.fullName},\n\nYour claim is still pending. Please submit required documents.\n\nThank you.`;
        await sendEmail({
          email: claim.userId.email,
          subject,
          text,
        });
      } catch (err) {
        console.error("Error sending reminder email:", err);
      }
    }

    return pendingClaims.length; // return number of reminders sent
  }
}

export default new ClaimService();
