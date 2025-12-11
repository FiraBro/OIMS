import Application from "../models/application.js";
import Policy from "../models/policy.js";
import { validatePlan, validateDates } from "../utils/validation.js";
import AppError from "../utils/AppError.js";
import mongoose from "mongoose";
import crypto from "crypto";
class ApplicationService {
  // ==================================================
  // USER: APPLY FOR A POLICY
  // ==================================================
  async apply(data, userId) {
    const plan = await validatePlan(data.planId);
    validateDates(data.startDate, data.endDate);

    // Check for existing active policy
    const existingPolicy = await Policy.findOne({
      userId,
      planId: plan._id,
      status: "active",
      isDeleted: false,
    });
    if (existingPolicy)
      throw new AppError(
        "You already have an active policy for this plan",
        400
      );

    // Create application
    const application = await Application.create({
      userId,
      planId: plan._id,
      startDate: data.startDate,
      endDate: data.endDate,
      documents: data.documents || [],
      createdBy: userId,
    });

    return application;
  }

  // ==================================================
  // ADMIN: APPROVE APPLICATION
  // ==================================================
  async approve(id, adminId) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const app = await Application.findOne({
        _id: id,
        isDeleted: false,
      }).session(session);
      if (!app) throw new AppError("Application not found", 404);
      if (app.status !== "pending")
        throw new AppError("Only pending applications can be approved", 400);

      // Check for existing active policy
      const existingPolicy = await Policy.findOne({
        userId: app.userId,
        planId: app.planId,
        status: "active",
        isDeleted: false,
      }).session(session);
      if (existingPolicy)
        throw new AppError(
          "User already has an active policy for this plan",
          400
        );

      // Update application
      app.status = "approved";
      app.updatedBy = adminId;
      await app.save({ session });

      // Create policy
      const policy = await Policy.create(
        [
          {
            userId: app.userId,
            planId: app.planId,
            startDate: app.startDate,
            endDate: app.endDate,
            status: "active",
            policyNumber: `POL-${crypto.randomBytes(6).toString("hex")}`,
            createdBy: adminId,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return { application: app, policy: policy[0] };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }

  // ==================================================
  // ADMIN: REJECT APPLICATION
  // ==================================================
  async reject(id, reason, adminId) {
    const app = await Application.findOne({ _id: id, isDeleted: false });
    if (!app) throw new AppError("Application not found", 404);

    app.status = "rejected";
    app.rejectionReason = reason || "No reason provided";
    app.updatedBy = adminId;

    await app.save();
    return app;
  }

  // ==================================================
  // USER: GET MY APPLICATIONS
  // ==================================================
  async getMyApplications(userId) {
    return await Application.find({ userId, isDeleted: false })
      .populate("planId")
      .sort({ createdAt: -1 })
      .lean();
  }

  // ==================================================
  // ADMIN: LIST APPLICATIONS
  // ==================================================
  async list({ page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;

    const applications = await Application.find({ isDeleted: false })
      .populate("userId")
      .populate("planId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Application.countDocuments({ isDeleted: false });

    return {
      applications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ==================================================
  // ADMIN: SOFT DELETE APPLICATION
  // ==================================================
  async softDelete(id, adminId) {
    const app = await Application.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, updatedBy: adminId },
      { new: true }
    );

    if (!app) throw new AppError("Application not found", 404);
    return app;
  }
}

export default new ApplicationService();
