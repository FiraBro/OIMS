import catchAsync from "../utils/catchAsync.js";
import claimService from "../services/claimService.js";

// claimController.js
export const createClaim = catchAsync(async (req, res) => {
  // 1. Extract the file path if a file was uploaded
  // Note: Depending on your storage (Local/Cloudinary/S3),
  // this might be req.file.path or req.file.location
  const documentUrl = req.file ? req.file.path : null;

  // 2. Pass the body data, user ID, and the document URL to the service
  const claim = await claimService.createClaim(
    req.body,
    req.user.id,
    documentUrl
  );

  res.status(201).json({
    status: "success",
    data: claim,
  });
});

export const getMyClaims = catchAsync(async (req, res) => {
  const claims = await claimService.getMyClaims(req.user.id);
  res.json({ status: "success", data: claims });
});

export const getClaimById = catchAsync(async (req, res) => {
  const claim = await claimService.getClaimById(req.params.id, req.user.id);
  res.json({ status: "success", data: claim });
});

// controller.js
export const listAllClaims = catchAsync(async (req, res) => {
  // Extract search from the query parameters
  const { page = 1, limit = 10, search = "" } = req.query;

  const result = await claimService.listAllClaims({
    page: Number(page),
    limit: Number(limit),
    search: search, // Pass it to the service
  });

  res.json({ status: "success", ...result });
});

export const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const adminId = req.user._id; // <- no need to send from frontend
  console.log("Update claim request:", { id, status, adminId });
  try {
    const claim = await claimService.updateStatus(id, status, adminId);
    res.json({ success: true, claim });
  } catch (err) {
    console.error("Update claim error:", err);
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Failed to update claim" });
  }
};

export const softDeleteClaim = catchAsync(async (req, res) => {
  const claim = await claimService.softDeleteClaim(req.params.id, req.user.id);
  res.json({ status: "success", message: "Claim deleted", data: claim });
});
