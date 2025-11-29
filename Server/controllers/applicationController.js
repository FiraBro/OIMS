import catchAsync from "../utils/catchAsync.js";
import applicationService from "../services/applicationService.js";

export const applyForPolicy = catchAsync(async (req, res) => {
  const app = await applicationService.apply(req.body, req.user.id);

  res.status(201).json({
    status: "success",
    message: "Application submitted successfully",
    data: app,
  });
});

export const getMyApplications = catchAsync(async (req, res) => {
  const apps = await applicationService.getMyApplications(req.user.id);

  res.status(200).json({
    status: "success",
    results: apps.length,
    data: apps,
  });
});

export const approveApplication = catchAsync(async (req, res) => {
  const data = await applicationService.approve(req.params.id, req.user.id);

  res.status(200).json({
    status: "success",
    message: "Application approved and policy created",
    data,
  });
});

export const rejectApplication = catchAsync(async (req, res) => {
  const app = await applicationService.reject(
    req.params.id,
    req.body.reason,
    req.user.id
  );

  res.status(200).json({
    status: "success",
    message: "Application rejected",
    data: app,
  });
});

export const listApplications = catchAsync(async (req, res) => {
  const result = await applicationService.list(req.query);

  res.status(200).json({
    status: "success",
    ...result,
  });
});

export const deleteApplication = catchAsync(async (req, res) => {
  const deleted = await applicationService.softDelete(
    req.params.id,
    req.user.id
  );

  res.status(200).json({
    status: "success",
    message: "Application soft-deleted",
    data: deleted,
  });
});
