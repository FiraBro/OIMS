import catchAsync from "../utils/catchAsync.js";
import policyService from "../services/policyService.js";

// =====================================
// USER: Enroll Into a Policy
// =====================================
export const enrollPolicy = catchAsync(async (req, res) => {
  const policy = await policyService.enrollPolicy(req.body, req.user.id);

  res.status(201).json({
    status: "success",
    message: "Policy enrolled successfully",
    data: policy,
  });
});

// =====================================
// USER: Get My Policies
// =====================================
export const getMyPolicies = catchAsync(async (req, res) => {
  const policies = await policyService.getMyPolicies(req.user.id);

  res.status(200).json({
    status: "success",
    results: policies.length,
    data: policies,
  });
});

// =====================================
// USER/ADMIN: Get Policy by ID
// =====================================
export const getPolicyById = catchAsync(async (req, res) => {
  const policy = await policyService.getPolicyById(req.params.id);

  res.status(200).json({
    status: "success",
    data: policy,
  });
});

// =====================================
// ADMIN: List All Policies (Paginated)
// =====================================
export const listAllPolicies = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const result = await policyService.listPolicies({
    page: Number(page),
    limit: Number(limit),
  });

  res.status(200).json({
    status: "success",
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: result.total,
    },
    data: result.policies,
  });
});

// =====================================
// ADMIN: Update Policy Status
// =====================================
export const updateStatus = catchAsync(async (req, res) => {
  const policy = await policyService.updateStatus(
    req.params.id,
    req.body.status,
    req.user.id
  );

  res.status(200).json({
    status: "success",
    message: "Policy status updated",
    data: policy,
  });
});

// =====================================
// ADMIN: Renew Policy
// =====================================
export const renewPolicy = catchAsync(async (req, res) => {
  const policy = await policyService.renewPolicy(
    req.params.id,
    req.body.newEndDate,
    req.user.id
  );

  res.status(200).json({
    status: "success",
    message: "Policy renewed successfully",
    data: policy,
  });
});

// =====================================
// ADMIN: Cancel Policy
// =====================================
export const cancelPolicy = catchAsync(async (req, res) => {
  const policy = await policyService.cancelPolicy(req.params.id, req.user.id);

  res.status(200).json({
    status: "success",
    message: "Policy cancelled successfully",
    data: policy,
  });
});

// =====================================
// ADMIN: Soft Delete Policy
// =====================================
export const softDeletePolicy = catchAsync(async (req, res) => {
  const policy = await policyService.softDeletePolicy(
    req.params.id,
    req.user.id
  );

  res.status(200).json({
    status: "success",
    message: "Policy deleted successfully",
    data: policy,
  });
});
