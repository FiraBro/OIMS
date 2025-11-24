import axios from "axios";

// Base axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL || "http://localhost:3001/api/v1",
  withCredentials: true,
});

// ----------------------------
// Axios interceptor to attach CSRF token
// ----------------------------
api.interceptors.request.use((config) => {
  const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];
  if (!SAFE_METHODS.includes(config.method.toUpperCase())) {
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
      const [name, value] = cookie.split("=");
      acc[name] = value;
      return acc;
    }, {});
    const csrfToken = cookies["XSRF-TOKEN"];
    if (csrfToken) config.headers["x-csrf-token"] = csrfToken;
  }
  return config;
});

// ====================== AUTH API ======================
export const register = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const login = async ({ email, password }) => {
  // Step 1: Get CSRF token
  const { data } = await api.get("/auth/csrf-token"); // <-- GET request to get token
  const csrfToken = data.csrfToken;

  // Step 2: POST login with email/password and token
  const res = await api.post(
    "/auth/login",
    { email, password },
    { headers: { "x-csrf-token": csrfToken } }
  );

  return res.data;
};

export const logout = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

export const refreshToken = async () => {
  const res = await api.post("/auth/refresh");
  return res.data;
};

// ====================== PASSWORD ======================
export const forgotPassword = async (email) => {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
};

export const resetPassword = async (token, newPassword, passwordConfirm) => {
  const res = await api.put(`/auth/reset-password/${token}`, {
    password: newPassword,
    passwordConfirm,
  });
  return res.data;
};

// ====================== EMAIL VERIFICATION ======================
export const verifyEmail = async (token) => {
  const res = await api.get(`/auth/verify-email/${token}`);
  return res.data;
};

export const resendVerification = async () => {
  const res = await api.post("/auth/resend-verification");
  return res.data;
};

// ====================== USER ======================
export const changePassword = async (oldPassword, newPassword) => {
  const res = await api.put("/auth/change-password", {
    oldPassword,
    newPassword,
  });
  return res.data;
};

export const updateEmail = async (newEmail) => {
  const res = await api.put("/auth/update-email", { newEmail });
  return res.data;
};

// ====================== SESSION ======================
export const getSessions = async () => {
  const res = await api.get("/auth/sessions");
  return res.data;
};

export const revokeSession = async (sessionId) => {
  const res = await api.delete(`/auth/sessions/${sessionId}`);
  return res.data;
};

// ====================== LOGOUT ALL ======================
export const logoutAllDevices = async () => {
  const res = await api.post("/auth/logout-all");
  return res.data;
};
