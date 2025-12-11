import policyService from "../services/policyService.js";
import catchAsync from "../utils/catchAsync.js";

// ==================================================
// USER: GET MY POLICIES
// ==================================================
export const getMyPolicies = catchAsync(async (req, res) => {
  const policies = await policyService.getMyPolicies(req.user.id);

  res.status(200).json({
    status: "success",
    results: policies.length,
    data: policies,
  });
});

// ==================================================
// USER: GET POLICY BY ID
// ==================================================
export const getPolicyById = catchAsync(async (req, res) => {
  const policy = await policyService.getPolicyById(req.params.id);

  res.status(200).json({
    status: "success",
    data: policy,
  });
});

// ==================================================
// ADMIN: LIST POLICIES (Pagination)
// ==================================================
export const listPolicies = catchAsync(async (req, res) => {
  const { page, limit } = req.query;

  const data = await policyService.listPolicies({
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  });

  res.status(200).json({
    status: "success",
    ...data,
  });
});

// ==================================================
// ADMIN: UPDATE POLICY STATUS
// ==================================================
export const updatePolicyStatus = catchAsync(async (req, res) => {
  const { status } = req.body;

  const updated = await policyService.updateStatus(
    req.params.id,
    status,
    req.user.id
  );

  res.status(200).json({
    status: "success",
    message: "Policy status updated successfully",
    data: updated,
  });
});

// ==================================================
// ADMIN: RENEW POLICY
// ==================================================
export const renewPolicy = catchAsync(async (req, res) => {
  const { newEndDate } = req.body;

  const policy = await policyService.renewPolicy(
    req.params.id,
    newEndDate,
    req.user.id
  );

  res.status(200).json({
    status: "success",
    message: "Policy renewed successfully",
    data: policy,
  });
});

// ==================================================
// ADMIN: CANCEL POLICY
// ==================================================
export const cancelPolicy = catchAsync(async (req, res) => {
  const { reason } = req.body;

  const policy = await policyService.cancelPolicy(
    req.params.id,
    reason,
    req.user.id
  );

  res.status(200).json({
    status: "success",
    message: "Policy cancelled successfully",
    data: policy,
  });
});

// ==================================================
// ADMIN: SOFT DELETE POLICY
// ==================================================
export const deletePolicy = catchAsync(async (req, res) => {
  const deleted = await policyService.softDeletePolicy(
    req.params.id,
    req.user.id
  );

  res.status(200).json({
    status: "success",
    message: "Policy deleted successfully",
    data: deleted,
  });
});
