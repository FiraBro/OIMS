import api from "./api";

// ==========================
// USER SERVICES
// ==========================

// Get policies belonging to the logged-in user
const getMyPolicies = async () => {
  const res = await api.get("/policies/my");
  return res.data;
};

// ==========================
// ADMIN SERVICES
// ==========================

// List all policies (with pagination)
const listPolicies = async (query = {}) => {
  const res = await api.get("/policies", {
    params: query, // { page, limit, status, search }
  });
  return res.data;
};

// Get a single policy by ID
const getPolicyById = async (id) => {
  const res = await api.get(`/policies/${id}`);
  return res.data;
};

// Update policy status (Approved / Active / etc.)
const updatePolicyStatus = async (id, status) => {
  const res = await api.put(`/policies/${id}/status`, { status });
  return res.data;
};

// Renew a policy
const requestPolicyRenewal = async (id, data) => {
  // data = { newEndDate, paymentReference }
  const res = await api.post(`/policies/${id}/renew`, data);
  return res.data;
};
const approvePolicyRenewal = async (id) => {
  const res = await api.post(`/policies/${id}/renew/approve`);
  return res.data;
};

// Cancel a policy
const cancelPolicy = async (id) => {
  const res = await api.put(`/policies/${id}/cancel`);
  return res.data;
};

// Delete a policy (admin only)
const deletePolicy = async (id) => {
  const res = await api.delete(`/policies/${id}`);
  return res.data;
};

export const policyService = {
  getMyPolicies,
  listPolicies,
  getPolicyById,
  updatePolicyStatus,
  requestPolicyRenewal,
  approvePolicyRenewal,
  cancelPolicy,
  deletePolicy,
};
