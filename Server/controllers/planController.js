import catchAsync from "../utils/catchAsync.js";
import InsurancePlanService from "../services/PlanService.js";
export const createPlanController = catchAsync(async (req, res) => {
  const plan = await InsurancePlanService.createPlan(req.body, req.user.id);
  res.status(201).json({ status: "success", data: plan });
});

export const updatePlanController = catchAsync(async (req, res) => {
  const plan = await InsurancePlanService.updatePlan(
    req.params.id,
    req.body,
    req.user.id
  );
  res.json({ status: "success", data: plan });
});
export const getPlanByIdController = catchAsync(async (req, res, next) => {
  const plan = await InsurancePlanService.getPlanById(req.params.id);

  res.status(200).json({
    status: "success",
    data: plan,
  });
});

export const deletePlanController = catchAsync(async (req, res) => {
  const plan = await InsurancePlanService.softDeletePlan(req.params.id);
  res.json({ status: "success", data: plan });
});

export const listPlansAdminController = catchAsync(async (req, res) => {
  const result = await InsurancePlanService.listPlansAdmin(req.query);
  res.json({ status: "success", ...result });
});

export const listPlansPublicController = catchAsync(async (req, res) => {
  const plans = await InsurancePlanService.listPlansPublic(req.query);
  res.json({ status: "success", data: plans });
});

export const getPremiumStatsController = catchAsync(async (req, res) => {
  const stats = await InsurancePlanService.getPremiumStats();
  res.json({ status: "success", data: stats });
});
