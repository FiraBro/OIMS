import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  login as loginRequest,
  register as registerRequest,
  logout as logoutRequest,
  refreshToken as refreshRequest,
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  const [loading, setLoading] = useState(true);

  // ----------------------------
  // Decode JWT and set user
  // ----------------------------
  const decodeUser = (token) => {
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch {
      setUser(null);
    }
  };

  // ----------------------------
  // Initialize on app load
  // ----------------------------
  useEffect(() => {
    if (accessToken) decodeUser(accessToken);
    setLoading(false);
  }, []);

  // ----------------------------
  // LOGIN
  // ----------------------------
  const login = async (email, password) => {
    try {
      const data = await loginRequest({ email, password });
      const token = data.accessToken;
      localStorage.setItem("accessToken", token);
      setAccessToken(token);
      decodeUser(token);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  // ----------------------------
  // REGISTER
  // ----------------------------
  const register = async (userData) => {
    try {
      const data = await registerRequest(userData);
      const token = data.accessToken;
      localStorage.setItem("accessToken", token);
      setAccessToken(token);
      decodeUser(token);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };

  // ----------------------------
  // LOGOUT
  // ----------------------------
  const logout = async () => {
    try {
      await logoutRequest();
    } catch (err) {
      console.log("Logout error:", err.message);
    }
    localStorage.removeItem("accessToken");
    setUser(null);
    setAccessToken(null);
  };

  // ----------------------------
  // REFRESH TOKEN
  // ----------------------------
  const refreshAccessToken = async () => {
    try {
      const data = await refreshRequest();
      const token = data.accessToken;
      localStorage.setItem("accessToken", token);
      setAccessToken(token);
      decodeUser(token);
      return token;
    } catch {
      logout(); // auto logout if refresh fails
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        register,
        logout,
        refreshAccessToken,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
