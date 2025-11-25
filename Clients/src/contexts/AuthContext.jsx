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

  const decodeUser = (token) => {
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp && decoded.exp < now) {
        setUser(null);
        return;
      }
      setUser(decoded);
    } catch {
      setUser(null);
    }
  };

  // 🔥 FIRST: Try refresh token on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await refreshRequest(); // uses refreshToken cookie
        const token = res.accessToken;

        localStorage.setItem("accessToken", token);
        setAccessToken(token);
        decodeUser(token);
      } catch {
        // refresh failed → fallback to localStorage
        if (accessToken) decodeUser(accessToken);
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

  // REGISTER
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

  // LOGOUT
  const logout = async () => {
    try {
      await logoutRequest();
    } catch {}

    localStorage.removeItem("accessToken");
    setAccessToken(null);
    setUser(null);
  };

  // MANUAL REFRESH
  const refreshAccessToken = async () => {
    try {
      const data = await refreshRequest();
      const token = data.accessToken;

      localStorage.setItem("accessToken", token);
      setAccessToken(token);
      decodeUser(token);
      return token;
    } catch {
      logout();
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
