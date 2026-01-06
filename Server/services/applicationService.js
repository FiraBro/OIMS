import Application from "../models/application.js";
import Policy from "../models/policy.js";
import { validatePlan, validateDates } from "../utils/validation.js";
import AppError from "../utils/AppError.js";

import crypto from "crypto";

import Plan from "../models/plan.js"; // ✅ FIXED

class ApplicationService {
  // ==================================================
  // USER: APPLY FOR A POLICY
  // ==================================================
  async apply(data, userId) {
    // Validate plan
    const plan = await validatePlan(data.planId);

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

    // Create application with full formData
    const application = await Application.create({
      userId,
      planId: plan._id,
      personal: data.personal || {},
      nominee: data.nominee || {},
      medical: data.medical || {},
      payment: data.payment || {},
      agree: data.agree || false,
      documents: data.documents || [], // files
      createdBy: userId,
      status: "pending",
    });

    return application;
  }

  // ==================================================
  // ADMIN: APPROVE APPLICATION
  // ==================================================

  async approve(id, adminId) {
    try {
      const app = await Application.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!app) throw new AppError("Application not found", 404);
      if (app.status !== "pending")
        throw new AppError("Only pending applications can be approved", 400);

      // Load the plan using real model
      const planData = await Plan.findById(app.planId); // ✅ FIXED
      if (!planData) throw new AppError("Plan not found", 404);

      // Check for existing active policy
      const existingPolicy = await Policy.findOne({
        userId: app.userId,
        planId: app.planId,
        status: "active",
        isDeleted: false,
      });

      if (existingPolicy)
        throw new AppError(
          "User already has an active policy for this plan",
          400
        );

      // Generate start and end dates based on plan
      const startDate = new Date();
      const endDate = new Date();
      const durationMonths = planData.validityPeriod
        ? planData.validityPeriod / 30
        : 12;

      endDate.setMonth(endDate.getMonth() + durationMonths);

      // Approve application
      app.status = "approved";
      app.updatedBy = adminId;
      await app.save();

      // Create policy
      const policy = await Policy.create({
        userId: app.userId,
        planId: app.planId,
        startDate,
        endDate,
        premium: planData.premium,
        coverageAmount: planData.coverageAmount,
        status: "active",
        policyNumber: `POL-${crypto.randomBytes(6).toString("hex")}`,
        createdBy: adminId,
      });

      return { application: app, policy };
    } catch (err) {
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

  // USER: GET MY APPLICATIONS (Optimized)
  // ==================================================
  async getMyApplications(userId, { status = "" } = {}) {
    // 1. Build dynamic filter
    const filter = { userId, isDeleted: false };
    if (status) {
      filter.status = status;
    }

    // 2. Fetch data (Consider adding .limit() if users have 1000+ personal apps)
    const applications = await Application.find(filter)
      .populate("planId")
      .sort({ createdAt: -1 })
      .lean();

    // 3. Get Counts for Tab Badges (Efficient parallel execution)
    // This allows the frontend to show counts for ALL tabs in one request
    const countsArray = await Application.aggregate([
      { $match: { userId, isDeleted: false } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Transform aggregate array into a simple object: { pending: 5, approved: 10 ... }
    const counts = countsArray.reduce(
      (acc, curr) => {
        acc[curr._id] = curr.count;
        acc.all = (acc.all || 0) + curr.count;
        return acc;
      },
      { all: 0, pending: 0, approved: 0, rejected: 0 }
    );

    return {
      applications,
      counts,
    };
  }

  // ==================================================
  // ADMIN: LIST APPLICATIONS
  // ==================================================
  async list({ page = 1, limit = 10, search = "" }) {
    const skip = (page - 1) * limit;

    // 1. Build the filter object
    let filter = { isDeleted: false };

    // 2. Add search logic if a search term exists
    if (search) {
      filter.$or = [
        { "personal.fullName": { $regex: search, $options: "i" } },
        { "personal.email": { $regex: search, $options: "i" } },
      ];
    }

    // 3. Execute query
    const applications = await Application.find(filter)
      .populate("userId")
      .populate("planId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // 4. Count based on the SAME filter
    const total = await Application.countDocuments(filter);

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
