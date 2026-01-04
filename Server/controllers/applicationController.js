import applicationService from "../services/applicationService.js";
import catchAsync from "../utils/catchAsync.js";

// ==================================================
// USER: APPLY FOR A POLICY

export const applyForPolicy = async (req, res) => {
  try {
    // Safety check: if req.body.personal is missing, JSON.parse will receive an empty string/undefined and crash.
    // We use a fallback to "{}" string so it parses to an empty object.
    const personal = JSON.parse(req.body.personal || "{}");
    const nominee = JSON.parse(req.body.nominee || "{}");
    const medical = JSON.parse(req.body.medical || "{}");
    const payment = JSON.parse(req.body.payment || "{}");

    const planId = req.body.planId;
    const agree = req.body.agree === "true";

    // Ensure req.files exists (Multer puts files here)
    const documents = (req.files || []).map((file) => ({
      name: file.originalname,
      url: file.path,
      uploadedAt: new Date(),
    }));

    const application = await applicationService.apply(
      {
        personal,
        nominee,
        medical,
        payment,
        planId,
        agree,
        documents,
      },
      req.user.id
    );

    res.status(201).json({ status: "success", data: application });
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({
      status: "error",
      message: err.message || "Internal Server Error",
    });
  }
};

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
  // Add 'search' to the destructured query
  const { page, limit, search } = req.query;

  const data = await applicationService.list({
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    search: search || "", // Pass it to the service
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
