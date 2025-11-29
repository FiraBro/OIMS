import Application from "../models/application.js";
import plan from "../models/plan.js";
import Policy from "../models/policy.js";
import AppError from "../utils/AppError.js";

class ApplicationService {
  // ==================================================
  // USER: APPLY FOR A POLICY
  // ==================================================
  async apply(data, userId) {
    // 1. Check plan exists
    const plans = await plan.findOne({
      _id: data.planId,
      isDeleted: false,
      status: "published",
    });

    if (!plans) throw new AppError("Insurance plan not found", 404);

    // 2. Validate date range
    if (new Date(data.endDate) <= new Date(data.startDate)) {
      throw new AppError("End date must be after start date", 400);
    }

    // 3. Create application
    const application = await Application.create({
      userId,
      planId: plans._id,
      startDate: data.startDate,
      endDate: data.endDate,
      documents: data.documents || [],
      createdBy: userId,
    });

    return application;
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
  // ADMIN: APPROVE APPLICATION
  // ==================================================
  async approve(id, adminId) {
    const app = await Application.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!app) throw new AppError("Application not found", 404);
    if (app.status !== "pending")
      throw new AppError("Only pending applications can be approved", 400);

    // MARK AS APPROVED
    app.status = "approved";
    app.updatedBy = adminId;
    await app.save();

    // CREATE POLICY AUTOMATICALLY
    const policy = await Policy.create({
      userId: app.userId,
      planId: app.planId,
      startDate: app.startDate,
      endDate: app.endDate,
      status: "active",
      policyNumber: "POL-" + Math.random().toString(36).substring(2, 10),
      createdBy: adminId,
    });

    return { application: app, policy };
  }

  // ==================================================
  // ADMIN: REJECT APPLICATION
  // ==================================================
  async reject(id, reason, adminId) {
    const app = await Application.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!app) throw new AppError("Application not found", 404);

    app.status = "rejected";
    app.rejectionReason = reason || "No reason provided";
    app.updatedBy = adminId;

    await app.save();
    return app;
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
