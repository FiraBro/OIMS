import api from "./api";

const insurancePlanService = {
  // ==============================
  // CREATE PLAN (Admin)
  // ==============================
  createPlan: async (data) => {
    const res = await api.post("/plans", data); // admin auth required
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
  // DELETE PLAN (Admin)
  // ==============================
  deletePlan: async (id) => {
    const res = await api.delete(`/plans/${id}`);
    return res.data;
  },

  // ==============================
  // GET PLAN BY ID (Public)
  // ==============================
  getPlanById: async (id) => {
    const res = await api.get(`/plans/id/${id}`);
    return res.data;
  },

  // ==============================
  // LIST PLANS (Admin)
  // ==============================
  listPlansAdmin: async (filters = {}) => {
    const cleaned = {};
    for (const key in filters) {
      if (
        filters[key] !== "" &&
        filters[key] !== undefined &&
        filters[key] !== null
      ) {
        cleaned[key] = filters[key];
      }
    }

    const res = await api.get("/plans/admin", {
      params: cleaned,
    });
    return res.data;
  },

  // ==============================
  // LIST PUBLIC PLANS
  // ==============================
  listPlansPublic: async (filters = {}) => {
    const cleaned = {};
    for (const key in filters) {
      if (
        filters[key] !== "" &&
        filters[key] !== undefined &&
        filters[key] !== null
      ) {
        cleaned[key] = filters[key];
      }
    }

    const res = await api.get("/plans", {
      params: cleaned,
    });

    return res.data;
  },

  // ==============================
  // PREMIUM STATISTICS
  // ==============================
  getPremiumStats: async () => {
    const res = await api.get("/plans/stats/premium");
    return res.data;
  },

  // ==============================
  // GET POPULAR PLANS
  // ==============================
  getPopularPlans: async (limit = 4) => {
    const res = await api.get("/plans/popular", {
      params: { limit },
    });

    return res.data;
  },
};

export default insurancePlanService;
