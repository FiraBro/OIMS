import { createContext, useContext, useEffect, useState } from "react";
import {
  login as loginRequest,
  register as registerRequest,
  logout as logoutRequest,
  refreshToken as refreshTokenService, // fixed import name
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  const [loading, setLoading] = useState(true);

  // INITIAL LOAD: Try refreshing token
  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await refreshTokenService(); // backend uses http-only cookie
        if (data?.token) {
          localStorage.setItem("accessToken", data.token);
          setAccessToken(data.token);
        }
        setUser(data?.user || null);
      } catch (err) {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem("accessToken");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // LOGIN
  const login = async ({ email, password }) => {
    try {
      const data = await loginRequest({ email, password });
      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        setAccessToken(data.accessToken);
      }
      setUser(data?.user || null);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  // REGISTER
  const register = async (userData) => {
    try {
      const data = await registerRequest(userData);
      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        setAccessToken(data.accessToken);
      }
      setUser(data?.user || null);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await logoutRequest(); // optional backend logout
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.removeItem("accessToken");
      setAccessToken(null);
      setUser(null);
    }
  };

  // REFRESH TOKEN
  const refreshAccessToken = async () => {
    try {
      const data = await refreshTokenService();
      if (data?.token) {
        localStorage.setItem("accessToken", data.token);
        setAccessToken(data.token);
      }
      setUser(data?.user || null);
      return data?.token || null;
    } catch (err) {
      await logout();
      return null;
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
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
