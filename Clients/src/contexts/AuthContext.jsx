import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import {
  login as loginRequest,
  register as registerRequest,
  logout as logoutRequest,
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem("accessToken") || null;
  });
  const [loading, setLoading] = useState(true);

  // Persist to localStorage
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  useEffect(() => {
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    else localStorage.removeItem("accessToken");
  }, [accessToken]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async ({ email, password }) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { user, accessToken } = res.data.data; // ✅ extract correctly

      // Store user in state and localStorage
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", accessToken);

      return { success: true, user };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await registerRequest(userData);

      if (res?.status === "success") {
        setUser(res.user);
        return { success: true };
      } else {
        return {
          success: false,
          message: res?.message || "Registration failed",
        };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      setAccessToken(null);
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
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
