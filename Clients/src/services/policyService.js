// services/policyService.js
import api from "./api";

const policyService = {
  // ==================================================
  // ENROLL USER INTO A POLICY
  // ==================================================
  enrollPolicy: async (data) => {
    // data: { planId, startDate, endDate }
    const res = await api.post("/policies/enroll", data);
    return res.data;
  },

  // ==================================================
  // GET ALL POLICIES OF LOGGED-IN USER
  // ==================================================
  getMyPolicies: async () => {
    const res = await api.get("/policies/me");
    return res.data;
  },

  // ==================================================
  // GET SINGLE POLICY BY ID
  // ==================================================
  getPolicyById: async (id) => {
    const res = await api.get(`/policies/${id}`);
    return res.data;
  },

  // ==================================================
  // ADMIN: LIST POLICIES (PAGINATION)
  // ==================================================
  listPolicies: async (filters = {}) => {
    // filters: { page, limit }
    const res = await api.get("/policies", {
      params: filters,
    });
    return res.data;
  },

  // ==================================================
  // ADMIN: UPDATE POLICY STATUS
  // ==================================================
  updateStatus: async (id, status) => {
    const res = await api.patch(`/policies/${id}/status`, { status });
    return res.data;
  },

  // ==================================================
  // ADMIN: RENEW POLICY
  // ==================================================
  renewPolicy: async (id, newEndDate) => {
    const res = await api.patch(`/policies/${id}/renew`, {
      newEndDate,
    });
    return res.data;
  },

  // ==================================================
  // ADMIN: CANCEL POLICY
  // ==================================================
  cancelPolicy: async (id, reason) => {
    const res = await api.patch(`/policies/${id}/cancel`, { reason });
    return res.data;
  },

  // ==================================================
  // ADMIN: SOFT DELETE POLICY
  // ==================================================
  softDeletePolicy: async (id) => {
    const res = await api.delete(`/policies/${id}`);
    return res.data;
  },
};

export default policyService;
