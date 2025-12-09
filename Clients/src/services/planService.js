// services/planService.js
import api from "./api";

const planService = {
  // ==============================
  // CREATE PLAN  (Admin)
  // ==============================
  createPlan: async (data) => {
    const res = await api.post("/plans", data);
    return res.data;
  },

  // ==============================
  // UPDATE PLAN (Admin)
  // ==============================
  updatePlan: async (id, data) => {
    const res = await api.patch(`/plans/${id}`, data);
    return res.data;
  },

  // ==============================
  // GET PLAN BY ID
  // ==============================
  getPlanById: async (id) => {
    const res = await api.get(`/plans/${id}`);
    return res.data;
  },

  // ==============================
  // SOFT DELETE PLAN (Admin)
  // ==============================
  deletePlan: async (id) => {
    const res = await api.delete(`/plans/${id}`);
    return res.data;
  },

  // ==============================
  // LIST PLANS (ADMIN)
  // Supports pagination + filters
  // ==============================
  listPlansAdmin: async (filters = {}) => {
    const res = await api.get("/plans/admin", { params: filters });
    return res.data;
  },

  // ==============================
  // LIST PUBLIC PLANS
  // ==============================
  listPlansPublic: async (filters = {}) => {
    const res = await api.get("/plans", { params: filters });
    return res.data;
  },

  // ==============================
  // PREMIUM STATISTICS (Admin)
  // ==============================
  getPremiumStats: async () => {
    const res = await api.get("/plans/stats/premium");
    return res.data;
  },

  // ==============================
  // GET POPULAR PLANS (Public)
  // ==============================
  getPopularPlans: async (limit = 4) => {
    const res = await api.get("/plans/popular", {
      params: { limit },
    });

    return res.data;
  },
};

export default planService;
