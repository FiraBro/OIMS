import applicationService from "../services/applicationService.js";
import catchAsync from "../utils/catchAsync.js";

// ==================================================
// USER: APPLY FOR A POLICY
// ==================================================
export const applyForPolicy = catchAsync(async (req, res) => {
  const application = await applicationService.apply(req.body, req.user.id);

  res.status(201).json({
    status: "success",
    message: "Application submitted successfully",
    data: application,
  });
});

// ==================================================
// ADMIN: APPROVE APPLICATION
// ==================================================
export const approveApplication = catchAsync(async (req, res) => {
  const result = await applicationService.approve(req.params.id, req.user.id);

  res.status(200).json({
    status: "success",
    message: "Application approved successfully",
    data: result,
  });
});

// ==================================================
// ADMIN: REJECT APPLICATION
// ==================================================
export const rejectApplication = catchAsync(async (req, res) => {
  const { reason } = req.body;

  const result = await applicationService.reject(
    req.params.id,
    reason,
    req.user.id
  );

  res.status(200).json({
    status: "success",
    message: "Application rejected successfully",
    data: result,
  });
});

// ==================================================
// USER: GET MY APPLICATIONS
// ==================================================
export const getMyApplications = catchAsync(async (req, res) => {
  const apps = await applicationService.getMyApplications(req.user.id);

  res.status(200).json({
    status: "success",
    results: apps.length,
    data: apps,
  });
});

// ==================================================
// ADMIN: LIST APPLICATIONS
// ==================================================
export const listApplications = catchAsync(async (req, res) => {
  const { page, limit } = req.query;

  const data = await applicationService.list({
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  });

  res.status(200).json({
    status: "success",
    ...data,
  });
});

// ==================================================
// ADMIN: SOFT DELETE APPLICATION
// ==================================================
export const deleteApplication = catchAsync(async (req, res) => {
  const deleted = await applicationService.softDelete(
    req.params.id,
    req.user.id
  );

  res.status(200).json({
    status: "success",
    message: "Application deleted successfully",
    data: deleted,
  });
});
