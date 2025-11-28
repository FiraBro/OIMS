// services/insurancePlanService.js
import mongoose from "mongoose";
import slugify from "slugify";
import InsurancePlan from "../models/plan.js";
import Policy from "../models/policy.js";
import AppError from "../utils/AppError.js";
import { PLAN_TYPES } from "../constants/planTypes.js"; // ✅ import plan types

class InsurancePlanService {
  // ---------------------------
  // CREATE PLAN
  // ---------------------------
  async createPlan(data, userId) {
    const slug = slugify(data.name, { lower: true });

    const exists = await InsurancePlan.findOne({
      slug,
      isDeleted: false,
    }).lean();

    if (exists) throw new AppError("Plan name already exists", 400);

    // ✅ Validate plan type
    if (data.planType && !Object.values(PLAN_TYPES).includes(data.planType)) {
      throw new AppError("Invalid plan type", 400);
    }

    return await InsurancePlan.create({
      ...data,
      slug,
      createdBy: userId,
    });
  }

  // ---------------------------
  // UPDATE PLAN
  // ---------------------------
  async updatePlan(id, data, userId) {
    if (data.name) data.slug = slugify(data.name, { lower: true });

    // ✅ Validate plan type if updating
    if (data.planType && !Object.values(PLAN_TYPES).includes(data.planType)) {
      throw new AppError("Invalid plan type", 400);
    }

    const plan = await InsurancePlan.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { ...data, updatedBy: userId },
      { new: true }
    ).lean();

    if (!plan) throw new AppError("Plan not found", 404);
    return plan;
  }

  // ---------------------------
  // GET PLAN BY ID
  // ---------------------------
  async getPlanById(id) {
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid plan ID", 400);
    }

    const plan = await InsurancePlan.findOne({
      _id: id,
      isDeleted: false,
    }).lean();

    if (!plan) {
      throw new AppError("Plan not found", 404);
    }

    return plan;
  }

  // ---------------------------
  // SOFT DELETE PLAN
  // ---------------------------
  async softDeletePlan(id) {
    // Check for active approved policies under this plan
    const activePolicies = await Policy.countDocuments({
      planId: id,
      status: "approved",
    });

    if (activePolicies > 0) {
      throw new AppError(
        "Cannot delete plan with active approved policies",
        400
      );
    }

    const plan = await InsurancePlan.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    ).lean();

    if (!plan) throw new AppError("Plan not found", 404);

    return plan;
  }

  // ---------------------------
  // LIST PLANS (ADMIN)
  // ---------------------------
  async listPlansAdmin(filters) {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
      planType,
      status,
      minPremium,
      maxPremium,
      search,
    } = filters;

    const skip = (page - 1) * limit;
    const query = { isDeleted: false };

    if (planType) query.planType = planType;
    if (status) query.status = status;

    if (minPremium || maxPremium) query.premium = {};
    if (minPremium) query.premium.$gte = parseFloat(minPremium);
    if (maxPremium) query.premium.$lte = parseFloat(maxPremium);

    if (search) query.name = { $regex: search, $options: "i" };

    const plans = await InsurancePlan.find(query)
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await InsurancePlan.countDocuments(query);

    return {
      plans,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ---------------------------
  // LIST PUBLIC PLANS
  // ---------------------------
  async listPlansPublic(filters = {}) {
    const { planType, minPremium, maxPremium, search } = filters;

    const query = { isDeleted: false, status: "published" };

    if (planType) query.planType = planType;

    if (minPremium || maxPremium) query.premium = {};
    if (minPremium) query.premium.$gte = parseFloat(minPremium);
    if (maxPremium) query.premium.$lte = parseFloat(maxPremium);

    if (search) query.name = { $regex: search, $options: "i" };

    return await InsurancePlan.find(query).lean();
  }

  // ---------------------------
  // PREMIUM STATISTICS
  // ---------------------------
  async getPremiumStats() {
    const result = await InsurancePlan.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          totalPremiums: { $sum: "$premium" },
          averagePremium: { $avg: "$premium" },
          minPremium: { $min: "$premium" },
          maxPremium: { $max: "$premium" },
          count: { $sum: 1 },
        },
      },
    ]);

    return (
      result[0] || {
        totalPremiums: 0,
        averagePremium: 0,
        minPremium: 0,
        maxPremium: 0,
        count: 0,
      }
    );
  }
}

export default new InsurancePlanService();
