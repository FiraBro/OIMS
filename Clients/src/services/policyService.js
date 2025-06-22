// 📁 services/policyService.js
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1/policy";

export const policyService = {
  // applyForPolicy: async (formData) => {
  //   try {
  //     const response = await axios.post(`${API_URL}/apply`, formData, {
  //       headers: policyService.authHeader(),
  //     });
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || { message: "Policy application failed" };
  //   }
  // },

  applyForPolicy: async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/apply`, formData, {
        headers: {
          ...policyService.authHeader(), // ✅ Includes Authorization
          // ❌ DO NOT manually set Content-Type
        },
      });
      return response.data;
    } catch (error) {
      console.error("Policy application error:", error);
      throw error.response?.data || { message: "Policy application failed" };
    }
  },

  getUserApplications: async () => {
    try {
      const response = await axios.get(`${API_URL}/my-applications`, {
        headers: policyService.authHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Fetching applications failed" };
    }
  },

  getAllApplications: async () => {
    try {
      const response = await axios.get(`${API_URL}/applications`, {
        headers: policyService.authHeader(),
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Fetching all applications failed" }
      );
    }
  },

  updateApplicationStatus: async (id, data) => {
    try {
      const response = await axios.put(`${API_URL}/applications/${id}`, data, {
        headers: policyService.authHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Updating status failed" };
    }
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  authHeader: () => {
    const token = policyService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};
