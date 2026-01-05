import React, { Suspense, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { router } from "./routers";
import { useAuthStore } from "@/stores/authStore";
import { useEnterpriseDashboard } from "./hooks/useAdmin";
import MaintenancePage from "./components/common/Maintenance";
export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const user = useAuthStore((state) => state.user);

  // Fetch global settings (Maintenance Mode, etc.)

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // App.jsx
  const { settings, isLoading } = useEnterpriseDashboard();

  if (isLoading) return null;

  // Convert to strict boolean (handles true, "true", or undefined)
  const isMaintenanceActive =
    settings?.maintenanceMode === true ||
    String(settings?.maintenanceMode) === "true";
  const isUserNotAdmin = user?.role !== "admin";

  console.log("FINAL GATE CHECK:", {
    maintenanceInDB: settings?.maintenanceMode,
    isMaintenanceActive,
    isUserNotAdmin,
  });

  if (isMaintenanceActive && isUserNotAdmin) {
    return <MaintenancePage />;
  }

  return (
    <>
      <Suspense fallback={null}>
        <RouterProvider router={router} />
      </Suspense>

      <ToastContainer
        position="top-right" // Bot-style position
        autoClose={6000} // 4 seconds (500 was too fast!)
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light" // Keeps it clean white
      />
    </>
  );
}
