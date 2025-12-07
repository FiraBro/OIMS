import api from "./api";

// Fetch popular plans for preview
export const getPopularPlans = async () => {
  const res = await api.get("/plans/popular");
  return res.data; // ✅ return the actual array of plans
};

// Fetch a single plan by ID for detail page
export const getPlanById = async (planId) => {
  const res = await api.get(`/plans/public/${planId}`);
  return res.data; // ✅ return the plan object
};
