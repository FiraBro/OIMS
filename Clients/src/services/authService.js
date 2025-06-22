import axios from "axios";

const API_URL =
  import.meta.env.VITE_AUTH_API_URL || "http://localhost:5000/api/v1/auth";

export const authService = {
  register: async ({
    fullName,
    email,
    password,
    role,
    phone,
    address,
    dateOfBirth,
    gender,
  }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        fullName,
        email,
        password,
        role,
        phone,
        address,
        dateOfBirth,
        gender,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Registration failed" };
    }
  },

  login: async ({ email, password }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Login failed" };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  authHeader: () => {
    const token = userService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};
