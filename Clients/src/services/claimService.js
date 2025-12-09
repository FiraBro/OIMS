import api from "./api";

// ====== Claim Service ======
const claimsService = {
  getClaims: async (page = 1, limit = 10, filters = {}) => {
    const params = { page, limit, ...filters };
    const res = await api.get("/claims", { params });
    return res.data;
  },

  getClaimById: async (id) => {
    const res = await api.get(`/claims/${id}`);
    return res.data;
  },

  createClaim: async (formData) => {
    const res = await api.post("/claims", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  updateClaimStatus: async (id, status) => {
    const res = await api.patch(`/claims/${id}/status`, { status });
    return res.data;
  },

  deleteClaim: async (id) => {
    const res = await api.delete(`/claims/${id}`);
    return res.data;
  },
};

export default claimsService;
