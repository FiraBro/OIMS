import policyService from "../services/policyService.js";
import catchAsync from "../utils/catchAsync.js";

// ==================================================
// USER: GET MY POLICIES
// ==================================================
export const getMyPolicies = catchAsync(async (req, res) => {
  // 1. Extract query params (with defaults)
  const { page, limit, search } = req.query;

  // 2. Pass them as an object to the service
  const result = await policyService.getMyPolicies(req.user.id, {
    page: page || 1,
    limit: limit || 10,
    search: search || "",
  });

  // 3. Update the response to include the new pagination metadata
  res.status(200).json({
    status: "success",
    results: result.applications.length, // count of current page
    data: {
      applications: result.applications,
      pagination: result.pagination,
    },
  });
});

// ==================================================
// USER: REQUEST POLICY RENEWAL
// ==================================================
export const requestPolicyRenewal = catchAsync(async (req, res) => {
  const { paymentReference } = req.body;

  const result = await policyService.requestRenewal(
    req.params.id,
    req.user.id,
    paymentReference
  );

  res.status(200).json({
    status: "success",
    message: "Renewal request submitted successfully. Awaiting admin approval.",
    data: result,
  });
});

// ==================================================
// ADMIN: APPROVE POLICY RENEWAL
// ==================================================
export const approvePolicyRenewal = catchAsync(async (req, res) => {
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
// USER/ADMIN: GET POLICY BY ID
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
  const { page, limit, search, category } = req.query;

  const data = await policyService.listPolicies({
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    search: search || "",
    category: category || "",
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
