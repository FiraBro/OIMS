import api from "./api";

const refreshTokenService = async () => {
  try {
    const res = await api.post("/auth/refresh");
    return res.data;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error;
  }
};

export default refreshTokenService;
