import catchAsync from "../utils/catchAsync.js";
import claimService from "../services/claimService.js";

export const createClaim = catchAsync(async (req, res) => {
  const claim = await claimService.createClaim(req.body, req.user.id);
  res.status(201).json({ status: "success", data: claim });
});

export const getMyClaims = catchAsync(async (req, res) => {
  const claims = await claimService.getMyClaims(req.user.id);
  res.json({ status: "success", data: claims });
});

export const getClaimById = catchAsync(async (req, res) => {
  const claim = await claimService.getClaimById(req.params.id, req.user.id);
  res.json({ status: "success", data: claim });
});

export const listAllClaims = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await claimService.listAllClaims({
    page: Number(page),
    limit: Number(limit),
  });
  res.json({ status: "success", ...result });
});

export const updateStatus = catchAsync(async (req, res) => {
  const claim = await claimService.updateStatus(
    req.params.id,
    req.body.status,
    req.user.id
  );
  res.json({ status: "success", data: claim });
});

export const softDeleteClaim = catchAsync(async (req, res) => {
  const claim = await claimService.softDeleteClaim(req.params.id, req.user.id);
  res.json({ status: "success", message: "Claim deleted", data: claim });
});
