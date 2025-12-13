import api from "./api";

// ==========================
// USER SERVICES
// ==========================

// Apply for a policy (multipart/form-data)
const applyForPolicy = async (formData) => {
  console.log("Token from localStorage:", localStorage.getItem("token"));
  const res = await api.post("/applications/apply", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  console.log("res", res);
  return res.data;
};

// Get logged-in user's applications
const getMyApplications = async () => {
  const res = await api.get("/applications/my-applications");
  console.log(res);
  return res.data;
};

// ==========================
// ADMIN SERVICES
// ==========================

// List all applications (admin)
const listApplications = async () => {
  const res = await api.get("/applications");
  return res.data;
};

// Approve application (admin)
const approveApplication = async (id) => {
  const res = await api.patch(`/applications/approve/${id}`);
  return res.data;
};

// Reject application (admin)
const rejectApplication = async (id) => {
  const res = await api.patch(`/applications/reject/${id}`);
  return res.data;
};

// Delete application (admin)
const deleteApplication = async (id) => {
  const res = await api.delete(`/applications/${id}`);
  return res.data;
};

export const applicationService = {
  applyForPolicy,
  getMyApplications,
  listApplications,
  approveApplication,
  rejectApplication,
  deleteApplication,
};
