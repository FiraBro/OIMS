import api from "./api"; // Assuming your axios instance is in this file

export const userService = {
  /**
   * Get all registered users and identify plan applicants
   * Returns: { registeredUsers: [], planApplicants: [], summary: {} }
   */
  getUserAnalysis: async () => {
    try {
      const response = await api.get("/users/analysis");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Fetch all users (standard list)
   */
  getAllUsers: async () => {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get specific user details
   */
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update user details (Role, Name, etc.)
   */
  updateUser: async (id, userData) => {
    try {
      const response = await api.patch(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete/Remove a user from the system
   */
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Toggle user suspension or verification status
   */
  toggleUserStatus: async (id, statusData) => {
    try {
      const response = await api.patch(`/users/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
