import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "@/services/authService";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  /* =====================================
   🔹 HYDRATE AUTH (ONCE)
  ===================================== */
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setAccessToken(storedToken);
      }
    } catch (err) {
      console.error("Auth hydration failed", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setAuthReady(true);
    }
  }, []);

  /* =====================================
   🔹 SYNC STATE → localStorage
  ===================================== */
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("token", accessToken);
    } else {
      localStorage.removeItem("token");
    }
  }, [accessToken]);

  /* =====================================
   🔹 LOGIN
  ===================================== */
  const login = async (credentials) => {
    const res = await authService.login(credentials);

    if (res.status === "success" && res.data) {
      setUser(res.data.user);
      setAccessToken(res.data.accessToken);
    } else {
      // Optional: handle error response
      throw new Error(res?.message || "Login failed");
    }

    return res;
  };

  /* =====================================
   🔹 LOGOUT (FAIL-SAFE)
  ===================================== */
  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // backend failure should NOT block UI logout
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  };

  /* =====================================
   🔹 GUARD
  ===================================== */
  if (!authReady) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        authReady,
        isAuthenticated: Boolean(user && accessToken),

        login,
        logout,
        register: authService.register,
        forgotPassword: authService.forgotPassword,
        resetPassword: authService.resetPassword,
        verifyEmail: authService.verifyEmail,
        resendVerificationEmail: authService.resendVerificationEmail,
        changePassword: authService.changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
